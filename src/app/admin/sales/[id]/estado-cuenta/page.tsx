import { notFound } from 'next/navigation'
import { getVenta, getCuotas } from '../../actions'
import { getProperty } from '../../../properties/actions'
import PrintButtons from './PrintButtons'

function fmt(n: number, currency: string) {
    const sym = currency === 'USD' ? 'U$D' : '$'
    return `${sym} ${n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatDate(dateStr: string) {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-AR', {
        day: '2-digit', month: 'long', year: 'numeric',
    })
}

export default async function EstadoCuentaPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const [venta, cuotas] = await Promise.all([getVenta(id), getCuotas(id)])
    if (!venta) notFound()

    const property = await getProperty(venta.unitId)
    const unitLabel = property ? `${property.floor}° ${property.unitNumber}` : venta.unitId

    const paidCuotas = cuotas.filter(c => c.status === 'pagada')
    const collectedFromInstallments = paidCuotas.reduce((sum, c) => sum + c.amount, 0)
    const totalCollected = venta.deliveryAmount + collectedFromInstallments
    const progressPct = Math.min(100, Math.round((totalCollected / venta.closingValue) * 100))

    return (
        <div className="min-h-screen bg-gray-100 print:bg-white">
            {/* Botones de acción — ocultos al imprimir */}
            <div className="print:hidden sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
                <p className="text-sm text-muted-foreground">Vista previa del estado de cuenta</p>
                <PrintButtons ventaId={id} buyerPhone={venta.buyerPhone} buyerName={`${venta.buyerName} ${venta.buyerLastName}`} />
            </div>

            {/* Documento imprimible */}
            <div className="mx-auto max-w-3xl bg-white p-10 print:p-0 print:max-w-none shadow-sm print:shadow-none my-6 print:my-0">

                {/* Encabezado de marca */}
                <div className="mb-8 flex items-end justify-between border-b-2 border-primary pb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">EDEN</h1>
                        <p className="text-sm text-muted-foreground">Desarrollo Inmobiliario</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-semibold">Estado de Cuenta</p>
                        <p className="text-sm text-muted-foreground">Unidad {unitLabel}</p>
                        <p className="text-xs text-muted-foreground">
                            Emitido: {new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Datos del titular */}
                <div className="mb-6 grid grid-cols-2 gap-6">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Titular</p>
                        <p className="text-base font-semibold">{venta.buyerName} {venta.buyerLastName}</p>
                        <p className="text-sm text-gray-600">DNI: {venta.buyerDni}</p>
                        <p className="text-sm text-gray-600">{venta.buyerPhone}</p>
                        <p className="text-sm text-gray-600">{venta.buyerEmail}</p>
                    </div>
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Operación</p>
                        <p className="text-sm"><span className="text-gray-500">Valor total:</span> <strong>{fmt(venta.closingValue, venta.currency)}</strong></p>
                        <p className="text-sm"><span className="text-gray-500">Entrega:</span> {fmt(venta.deliveryAmount, venta.currency)} ({venta.deliveryPercentage}%)</p>
                        <p className="text-sm"><span className="text-gray-500">Saldo:</span> {fmt(venta.installmentsBalance, venta.currency)} en {venta.installmentCount} cuotas</p>
                        {venta.updatableIndex && <p className="text-sm"><span className="text-gray-500">Índice:</span> {venta.indexType}</p>}
                        <p className="text-sm"><span className="text-gray-500">Boleto:</span> {formatDate(venta.boletoDate)}</p>
                    </div>
                </div>

                {/* Progreso de pago */}
                <div className="mb-8 rounded-lg bg-gray-50 p-4 print:bg-gray-100">
                    <div className="mb-2 flex justify-between text-sm">
                        <span className="text-muted-foreground">Progreso de pago</span>
                        <span className="font-semibold">{fmt(totalCollected, venta.currency)} de {fmt(venta.closingValue, venta.currency)} ({progressPct}%)</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                        <span>{paidCuotas.length} cuota{paidCuotas.length !== 1 ? 's' : ''} pagada{paidCuotas.length !== 1 ? 's' : ''}</span>
                        <span>{venta.installmentCount - paidCuotas.length} pendiente{venta.installmentCount - paidCuotas.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>

                {/* Tabla de cuotas */}
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b-2 border-primary text-left text-xs font-semibold uppercase tracking-wide text-primary">
                            <th className="pb-2">N°</th>
                            <th className="pb-2">Vencimiento</th>
                            <th className="pb-2 text-right">Monto</th>
                            <th className="pb-2 text-center">Estado</th>
                            <th className="pb-2 text-center">Tipo</th>
                            <th className="pb-2">Fecha pago</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cuotas.map(cuota => {
                            const isEstimado = venta.updatableIndex && !cuota.appliedPercentage && cuota.status === 'pendiente'
                            return (
                                <tr key={cuota.id} className="border-b border-gray-100">
                                    <td className="py-2 text-xs text-gray-500">{cuota.number}</td>
                                    <td className="py-2 text-gray-700">{formatDate(cuota.dueDate)}</td>
                                    <td className="py-2 text-right font-medium">
                                        {fmt(cuota.amount, venta.currency)}
                                        {cuota.appliedPercentage != null && (
                                            <span className="ml-1 text-xs text-accent">+{cuota.appliedPercentage}%</span>
                                        )}
                                    </td>
                                    <td className="py-2 text-center">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                            cuota.status === 'pagada' ? 'bg-green-100 text-green-800' :
                                            cuota.status === 'vencida' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {cuota.status === 'pagada' ? 'Pagada' : cuota.status === 'vencida' ? 'Vencida' : 'Pendiente'}
                                        </span>
                                    </td>
                                    <td className="py-2 text-center text-xs text-muted-foreground">
                                        {isEstimado ? 'Estimado' : 'Confirmado'}
                                    </td>
                                    <td className="py-2 text-xs text-gray-500">
                                        {cuota.paymentDate ? formatDate(cuota.paymentDate) : '—'}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-primary font-semibold">
                            <td colSpan={2} className="pt-3 text-xs uppercase tracking-wide">Total</td>
                            <td className="pt-3 text-right">{fmt(cuotas.reduce((s, c) => s + c.amount, 0), venta.currency)}</td>
                            <td colSpan={3} />
                        </tr>
                    </tfoot>
                </table>

                {/* Pie de página */}
                <div className="mt-10 border-t pt-4 text-center text-xs text-gray-400">
                    EDEN Desarrollo Inmobiliario — Documento generado el {new Date().toLocaleDateString('es-AR')}
                </div>
            </div>
        </div>
    )
}
