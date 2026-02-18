'use server'

import { db } from '@/lib/firebase-admin'
import { revalidatePath } from 'next/cache'

export interface FileFile {
    id: string
    name: string
    url: string
    type: string
    uploadedAt: string // ISO string for client
}

const COLLECTION_NAME = 'files'

export async function saveFileMetadata(name: string, url: string, type: string) {
    try {
        await db.collection(COLLECTION_NAME).add({
            name,
            url,
            type,
            uploadedAt: new Date()
        })
        revalidatePath('/admin/files')
        return { success: true }
    } catch (error) {
        console.error("Error saving file metadata:", error)
        return { error: "Error al guardar metadatos" }
    }
}

export async function getFiles(): Promise<FileFile[]> {
    try {
        const snapshot = await db.collection(COLLECTION_NAME).orderBy('uploadedAt', 'desc').get()
        return snapshot.docs.map(doc => {
            const data = doc.data()
            return {
                id: doc.id,
                name: data.name,
                url: data.url,
                type: data.type,
                // Serialize date safely
                uploadedAt: data.uploadedAt?.toDate?.()?.toISOString() || new Date().toISOString()
            }
        }) as FileFile[]
    } catch (error) {
        console.error("Error fetching files:", error)
        return []
    }
}

export async function deleteFileMetadata(id: string) {
    try {
        await db.collection(COLLECTION_NAME).doc(id).delete()
        revalidatePath('/admin/files')
        return { success: true }
    } catch (error) {
        return { error: "Error al eliminar" }
    }
}
