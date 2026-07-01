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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/admin/sales" className="rounded-xl p-2 text-slate-450 hover:bg-slate-150/60 hover:text-slate-800 transition-colors border border-transparent hover:border-slate-200/50">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-primary">
                            {venta.buyerName} {venta.buyerLastName}
                        </h1>
                        <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5 tracking-wider">Unidad {unitLabel}</p>
                    </div>
                </div>
                <Link
                    href={`/admin/sales/${id}/estado-cuenta`}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-250/70 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 bg-white hover:bg-slate-50 transition-all duration-200 shadow-sm cursor-pointer"
                >
                    <FileText className="h-4 w-4 text-slate-500" />
                    Estado de cuenta
                </Link>
            </div>

            {/* Info titular + condiciones */}
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-premium">
                    <h2 className="mb-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Titular</h2>
                    <dl className="space-y-3 text-sm">
                        <div className="flex border-b border-slate-50 pb-2"><dt className="w-24 text-slate-450 font-medium">Nombre</dt><dd className="font-bold text-slate-900">{venta.buyerName} {venta.buyerLastName}</dd></div>
                        <div className="flex border-b border-slate-50 pb-2"><dt className="w-24 text-slate-450 font-medium">DNI</dt><dd className="text-slate-800 font-semibold">{venta.buyerDni}</dd></div>
                        <div className="flex border-b border-slate-50 pb-2"><dt className="w-24 text-slate-450 font-medium">Teléfono</dt><dd className="text-slate-800 font-semibold">{venta.buyerPhone}</dd></div>
                        <div className="flex pb-1"><dt className="w-24 text-slate-450 font-medium">Email</dt><dd className="text-slate-800 font-semibold">{venta.buyerEmail}</dd></div>
                    </dl>
                </div>
                <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-premium">
                    <h2 className="mb-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Condiciones</h2>
                    <dl className="space-y-3 text-sm">
                        <div className="flex border-b border-slate-50 pb-2"><dt className="w-36 text-slate-450 font-medium">Valor de cierre</dt><dd className="font-bold text-slate-900">{fmt(venta.closingValue, venta.currency)}</dd></div>
                        <div className="flex border-b border-slate-50 pb-2"><dt className="w-36 text-slate-450 font-medium">Entrega</dt><dd className="text-slate-800 font-semibold">{fmt(venta.deliveryAmount, venta.currency)} ({venta.deliveryPercentage}%)</dd></div>
                        <div className="flex border-b border-slate-50 pb-2"><dt className="w-36 text-slate-450 font-medium">Saldo cuotas</dt><dd className="text-slate-800 font-semibold">{fmt(venta.installmentsBalance, venta.currency)}</dd></div>
                        <div className="flex border-b border-slate-50 pb-2"><dt className="w-36 text-slate-450 font-medium">Cuotas</dt><dd className="text-slate-800 font-semibold">{venta.installmentCount} {venta.updatableIndex ? `(${venta.indexType ?? 'actualizables'})` : 'fijas'}</dd></div>
                        <div className="flex pb-1"><dt className="w-36 text-slate-450 font-medium">Boleto</dt><dd className="text-slate-800 font-semibold">{new Date(venta.boletoDate + 'T12:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}</dd></div>
                    </dl>
                </div>
            </div>

            {/* Resumen financiero */}
            <div className="grid gap-6 sm:grid-cols-3">
                {[
                    { label: 'Cuotas pagadas', value: `${paidCuotas.length} / ${venta.installmentCount}`, sub: null },
                    { label: 'Total cobrado', value: fmt(totalCollected, venta.currency), sub: `Anticipo ${fmt(venta.deliveryAmount, venta.currency)} incluido` },
                    { label: 'Saldo pendiente', value: fmt(Math.max(0, pendingBalance), venta.currency), sub: null },
                ].map(item => (
                    <div key={item.label} className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-premium hover:shadow-gold-hover duration-250 transition-all">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-450">{item.label}</p>
                        <p className="mt-2 text-2xl font-extrabold text-slate-900 tracking-tight">{item.value}</p>
                        {item.sub && <p className="mt-1 text-xs text-slate-400 font-medium">{item.sub}</p>}
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
