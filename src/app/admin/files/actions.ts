'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface FileFile {
    id: string
    name: string
    url: string
    type: string
    uploadedAt: string // ISO string para el cliente
}

export async function saveFileMetadata(name: string, url: string, type: string) {
    try {
        await prisma.file.create({ data: { name, url, type } })
        revalidatePath('/admin/files')
        return { success: true }
    } catch (error) {
        console.error('Error saving file metadata:', error)
        return { error: 'Error al guardar metadatos' }
    }
}

export async function getFiles(): Promise<FileFile[]> {
    try {
        const rows = await prisma.file.findMany({ orderBy: { uploadedAt: 'desc' } })
        return rows.map(r => ({
            id: r.id,
            name: r.name,
            url: r.url,
            type: r.type ?? '',
            uploadedAt: r.uploadedAt.toISOString(),
        }))
    } catch (error) {
        console.error('Error fetching files:', error)
        return []
    }
}

export async function deleteFileMetadata(id: string) {
    try {
        await prisma.file.delete({ where: { id } })
        revalidatePath('/admin/files')
        return { success: true }
    } catch (error) {
        return { error: 'Error al eliminar' }
    }
}
