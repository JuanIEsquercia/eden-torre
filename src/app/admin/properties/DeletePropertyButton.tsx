'use client'

import { Trash2 } from 'lucide-react'
import { deleteProperty } from './actions'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function DeletePropertyButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!confirm('¿Eliminar propiedad?')) return

        startTransition(async () => {
            const result = await deleteProperty(id)
            if (result?.error) {
                alert(result.error)
            } else {
                router.refresh()
            }
        })
    }

    return (
        <form onSubmit={handleDelete}>
            <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center justify-center rounded-lg border border-red-200/50 p-2 text-red-600 bg-white hover:bg-red-50/30 transition-all duration-200 cursor-pointer disabled:opacity-50"
                title="Eliminar"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </form>
    )
}
