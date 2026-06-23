'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { adminAuth } from '@/lib/firebase-admin'

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 14, // 14 días
    path: '/',
}

export async function login(prevState: { message: string }, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    let idToken: string

    try {
        const res = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, returnSecureToken: true }),
            }
        )

        if (!res.ok) {
            return { message: 'Email o contraseña incorrectos' }
        }

        const data = await res.json()
        idToken = data.idToken
    } catch {
        return { message: 'Error de conexión. Intentá de nuevo.' }
    }

    try {
        // Crea una session cookie de larga duración (14 días) con Firebase Admin
        const expiresIn = 60 * 60 * 24 * 14 * 1000
        const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn })

        const role = email === process.env.SUPERADMIN_EMAIL ? 'superadmin' : 'user'

        const cookieStore = await cookies()
        cookieStore.set('eden-auth', sessionCookie, COOKIE_OPTIONS)
        cookieStore.set('eden-role', role, COOKIE_OPTIONS)
    } catch {
        return { message: 'Error al iniciar sesión. Intentá de nuevo.' }
    }

    redirect('/admin')
}
