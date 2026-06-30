'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface GalleryImage {
    url: string
    caption?: string
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
    try {
        const rows = await prisma.galleryImage.findMany({ orderBy: { position: 'asc' } })
        return rows.map(r => ({
            url: r.url,
            caption: r.caption ?? undefined,
        }))
    } catch (error) {
        console.error('Error fetching gallery images:', error)
        return []
    }
}

// Reemplaza todas las imágenes con el nuevo array (mismo contrato que antes)
export async function updateGallery(images: GalleryImage[]) {
    try {
        await prisma.$transaction([
            prisma.galleryImage.deleteMany(),
            prisma.galleryImage.createMany({
                data: images.map((img, i) => ({
                    url: img.url,
                    caption: img.caption ?? null,
                    position: i,
                })),
            }),
        ])
        revalidatePath('/')
        revalidatePath('/admin/gallery')
        return { success: true }
    } catch (error) {
        console.error('Error updating gallery:', error)
        throw new Error('Failed to update gallery')
    }
}
