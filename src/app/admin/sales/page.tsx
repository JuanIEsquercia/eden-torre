import Link from 'next/link'
import { getVentas, deleteSale } from './actions'
import { getProperties } from '../properties/actions'
import { Plus, Trash2, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

function formatCurrency(amount: number, currency: string) {
    return `${currency === 'USD' ? 'U$D' : '$'} ${amount.toLocaleString('es-AR')}`
}

export default async function SalesPage() {
    const [ventas, properties] = await Promise.all([getVentas(), getProperties()])
    const propertiesMap = new Map(properties.map(p => [p.id, p]))

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Ventas</h1>
                    <p className="text-sm text-muted-foreground">{ventas.length} operación{ventas.length !== 1 ? 'es' : ''} registrada{ventas.length !== 1 ? 's' : ''}</p>
                </div>
                <Link
                    href="/admin/sales/new"
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                    <Plus className="h-4 w-4" />
                    Nueva venta
                </Link>
            </div>

            <div className="rounded-lg border bg-white shadow-sm">
                {ventas.length === 0 ? (
                    <div className="px-6 py-16 text-center text-sm text-muted-foreground">
                        No hay ventas registradas todavía.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    <th className="px-6 py-3">Comprador</th>
                                    <th className="px-6 py-3">Unidad</th>
                                    <th className="px-6 py-3">Valor</th>
                                    <th className="px-6 py-3">Cuotas</th>
                                    <th className="px-6 py-3">Boleto</th>
                                    <th className="px-6 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {ventas.map(venta => {
                                    const property = propertiesMap.get(venta.unitId)
                                    const unitLabel = property
                                        ? `${property.floor}° ${property.unitNumber}`
                                        : venta.unitId
                                    return (
                                        <tr key={venta.id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900">
                                                    {venta.buyerName} {venta.buyerLastName}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{venta.buyerEmail}</p>
                                            </td>
                                            <td className="px-6 py-4 font-medium">{unitLabel}</td>
                                            <td className="px-6 py-4">
                                                {formatCurrency(venta.closingValue, venta.currency)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                                    'bg-blue-100 text-blue-800'
                                                )}>
                                                    {venta.installmentCount} cuotas
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {new Date(venta.boletoDate + 'T12:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/sales/${venta.id}`}
                                                        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                                                    >
                                                        <FileText className="h-3.5 w-3.5" />
                                                        Ver
                                                    </Link>
                                                    <form action={deleteSale.bind(null, venta.id, venta.unitId)}>
                                                        <button
                                                            type="submit"
                                                            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                            Eliminar
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
