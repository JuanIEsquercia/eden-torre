'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { updateCuotaStatus, updateCuotaAmount } from '../actions'
import type { Cuota, CuotaStatus } from '../actions'

const STATUS_LABELS: Record<CuotaStatus, string> = {
    pendiente: 'Pendiente',
    pagada: 'Pagada',
    vencida: 'Vencida',
}

const STATUS_STYLES: Record<CuotaStatus, string> = {
    pendiente: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    pagada: 'bg-green-100 text-green-800 hover:bg-green-200',
    vencida: 'bg-red-100 text-red-800 hover:bg-red-200',
}

function formatDate(dateStr: string) {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-AR', {
        day: '2-digit', month: 'short', year: 'numeric',
    })
}

interface Props {
    ventaId: string
    cuotas: Cuota[]
    currency: string
}

export default function CuotasTable({ ventaId, cuotas, currency }: Props) {
    const router = useRouter()
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editAmount, setEditAmount] = useState('')
    const [togglingId, setTogglingId] = useState<string | null>(null)
    const [savingId, setSavingId] = useState<string | null>(null)
    const [, startTransition] = useTransition()

    function startEdit(cuota: Cuota) {
        setEditingId(cuota.id)
        setEditAmount(cuota.amount.toString())
    }

    function cancelEdit() {
        setEditingId(null)
        setEditAmount('')
    }

    function saveEdit(cuotaId: string) {
        const amount = Number(editAmount)
        if (!amount || amount <= 0) return
        setSavingId(cuotaId)
        startTransition(async () => {
            await updateCuotaAmount(ventaId, cuotaId, amount)
            setEditingId(null)
            setSavingId(null)
            router.refresh()
        })
    }

    function toggleStatus(cuota: Cuota) {
        setTogglingId(cuota.id)
        startTransition(async () => {
            await updateCuotaStatus(ventaId, cuota.id, cuota.status)
            setTogglingId(null)
            router.refresh()
        })
    }

    const currencySymbol = currency === 'USD' ? 'U$D' : '$'

    return (
        <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        <th className="px-4 py-3 text-center">N°</th>
                        <th className="px-4 py-3">Vencimiento</th>
                        <th className="px-4 py-3">Monto</th>
                        <th className="px-4 py-3 text-center">% Aplicado</th>
                        <th className="px-4 py-3 text-center">Estado</th>
                        <th className="px-4 py-3">Fecha de pago</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {cuotas.map(cuota => (
                        <tr key={cuota.id} className={cn(
                            'hover:bg-gray-50/50',
                            cuota.status === 'pagada' && 'bg-green-50/30',
                        )}>
                            <td className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">
                                {cuota.number}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                                {formatDate(cuota.dueDate)}
                            </td>
                            <td className="px-4 py-3">
                                {editingId === cuota.id ? (
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs text-muted-foreground">{currencySymbol}</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={editAmount}
                                            onChange={e => setEditAmount(e.target.value)}
                                            className="h-8 w-28 rounded border border-input px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => saveEdit(cuota.id)}
                                            disabled={savingId === cuota.id}
                                            className="rounded p-1 text-green-600 hover:bg-green-50"
                                        >
                                            <Check className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="rounded p-1 text-gray-400 hover:bg-gray-100"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="group flex items-center gap-1.5">
                                        <span className="font-medium">
                                            {currencySymbol} {cuota.amount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                        {cuota.status !== 'pagada' && (
                                            <button
                                                onClick={() => startEdit(cuota)}
                                                className="invisible rounded p-0.5 text-muted-foreground hover:text-primary group-hover:visible"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </td>
                            <td className="px-4 py-3 text-center">
                                {cuota.appliedPercentage != null ? (
                                    <span className="text-xs font-medium text-accent">+{cuota.appliedPercentage}%</span>
                                ) : (
                                    <span className="text-xs text-muted-foreground">—</span>
                                )}
                            </td>
                            <td className="px-4 py-3 text-center">
                                <button
                                    onClick={() => toggleStatus(cuota)}
                                    disabled={togglingId === cuota.id}
                                    className={cn(
                                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors cursor-pointer',
                                        STATUS_STYLES[cuota.status],
                                        togglingId === cuota.id && 'opacity-50 cursor-not-allowed'
                                    )}
                                >
                                    {STATUS_LABELS[cuota.status]}
                                </button>
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">
                                {cuota.paymentDate ? formatDate(cuota.paymentDate) : '—'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
