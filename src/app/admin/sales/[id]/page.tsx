import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getVenta, getCuotas } from '../actions'
import { getProperty } from '../../properties/actions'
import CuotasTable from './CuotasTable'
import UpdatePercentageForm from './UpdatePercentageForm'
import { ArrowLeft, FileText } from 'lucide-react'

function fmt(n: number, currency: string) {
    const sym = currency === 'USD' ? 'U$D' : '$'
    return `${sym} ${n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default async function SaleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const [venta, cuotas] = await Promise.all([getVenta(id), getCuotas(id)])
    if (!venta) notFound()

    const property = await getProperty(venta.unitId)
    const unitLabel = property ? `${property.floor}° ${property.unitNumber}` : venta.unitId

    const paidCuotas = cuotas.filter(c => c.status === 'pagada')
    const collectedFromInstallments = paidCuotas.reduce((sum, c) => sum + c.amount, 0)
    const totalCollected = venta.deliveryAmount + collectedFromInstallments
    const pendingBalance = venta.closingValue - totalCollected

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/admin/sales" className="rounded-md p-1.5 text-muted-foreground hover:bg-gray-100">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {venta.buyerName} {venta.buyerLastName}
                        </h1>
                        <p className="text-sm text-muted-foreground">Unidad {unitLabel}</p>
                    </div>
                </div>
                <Link
                    href={`/admin/sales/${id}/estado-cuenta`}
                    className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    <FileText className="h-4 w-4" />
                    Estado de cuenta
                </Link>
            </div>

            {/* Info titular + condiciones */}
            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-lg border bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Titular</h2>
                    <dl className="space-y-2 text-sm">
                        <div className="flex gap-2"><dt className="w-20 text-muted-foreground">Nombre</dt><dd className="font-medium">{venta.buyerName} {venta.buyerLastName}</dd></div>
                        <div className="flex gap-2"><dt className="w-20 text-muted-foreground">DNI</dt><dd>{venta.buyerDni}</dd></div>
                        <div className="flex gap-2"><dt className="w-20 text-muted-foreground">Teléfono</dt><dd>{venta.buyerPhone}</dd></div>
                        <div className="flex gap-2"><dt className="w-20 text-muted-foreground">Email</dt><dd>{venta.buyerEmail}</dd></div>
                    </dl>
                </div>
                <div className="rounded-lg border bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Condiciones</h2>
                    <dl className="space-y-2 text-sm">
                        <div className="flex gap-2"><dt className="w-32 text-muted-foreground">Valor de cierre</dt><dd className="font-medium">{fmt(venta.closingValue, venta.currency)}</dd></div>
                        <div className="flex gap-2"><dt className="w-32 text-muted-foreground">Entrega</dt><dd>{fmt(venta.deliveryAmount, venta.currency)} ({venta.deliveryPercentage}%)</dd></div>
                        <div className="flex gap-2"><dt className="w-32 text-muted-foreground">Saldo cuotas</dt><dd>{fmt(venta.installmentsBalance, venta.currency)}</dd></div>
                        <div className="flex gap-2"><dt className="w-32 text-muted-foreground">Cuotas</dt><dd>{venta.installmentCount} {venta.updatableIndex ? `(${venta.indexType ?? 'actualizables'})` : 'fijas'}</dd></div>
                        <div className="flex gap-2"><dt className="w-32 text-muted-foreground">Boleto</dt><dd>{new Date(venta.boletoDate + 'T12:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}</dd></div>
                    </dl>
                </div>
            </div>

            {/* Resumen financiero */}
            <div className="grid gap-4 sm:grid-cols-3">
                {[
                    { label: 'Cuotas pagadas', value: `${paidCuotas.length} / ${venta.installmentCount}`, sub: null },
                    { label: 'Total cobrado', value: fmt(totalCollected, venta.currency), sub: `Incluye anticipo ${fmt(venta.deliveryAmount, venta.currency)}` },
                    { label: 'Saldo pendiente', value: fmt(Math.max(0, pendingBalance), venta.currency), sub: null },
                ].map(item => (
                    <div key={item.label} className="rounded-lg border bg-white p-5 shadow-sm">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">{item.label}</p>
                        <p className="mt-1 text-2xl font-semibold">{item.value}</p>
                        {item.sub && <p className="mt-0.5 text-xs text-muted-foreground">{item.sub}</p>}
                    </div>
                ))}
            </div>

            {/* Actualización de cuotas */}
            {venta.updatableIndex && <UpdatePercentageForm ventaId={id} />}

            {/* Tabla de cuotas */}
            <div>
                <h2 className="mb-3 text-base font-semibold">Plan de pagos</h2>
                <CuotasTable ventaId={id} cuotas={cuotas} currency={venta.currency} />
            </div>
        </div>
    )
}
