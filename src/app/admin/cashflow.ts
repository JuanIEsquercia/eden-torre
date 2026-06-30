import 'server-only'
import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'

export interface MonthRow {
    key: string        // YYYY-MM
    label: string      // "Ene 2026"
    projected: number
    collected: number
    pending: number
    total: number
    paidCount: number
    isCurrentMonth: boolean
    isPast: boolean
}

export interface CurrencyBlock {
    currency: string
    anticipo: number
    months: MonthRow[]
    totalProjected: number
    totalCollected: number
    totalPending: number
    totalCuotas: number
    totalPaid: number
    overdueCount: number
    overdueAmount: number
}

export interface CashFlowData {
    blocks: CurrencyBlock[]
    ventasCount: number
    generatedAt: string
}

function monthLabel(key: string): string {
    const [year, month] = key.split('-')
    const d = new Date(Number(year), Number(month) - 1, 1)
    return d.toLocaleDateString('es-AR', { month: 'short', year: 'numeric' })
}

export const getCashFlowData = unstable_cache(
    async (): Promise<CashFlowData> => {
        const [ventas, cuotas] = await Promise.all([
            prisma.sale.findMany({ select: { id: true, currency: true, deliveryAmount: true } }),
            prisma.installment.findMany({
                select: { saleId: true, dueDate: true, amount: true, status: true },
            }),
        ])

        // Map saleId → { currency, deliveryAmount }
        const ventaMap = new Map<string, { currency: string; deliveryAmount: number }>()
        ventas.forEach(v => {
            ventaMap.set(v.id, {
                currency: v.currency ?? 'USD',
                deliveryAmount: v.deliveryAmount ? Number(v.deliveryAmount) : 0,
            })
        })

        // Accumulate per currency
        type CurrencyAcc = {
            anticipo: number
            months: Map<string, { projected: number; collected: number; total: number; paidCount: number }>
            totalCuotas: number
            totalPaid: number
            overdueCount: number
            overdueAmount: number
        }
        const byCurrency = new Map<string, CurrencyAcc>()

        const ensureCurrency = (c: string) => {
            if (!byCurrency.has(c)) {
                byCurrency.set(c, { anticipo: 0, months: new Map(), totalCuotas: 0, totalPaid: 0, overdueCount: 0, overdueAmount: 0 })
            }
            return byCurrency.get(c)!
        }

        // Anticipo por currency
        ventas.forEach(v => {
            const meta = ventaMap.get(v.id)!
            ensureCurrency(meta.currency).anticipo += meta.deliveryAmount
        })

        const nowKey = new Date().toISOString().substring(0, 7)

        // Procesar cuotas/installments
        cuotas.forEach(inst => {
            const meta = ventaMap.get(inst.saleId)
            if (!meta) return

            const { currency } = meta
            const acc = ensureCurrency(currency)
            const monthKey = inst.dueDate.toISOString().substring(0, 7)
            const amount = inst.amount ? Number(inst.amount) : 0

            if (!acc.months.has(monthKey)) {
                acc.months.set(monthKey, { projected: 0, collected: 0, total: 0, paidCount: 0 })
            }
            const m = acc.months.get(monthKey)!

            m.projected += amount
            m.total += 1
            acc.totalCuotas += 1

            if (inst.status === 'pagada') {
                m.collected += amount
                m.paidCount += 1
                acc.totalPaid += 1
            } else if (inst.status === 'vencida' || (inst.status === 'pendiente' && monthKey < nowKey)) {
                acc.overdueCount += 1
                acc.overdueAmount += amount
            }
        })

        const blocks: CurrencyBlock[] = Array.from(byCurrency.entries()).map(([currency, acc]) => {
            const months: MonthRow[] = Array.from(acc.months.entries())
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([key, m]) => ({
                    key,
                    label: monthLabel(key),
                    projected: Math.round(m.projected * 100) / 100,
                    collected: Math.round(m.collected * 100) / 100,
                    pending: Math.round((m.projected - m.collected) * 100) / 100,
                    total: m.total,
                    paidCount: m.paidCount,
                    isCurrentMonth: key === nowKey,
                    isPast: key < nowKey,
                }))

            const totalProjected = months.reduce((s, m) => s + m.projected, 0)
            const totalCollected = months.reduce((s, m) => s + m.collected, 0)

            return {
                currency,
                anticipo: Math.round(acc.anticipo * 100) / 100,
                months,
                totalProjected: Math.round(totalProjected * 100) / 100,
                totalCollected: Math.round(totalCollected * 100) / 100,
                totalPending: Math.round((totalProjected - totalCollected) * 100) / 100,
                totalCuotas: acc.totalCuotas,
                totalPaid: acc.totalPaid,
                overdueCount: acc.overdueCount,
                overdueAmount: Math.round(acc.overdueAmount * 100) / 100,
            }
        })

        return {
            blocks,
            ventasCount: ventas.length,
            generatedAt: new Date().toISOString(),
        }
    },
    ['cash-flow'],
    { tags: ['cuotas'], revalidate: false }
)
