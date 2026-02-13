'use client';

import { createTypology } from './actions';
import { Plus, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TypologyForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        const result = await createTypology(formData);

        if (result?.error) {
            alert(result.error);
        } else {
            const form = document.querySelector('form') as HTMLFormElement;
            form?.reset();
            router.refresh();
        }
        setLoading(false);
    };

    return (
        <form action={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    placeholder="Ej: Monoambiente"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción (Opcional)</label>
                <textarea
                    name="description"
                    id="description"
                    rows={3}
                    placeholder="Detalles sobre esta tipología..."
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
            >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {loading ? 'Guardando...' : 'Crear Tipología'}
            </button>
        </form>
    );
}
