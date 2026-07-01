'use server'

import { prisma } from '@/lib/prisma'
import type { Currency as PrismaCurrency, InstallmentStatus } from '@prisma/client'
import { revalidatePath, revalidateTag } from 'next/cache'

export type Currency = 'USD' | 'ARS'
export type CuotaStatus = 'pendiente' | 'pagada' | 'vencida'
export type IndexType = 'CAC' | 'IPC' | 'UVA' | 'Dólar oficial' | 'Otro'

export interface Cuota {
    id: string
    number: number
    dueDate: string        // YYYY-MM-DD
    amount: number
    status: CuotaStatus
    paymentDate?: string   // YYYY-MM-DD, set when paid
    appliedPercentage?: number
}

export interface Venta {
    id: string
    buyerName: string
    buyerLastName: string
    buyerDni: string
    buyerPhone: string
    buyerEmail: string
    unitId: string         // UUID de la propiedad (propertyId en DB)
    closingValue: number
    currency: Currency
    deliveryPercentage: number
    deliveryAmount: number
    installmentCount: number
    installmentsBalance: number
    installmentBaseAmount: number
    updatableIndex: boolean
    indexType?: IndexType
    boletoDate: string     // YYYY-MM-DD
    createdAt: Date
}

// Tipos derivados del cliente Prisma para garantizar compatibilidad
type SaleRow = Awaited<ReturnType<typeof prisma.sale.findMany>>[number]
type InstallmentRow = Awaited<ReturnType<typeof prisma.installment.findMany>>[number]

function mapVenta(row: SaleRow): Venta {
    return {
        id: row.id,
        buyerName: row.buyerName,
        buyerLastName: row.buyerLastName,
        buyerDni: row.buyerDni,
        buyerPhone: row.buyerPhone ?? '',
        buyerEmail: row.buyerEmail ?? '',
        unitId: row.propertyId ?? '',
        closingValue: row.closingValue ? Number(row.closingValue) : 0,
        currency: (row.currency ?? 'USD') as Currency,
        deliveryPercentage: row.deliveryPercentage ? Number(row.deliveryPercentage) : 0,
        deliveryAmount: row.deliveryAmount ? Number(row.deliveryAmount) : 0,
        installmentCount: row.installmentCount ?? 0,
        installmentsBalance: row.installmentsBalance ? Number(row.installmentsBalance) : 0,
        installmentBaseAmount: row.installmentBaseAmount ? Number(row.installmentBaseAmount) : 0,
        updatableIndex: row.updatableIndex ?? false,
        indexType: (row.indexType as IndexType | null) ?? undefined,
        boletoDate: row.boletoDate ? row.boletoDate.toISOString().split('T')[0] : '',
        createdAt: row.createdAt,
    }
}

function mapCuota(row: InstallmentRow): Cuota {
    return {
        id: row.id,
        number: row.number,
        dueDate: row.dueDate.toISOString().split('T')[0],
        amount: row.amount ? Number(row.amount) : 0,
        status: row.status as CuotaStatus,
        paymentDate: row.paymentDate?.toISOString().split('T')[0] ?? undefined,
        appliedPercentage: row.appliedPercentage ? Number(row.appliedPercentage) : undefined,
    }
}

function generateInstallments(boletoDate: string, count: number, baseAmount: number) {
    const boleto = new Date(boletoDate + 'T12:00:00')
    return Array.from({ length: count }, (_, i) => {
        const due = new Date(boleto.getFullYear(), boleto.getMonth() + i + 1, 1)
        return {
            number: i + 1,
            dueDate: due,
            amount: Math.round(baseAmount * 100) / 100,
            status: 'pendiente' as InstallmentStatus,
        }
    })
}

export async function getVentas(): Promise<Venta[]> {
    const rows = await prisma.sale.findMany({ orderBy: { createdAt: 'desc' } })
    return rows.map(mapVenta)
}

export async function getVenta(id: string): Promise<Venta | null> {
    const row = await prisma.sale.findUnique({ where: { id } })
    return row ? mapVenta(row) : null
}

export async function getCuotas(ventaId: string): Promise<Cuota[]> {
    const rows = await prisma.installment.findMany({
        where: { saleId: ventaId },
        orderBy: { number: 'asc' },
    })
    return rows.map(mapCuota)
}

export async function createSale(formData: FormData): Promise<{ error?: string; success?: boolean }> {
    try {
        const unitId = formData.get('unitId') as string
        const closingValue = Number(formData.get('closingValue'))
        const deliveryPercentage = Number(formData.get('deliveryPercentage'))
        const installmentCount = Number(formData.get('installmentCount'))
        const boletoDate = formData.get('boletoDate') as string

        if (!unitId || !closingValue || !boletoDate) {
            return { error: 'Faltan datos obligatorios.' }
        }

        const deliveryAmount = Math.round(closingValue * deliveryPercentage / 100 * 100) / 100
        const installmentsBalance = Math.round((closingValue - deliveryAmount) * 100) / 100
        const installmentBaseAmount = installmentCount > 0
            ? Math.round(installmentsBalance / installmentCount * 100) / 100
            : 0

        const updatableIndex = formData.get('updatableIndex') === 'on'
        const rawIndex = formData.get('indexType') as string

        await prisma.$transaction([
            prisma.sale.create({
                data: {
                    buyerName: formData.get('buyerName') as string,
                    buyerLastName: formData.get('buyerLastName') as string,
                    buyerDni: formData.get('buyerDni') as string,
                    buyerPhone: formData.get('buyerPhone') as string,
                    buyerEmail: formData.get('buyerEmail') as string,
                    propertyId: unitId,
                    closingValue,
                    currency: (formData.get('currency') as string) as PrismaCurrency,
                    deliveryPercentage,
                    deliveryAmount,
                    installmentCount,
                    installmentsBalance,
                    installmentBaseAmount,
                    updatableIndex,
                    indexType: updatableIndex && rawIndex ? rawIndex : null,
                    boletoDate: new Date(boletoDate + 'T12:00:00'),
                    installments: {
                        create: generateInstallments(boletoDate, installmentCount, installmentBaseAmount),
                    },
                },
            }),
            prisma.property.update({
                where: { id: unitId },
                data: { status: 'sold', updatedAt: new Date() },
            }),
        ])

        revalidatePath('/admin/sales')
        revalidatePath('/admin/properties')
        revalidatePath('/properties')
        revalidatePath('/')
        revalidateTag('cuotas', 'everything')
        return { success: true }
    } catch (err) {
        console.error('[createSale]', err)
        return { error: 'Error al registrar la venta. Intentá de nuevo.' }
    }
}

export async function deleteSale(ventaId: string, unitId: string): Promise<{ error?: string }> {
    try {
        await prisma.$transaction([
            prisma.sale.delete({ where: { id: ventaId } }),
            prisma.property.update({
                where: { id: unitId },
                data: { status: 'available', updatedAt: new Date() },
            }),
        ])
        revalidatePath('/admin/sales')
        revalidatePath('/admin/properties')
        revalidatePath('/properties')
        revalidatePath('/')
        revalidateTag('cuotas', 'everything')
        return {}
    } catch (err) {
        console.error('[deleteSale]', err)
        return { error: 'Error al eliminar la venta. Intentá de nuevo.' }
    }
}

export async function updateCuotaStatus(
    ventaId: string,
    cuotaId: string,
    currentStatus: CuotaStatus
): Promise<void> {
    const nextStatus: CuotaStatus = currentStatus === 'pagada' ? 'pendiente' : 'pagada'

    await prisma.installment.update({
        where: { id: cuotaId },
        data: {
            status: nextStatus as InstallmentStatus,
            paymentDate: nextStatus === 'pagada' ? new Date() : null,
        },
    })

    revalidatePath(`/admin/sales/${ventaId}`)
    revalidateTag('cuotas', 'everything')
}

export async function updateCuotaAmount(
    ventaId: string,
    cuotaId: string,
    amount: number
): Promise<void> {
    await prisma.installment.update({
        where: { id: cuotaId },
        data: { amount },
    })
    revalidatePath(`/admin/sales/${ventaId}`)
    revalidateTag('cuotas', 'everything')
}

export async function applyPercentageUpdate(
    ventaId: string,
    percentage: number
): Promise<{ error?: string }> {
    if (percentage === 0) return { error: 'El porcentaje no puede ser 0.' }

    const pendientes = await prisma.installment.findMany({
        where: { saleId: ventaId, status: 'pendiente' as InstallmentStatus },
    })

    if (pendientes.length === 0) return { error: 'No hay cuotas pendientes para actualizar.' }

    await prisma.$transaction(
        pendientes.map(inst => {
            const currentAmount = Number(inst.amount)
            const newAmount = Math.round(currentAmount * (1 + percentage / 100) * 100) / 100
            return prisma.installment.update({
                where: { id: inst.id },
                data: { amount: newAmount, appliedPercentage: percentage },
            })
        })
    )

    revalidatePath(`/admin/sales/${ventaId}`)
    revalidateTag('cuotas', 'everything')
    return {}
}
