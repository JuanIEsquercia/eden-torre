'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface ProjectUpdate {
    id: string
    date: string       // YYYY-MM-DD
    title: string
    description: string
    videoUrl: string
    youtubeId?: string
    createdAt: number  // timestamp ms — mantenido por compatibilidad con componentes
}

export async function getUpdates(): Promise<ProjectUpdate[]> {
    try {
        const rows = await prisma.projectUpdate.findMany({
            orderBy: { date: 'desc' },
            take: 10,
        })
        return rows.map(r => ({
            id: r.id,
            date: r.date.toISOString().split('T')[0],
            title: r.title,
            description: r.description ?? '',
            videoUrl: r.videoUrl ?? '',
            youtubeId: r.youtubeId ?? undefined,
            createdAt: r.createdAt.getTime(),
        }))
    } catch (error) {
        console.error('Error fetching updates:', error)
        return []
    }
}

export async function createUpdate(data: Omit<ProjectUpdate, 'id' | 'createdAt' | 'youtubeId'>) {
    try {
        const youtubeId = extractYoutubeId(data.videoUrl)
        await prisma.projectUpdate.create({
            data: {
                date: new Date(data.date),
                title: data.title,
                description: data.description,
                videoUrl: data.videoUrl,
                youtubeId,
            },
        })
        revalidatePath('/')
        revalidatePath('/admin/updates')
        return { success: true }
    } catch (error) {
        console.error('Error creating update:', error)
        return { success: false, error: 'Failed to create update' }
    }
}

export async function deleteUpdate(id: string) {
    try {
        await prisma.projectUpdate.delete({ where: { id } })
        revalidatePath('/')
        revalidatePath('/admin/updates')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to delete' }
    }
}

function extractYoutubeId(url: string): string | null {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
}
