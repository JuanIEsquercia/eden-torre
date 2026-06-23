'use client'

import { useActionState } from 'react'
import { createUser } from './actions'
import { cn } from '@/lib/utils'

const initialState = { message: '', error: false }

export function CreateUserForm() {
    const [state, formAction, isPending] = useActionState(createUser, initialState)

    return (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold">Crear nuevo usuario</h2>
            <form action={formAction} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
                            Nombre completo
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            placeholder="Juan Pérez"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="juan@ejemplo.com"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                    </div>
                </div>

                {state.message && (
                    <p className={cn('text-sm', state.error ? 'text-red-500' : 'text-green-600')}>
                        {state.message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
                >
                    {isPending ? 'Creando...' : 'Crear usuario'}
                </button>
            </form>
        </div>
    )
}
