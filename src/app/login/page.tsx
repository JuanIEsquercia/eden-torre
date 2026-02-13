'use client'

import { useActionState } from 'react'
import { login } from './actions'
import { cn } from '@/lib/utils'

const initialState = {
    message: '',
}

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, initialState)

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
            <div className="w-full max-w-sm space-y-6 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Acceso Administrativo</h1>
                    <p className="text-sm text-gray-500">Ingresa la clave maestra para continuar</p>
                </div>

                <form action={formAction} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="sr-only">Contraseña</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className={cn(
                                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                state?.message && "border-red-500 focus-visible:ring-red-500"
                            )}
                        />
                        {state?.message && (
                            <p className="mt-2 text-sm text-red-500">{state.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    >
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    )
}
