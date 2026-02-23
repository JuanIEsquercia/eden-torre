'use server'

import { db } from '@/lib/firebase-admin'
import { revalidatePath } from 'next/cache'

const COLLECTION = 'project_settings'
const DOC_ID = 'gallery'

export interface GalleryImage {
    url: string
    caption?: string
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
    try {
        const doc = await db.collection(COLLECTION).doc(DOC_ID).get()
        if (!doc.exists) return []
        return doc.data()?.images || []
    } catch (error) {
        console.error('Error fetching gallery images:', error)
        return []
    }
}

export async function updateGallery(images: GalleryImage[]) {
    try {
        await db.collection(COLLECTION).doc(DOC_ID).set({
            images,
            updatedAt: new Date().toISOString()
        })
        revalidatePath('/')
        revalidatePath('/admin/gallery')
        return { success: true }
    } catch (error) {
        console.error('Error updating gallery:', error)
        throw new Error('Failed to update gallery')
    }
}
