'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface Typology {
    id: string
    name: string
    description?: string
}

export async function getTypologies(): Promise<Typology[]> {
    try {
        const rows = await prisma.typology.findMany({ orderBy: { name: 'asc' } })
        return rows.map(r => ({
            id: r.id,
            name: r.name,
            description: r.description ?? undefined,
        }))
    } catch (error) {
        console.error('Error fetching typologies:', error)
        return []
    }
}

export async function createTypology(formData: FormData) {
    const name = formData.get('name') as string
    const description = formData.get('description') as string

    if (!name) return { error: 'El nombre es obligatorio' }

    try {
        await prisma.typology.create({
            data: { name, description: description || null },
        })
        revalidatePath('/admin/typologies')
        return { success: true }
    } catch (error) {
        console.error('Error creating typology:', error)
        return { error: 'Error al crear la tipología' }
    }
}

export async function deleteTypology(id: string) {
    try {
        await prisma.typology.delete({ where: { id } })
        revalidatePath('/admin/typologies')
        return { success: true }
    } catch (error) {
        return { error: 'Error al eliminar' }
    }
}
