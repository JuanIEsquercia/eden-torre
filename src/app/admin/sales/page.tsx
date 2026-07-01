import Link from 'next/link'
import { getVentas } from './actions'
import { getProperties } from '../properties/actions'
import { Plus, FileText } from 'lucide-react'
import DeleteSaleButton from './DeleteSaleButton'

function formatCurrency(amount: number, currency: string) {
    return `${currency === 'USD' ? 'U$D' : '$'} ${amount.toLocaleString('es-AR')}`
}

export default async function SalesPage() {
    const [ventas, properties] = await Promise.all([getVentas(), getProperties()])
    const propertiesMap = new Map(properties.map(p => [p.id, p]))

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-primary">Ventas</h1>
                    <p className="text-xs text-slate-400 font-semibold mt-1 uppercase tracking-wider">
                        {ventas.length} operación{ventas.length !== 1 ? 'es' : ''} registrada{ventas.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <Link
                    href="/admin/sales/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/95 transition-all shadow-sm border border-white/5 active:scale-95 hover:shadow-gold-hover duration-250 cursor-pointer"
                >
                    <Plus className="h-3.5 w-3.5" />
                    Nueva venta
                </Link>
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-white shadow-premium overflow-hidden">
                {ventas.length === 0 ? (
                    <div className="px-6 py-16 text-center text-sm text-slate-400 font-medium">
                        No hay ventas registradas todavía.
                    </div>
                ) : (
                    <>
                        {/* Mobile: cards */}
                        <div className="sm:hidden divide-y divide-slate-100">
                            {ventas.map(venta => {
                                const property = propertiesMap.get(venta.unitId)
                                const unitLabel = property
                                    ? `${property.floor}° ${property.unitNumber}`
                                    : venta.unitId
                                return (
                                    <div key={venta.id} className="px-4 py-4 space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-900 text-sm truncate">
                                                    {venta.buyerName} {venta.buyerLastName}
                                                </p>
                                                <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">{venta.buyerEmail}</p>
                                            </div>
                                            <span className="shrink-0 rounded-lg bg-slate-100 border border-slate-200/60 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                                                {unitLabel}
                                            </span>
                                        </div>
                                        <div className="flex items-end justify-between gap-3">
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm">
                                                    {formatCurrency(venta.closingValue, venta.currency)}
                                                </p>
                                                <p className="text-xs text-slate-400 font-medium mt-0.5">
                                                    {venta.installmentCount} cuotas · {new Date(venta.boletoDate + 'T12:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Link
                                                    href={`/admin/sales/${venta.id}`}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-250/70 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 shadow-sm transition-all duration-200"
                                                >
                                                    <FileText className="h-3.5 w-3.5 text-slate-500" />
                                                    Ver
                                                </Link>
                                                <DeleteSaleButton
                                                    ventaId={venta.id}
                                                    unitId={venta.unitId}
                                                    buyerName={`${venta.buyerName} ${venta.buyerLastName}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Desktop: table */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-sm text-slate-500">
                                <thead>
                                    <tr className="bg-slate-50/75 border-b border-slate-100 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                        <th className="px-6 py-4">Comprador</th>
                                        <th className="px-6 py-4">Unidad</th>
                                        <th className="px-6 py-4">Valor</th>
                                        <th className="px-6 py-4">Cuotas</th>
                                        <th className="px-6 py-4">Boleto</th>
                                        <th className="px-6 py-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-150">
                                    {ventas.map(venta => {
                                        const property = propertiesMap.get(venta.unitId)
                                        const unitLabel = property
                                            ? `${property.floor}° ${property.unitNumber}`
                                            : venta.unitId
                                        return (
                                            <tr key={venta.id} className="hover:bg-slate-50/45 transition-colors duration-150">
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-slate-900 text-sm">
                                                        {venta.buyerName} {venta.buyerLastName}
                                                    </p>
                                                    <p className="text-xs text-slate-400 font-medium mt-0.5">{venta.buyerEmail}</p>
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-slate-800">{unitLabel}</td>
                                                <td className="px-6 py-4 font-bold text-slate-900">
                                                    {formatCurrency(venta.closingValue, venta.currency)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200/60 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                                                        {venta.installmentCount} cuotas
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500 font-medium">
                                                    {new Date(venta.boletoDate + 'T12:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/admin/sales/${venta.id}`}
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-250/70 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 shadow-sm transition-all duration-200"
                                                        >
                                                            <FileText className="h-3.5 w-3.5 text-slate-500" />
                                                            Ver
                                                        </Link>
                                                        <DeleteSaleButton
                                                            ventaId={venta.id}
                                                            unitId={venta.unitId}
                                                            buyerName={`${venta.buyerName} ${venta.buyerLastName}`}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
