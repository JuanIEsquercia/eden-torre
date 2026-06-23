'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw } from 'lucide-react'
import { revalidateCashFlow } from './cashflow-actions'
import { cn } from '@/lib/utils'

export function RefreshButton({ generatedAt }: { generatedAt: string }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const d = new Date(generatedAt)
    const timeLabel = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

    async function handleRefresh() {
        await revalidateCashFlow()
        router.refresh()
    }

    return (
        <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
                Datos al {timeLabel}
            </span>
            <button
                onClick={() => startTransition(handleRefresh)}
                disabled={isPending}
                className={cn(
                    'inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors',
                    isPending && 'opacity-50 cursor-not-allowed'
                )}
            >
                <RefreshCw className={cn('h-3.5 w-3.5', isPending && 'animate-spin')} />
                {isPending ? 'Actualizando...' : 'Actualizar'}
            </button>
        </div>
    )
}
