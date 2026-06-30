'use server'

import { adminAuth } from '@/lib/firebase-admin'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createUser(prevState: { message: string; error: boolean }, formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string

    if (!name || !email) {
        return { message: 'Nombre y email son requeridos.', error: true }
    }

    try {
        // Crea el usuario en Firebase Auth (manejo de auth no cambia)
        const userRecord = await adminAuth.createUser({
            email,
            displayName: name,
            password: crypto.randomUUID(),
        })

        // Guarda en PostgreSQL en lugar de Firestore
        await prisma.user.create({
            data: {
                firebaseUid: userRecord.uid,
                name,
                email,
                role: 'user',
            },
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
    } catch (err: unknown) {
        const fbErr = err as { errorInfo?: { code?: string } }
        if (fbErr?.errorInfo?.code === 'auth/email-already-exists') {
            return { message: 'Ya existe un usuario con ese email.', error: true }
        }
        return { message: 'Error al crear el usuario. Intentá de nuevo.', error: true }
    }
}

// uid = Firebase UID (lo que tiene el formulario como identificador del usuario)
export async function deleteUser(uid: string) {
    await adminAuth.deleteUser(uid)
    await prisma.user.deleteMany({ where: { firebaseUid: uid } })
    revalidatePath('/admin/users')
}
