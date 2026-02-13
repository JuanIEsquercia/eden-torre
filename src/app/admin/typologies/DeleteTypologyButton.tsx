'use client';

import { deleteTypology } from './actions';
import { Trash2 } from 'lucide-react';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteTypologyButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm('¿Eliminar tipología?')) return;

        startTransition(async () => {
            const result = await deleteTypology(id);
            if (result?.error) {
                alert(result.error);
            } else {
                router.refresh();
            }
        });
    };

    return (
        <form onSubmit={handleDelete}>
            <button
                type="submit"
                disabled={isPending}
                className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                title="Eliminar"
            >
                <Trash2 className="h-5 w-5" />
            </button>
        </form>
    );
}
