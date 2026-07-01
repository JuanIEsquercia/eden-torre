'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSale } from '../actions'
import type { Property } from '../../properties/actions'
import type { Typology } from '../../typologies/actions'

const INDEX_TYPES = ['CAC', 'IPC', 'UVA', 'Dólar oficial', 'Otro']

function fmt(n: number, currency: string) {
    return `${currency === 'USD' ? 'U$D' : '$'} ${n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

interface Props {
    availableUnits: Property[]
    typologies: Typology[]
}

export default function NewSaleForm({ availableUnits, typologies }: Props) {
    const router = useRouter()
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [isUpdatable, setIsUpdatable] = useState(false)
    const [currency, setCurrency] = useState<'USD' | 'ARS'>('USD')
    const [closingValue, setClosingValue] = useState(0)
    const [deliveryPct, setDeliveryPct] = useState(30)
    const [installmentCount, setInstallmentCount] = useState(24)

    const typologyMap = new Map(typologies.map(t => [t.id, t.name]))

    const deliveryAmount = closingValue * deliveryPct / 100
    const balance = closingValue - deliveryAmount
    const installmentAmount = installmentCount > 0 ? balance / installmentCount : 0

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsPending(true)
        setError('')
        try {
            const formData = new FormData(e.currentTarget)
            const result = await createSale(formData)
            if (result?.error) {
                setError(result.error)
                setIsPending(false)
            } else if (result?.success) {
                setSuccess(true)
                setTimeout(() => router.push('/admin/sales'), 2000)
            }
        } catch {
            router.push('/admin/sales')
        }
    }

    const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    const labelClass = "mb-1.5 block text-sm font-medium text-gray-700"

    return (
        <form onSubmit={handleSubmit} className="space-y-8">

            {/* Datos del comprador */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-base font-semibold">Datos del comprador</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <label className={labelClass}>Nombre</label>
                        <input name="buyerName" type="text" required placeholder="Juan" className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Apellido</label>
                        <input name="buyerLastName" type="text" required placeholder="Pérez" className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>DNI</label>
                        <input name="buyerDni" type="text" required placeholder="20.000.000" className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Teléfono</label>
                        <input name="buyerPhone" type="tel" required placeholder="+54 9 11 0000-0000" className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Email</label>
                        <input name="buyerEmail" type="email" required placeholder="juan@email.com" className={inputClass} />
                    </div>
                </div>
            </div>

            {/* Unidad */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-base font-semibold">Unidad</h2>
                {availableUnits.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No hay unidades disponibles.</p>
                ) : (
                    <div className="max-w-xs">
                        <label className={labelClass}>Seleccionar unidad disponible</label>
                        <select name="unitId" required className={inputClass}>
                            <option value="">Seleccioná una unidad...</option>
                            {availableUnits.map(u => (
                                <option key={u.id} value={u.id}>
                                    {u.floor}° {u.unitNumber} — {typologyMap.get(u.typologyId) ?? 'Sin tipología'} — {u.price.toLocaleString('es-AR')} {currency}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Condiciones de la operación */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-base font-semibold">Condiciones de la operación</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <label className={labelClass}>Moneda</label>
                        <select
                            name="currency"
                            value={currency}
                            onChange={e => setCurrency(e.target.value as 'USD' | 'ARS')}
                            className={inputClass}
                        >
                            <option value="USD">USD — Dólares</option>
                            <option value="ARS">ARS — Pesos</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Valor de cierre</label>
                        <input
                            name="closingValue"
                            type="number"
                            required
                            min={1}
                            placeholder="0"
                            value={closingValue || ''}
                            onChange={e => setClosingValue(Number(e.target.value))}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>% de entrega (anticipo)</label>
                        <input
                            name="deliveryPercentage"
                            type="number"
                            required
                            min={0}
                            max={100}
                            step={0.01}
                            value={deliveryPct}
                            onChange={e => setDeliveryPct(Number(e.target.value))}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Cantidad de cuotas</label>
                        <input
                            name="installmentCount"
                            type="number"
                            required
                            min={1}
                            max={360}
                            value={installmentCount}
                            onChange={e => setInstallmentCount(Number(e.target.value))}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Fecha de boleto</label>
                        <input name="boletoDate" type="date" required className={inputClass} />
                    </div>
                    <div className="flex flex-col justify-end gap-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                            <input
                                name="updatableIndex"
                                type="checkbox"
                                checked={isUpdatable}
                                onChange={e => setIsUpdatable(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary"
                            />
                            Cuotas actualizables por índice
                        </label>
                        {isUpdatable && (
                            <select name="indexType" className={inputClass}>
                                {INDEX_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        )}
                    </div>
                </div>
            </div>

            {/* Resumen calculado */}
            {closingValue > 0 && (
                <div className="rounded-lg border border-accent/30 bg-accent/5 p-6">
                    <h2 className="mb-4 text-base font-semibold">Resumen de la operación</h2>
                    <div className="grid gap-3 sm:grid-cols-3 text-sm">
                        <div>
                            <p className="text-muted-foreground">Entrega / Anticipo</p>
                            <p className="text-xl font-semibold">{fmt(deliveryAmount, currency)}</p>
                            <p className="text-xs text-muted-foreground">{deliveryPct}% del total</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Saldo en cuotas</p>
                            <p className="text-xl font-semibold">{fmt(balance, currency)}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Monto por cuota</p>
                            <p className="text-xl font-semibold">{fmt(installmentAmount, currency)}</p>
                            <p className="text-xs text-muted-foreground">{installmentCount} cuotas {isUpdatable ? '(actualizables)' : 'fijas'}</p>
                        </div>
                    </div>
                </div>
            )}

            {success && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
                    Venta registrada exitosamente. Redirigiendo a la lista de ventas...
                </div>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isPending || success || availableUnits.length === 0}
                    className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
                >
                    {isPending ? 'Registrando...' : 'Registrar venta'}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex h-10 items-center rounded-md border px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Cancelar
                </button>
            </div>
        </form>
    )
}
