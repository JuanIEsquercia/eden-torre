'use server'

import { adminAuth, db } from '@/lib/firebase-admin'
import { revalidatePath } from 'next/cache'

export async function createUser(prevState: { message: string; error: boolean }, formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string

    if (!name || !email) {
        return { message: 'Nombre y email son requeridos.', error: true }
    }

    try {
        const userRecord = await adminAuth.createUser({
            email,
            displayName: name,
            password: crypto.randomUUID(),
        })

        await db.collection('users').doc(userRecord.uid).set({
            name,
            email,
            role: 'user',
            createdAt: new Date(),
        })

        // Envía email para que el usuario configure su contraseña
        await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestType: 'PASSWORD_RESET', email }),
            }
        )

        revalidatePath('/admin/users')
        return { message: `Usuario creado. Se envió un email a ${email} para configurar su contraseña.`, error: false }
    } catch (err: any) {
        if (err?.errorInfo?.code === 'auth/email-already-exists') {
            return { message: 'Ya existe un usuario con ese email.', error: true }
        }
        return { message: 'Error al crear el usuario. Intentá de nuevo.', error: true }
    }
}

export async function deleteUser(uid: string) {
    await adminAuth.deleteUser(uid)
    await db.collection('users').doc(uid).delete()
    revalidatePath('/admin/users')
}
