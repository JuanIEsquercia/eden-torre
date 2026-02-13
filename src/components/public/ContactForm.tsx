'use client'

import { useActionState } from 'react'
import { submitContact } from '@/app/(public)/contact/actions'
import { cn } from '@/lib/utils'

const initialState = {
    success: false,
    message: ''
}

export function ContactForm() {
    const [state, formAction, isPending] = useActionState(submitContact, initialState)

    if (state?.success) {
        return (
            <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                    <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">{state.message}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <form action={formAction} className="grid grid-cols-1 gap-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-semibold leading-6 text-gray-900">Nombre</label>
                <div className="mt-2.5">
                    <input
                        type="text"
                        name="name"
                        id="name"
                        autoComplete="given-name"
                        required
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">Email</label>
                <div className="mt-2.5">
                    <input
                        type="email"
                        name="email"
                        id="email"
                        autoComplete="email"
                        required
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">Mensaje</label>
                <div className="mt-2.5">
                    <textarea
                        name="message"
                        id="message"
                        rows={4}
                        required
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="block w-full rounded-md bg-primary px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
                >
                    {isPending ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
            </div>
        </form>
    )
}
