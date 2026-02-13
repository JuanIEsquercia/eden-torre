'use server'

import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore'
import { revalidatePath } from 'next/cache'

export interface FileFile {
    id: string
    name: string
    url: string
    type: string
    uploadedAt: any
}

const COLLECTION_NAME = 'files'

export async function saveFileMetadata(name: string, url: string, type: string) {
    try {
        await addDoc(collection(db, COLLECTION_NAME), {
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
        const q = query(collection(db, COLLECTION_NAME), orderBy('uploadedAt', 'desc'))
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Serialize date for client
            uploadedAt: doc.data().uploadedAt?.toDate().toISOString()
        })) as FileFile[]
    } catch (error) {
        return []
    }
}

export async function deleteFileMetadata(id: string) {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id))
        revalidatePath('/admin/files')
        return { success: true }
    } catch (error) {
        return { error: "Error al eliminar" }
    }
}
