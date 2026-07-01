'use client'

import { deleteSale } from './actions'
import { Trash2, AlertTriangle } from 'lucide-react'
import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
    ventaId: string
    unitId: string
    buyerName: string
}

export default function DeleteSaleButton({ ventaId, unitId, buyerName }: Props) {
    const [isPending, startTransition] = useTransition()
    const [confirming, setConfirming] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleConfirm = () => {
        setError('')
        startTransition(async () => {
            const result = await deleteSale(ventaId, unitId)
            if (result?.error) {
                setError(result.error)
                setConfirming(false)
            } else {
                router.refresh()
            }
        })
    }

    if (confirming) {
        return (
            <div className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                <span className="text-[11px] font-semibold text-red-700 whitespace-nowrap">
                    ¿Eliminar a {buyerName}?
                </span>
                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={isPending}
                    className="ml-1 rounded-md bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                    {isPending ? 'Eliminando...' : 'Sí, eliminar'}
                </button>
                <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    disabled={isPending}
                    className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                    Cancelar
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-end gap-1">
            <button
                type="button"
                onClick={() => { setError(''); setConfirming(true) }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200/50 px-2.5 py-1.5 text-xs font-bold text-red-600 bg-white hover:bg-red-50/30 transition-all duration-200 cursor-pointer"
            >
                <Trash2 className="h-3.5 w-3.5 text-red-500" />
                Eliminar
            </button>
            {error && (
                <p className="text-[11px] text-red-500 font-medium">{error}</p>
            )}
        </div>
    )
}
