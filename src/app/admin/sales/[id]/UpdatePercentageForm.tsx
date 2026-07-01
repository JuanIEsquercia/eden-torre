'use client'

import { useState, useTransition } from 'react'
import { applyPercentageUpdate } from '../actions'
import { TrendingUp } from 'lucide-react'

export default function UpdatePercentageForm({ ventaId }: { ventaId: string }) {
    const [percentage, setPercentage] = useState('')
    const [message, setMessage] = useState('')
    const [isError, setIsError] = useState(false)
    const [isPending, startTransition] = useTransition()

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const pct = Number(percentage)
        if (!pct) return

        startTransition(async () => {
            const result = await applyPercentageUpdate(ventaId, pct)
            if (result?.error) {
                setMessage(result.error)
                setIsError(true)
            } else {
                setMessage(`Cuotas actualizadas +${pct}%`)
                setIsError(false)
                setPercentage('')
            }
        })
    }

    return (
        <div className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                <h3 className="text-sm font-semibold">Actualizar cuotas pendientes</h3>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-end gap-3">
                <div>
                    <label className="mb-1.5 block text-xs text-muted-foreground">
                        Porcentaje de actualización
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            step="0.01"
                            placeholder="ej. 3.5"
                            value={percentage}
                            onChange={e => setPercentage(e.target.value)}
                            className="flex h-10 w-full sm:w-36 rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isPending || !percentage}
                    className="inline-flex h-10 w-full sm:w-auto items-center justify-center rounded-md bg-accent px-4 text-sm font-medium text-white hover:bg-accent/90 disabled:pointer-events-none disabled:opacity-50"
                >
                    {isPending ? 'Aplicando...' : 'Aplicar'}
                </button>
                {message && (
                    <p className={`text-sm ${isError ? 'text-red-500' : 'text-green-600'}`}>{message}</p>
                )}
            </form>
            <p className="mt-2 text-xs text-muted-foreground">
                Aplica el porcentaje de forma compuesta al monto actual de cada cuota pendiente.
            </p>
        </div>
    )
}
