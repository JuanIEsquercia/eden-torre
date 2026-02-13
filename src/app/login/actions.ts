'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
    const password = formData.get('password')
    const adminPassword = process.env.ADMIN_PASSWORD

    if (password === adminPassword) {
        // Set a secure httpOnly cookie
        (await cookies()).set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })
        redirect('/admin')
    }

    return { message: 'Contraseña incorrecta' }
}
