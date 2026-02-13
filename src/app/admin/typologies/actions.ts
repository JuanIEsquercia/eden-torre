'use server'

import { db } from '@/lib/firebase-admin'
import { revalidatePath } from 'next/cache'

export interface Typology {
    id: string
    name: string
    description?: string
}

const COLLECTION_NAME = 'typologies'

export async function getTypologies(): Promise<Typology[]> {
    try {
        const snapshot = await db.collection(COLLECTION_NAME).orderBy('name').get()
        return snapshot.docs.map(doc => {
            const data = doc.data()
            return {
                id: doc.id,
                name: data.name,
                description: data.description
            }
        }) as Typology[]
    } catch (error) {
        console.error("Error fetching typologies:", error)
        return []
    }
}

export async function createTypology(formData: FormData) {
    const name = formData.get('name') as string
    const description = formData.get('description') as string

    if (!name) return { error: "El nombre es obligatorio" }

    try {
        await db.collection(COLLECTION_NAME).add({
            name,
            description,
            createdAt: new Date()
        })
        revalidatePath('/admin/typologies')
        return { success: true }
    } catch (error) {
        console.error("Error creating typology:", error)
        return { error: "Error al crear la tipología" }
    }
}

export async function deleteTypology(id: string) {
    try {
        await db.collection(COLLECTION_NAME).doc(id).delete()
        revalidatePath('/admin/typologies')
        return { success: true }
    } catch (error) {
        return { error: "Error al eliminar" }
    }
}
