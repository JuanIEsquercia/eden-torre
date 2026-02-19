'use server'

import { db } from '@/lib/firebase-admin'
import { revalidatePath } from 'next/cache'

export interface ProjectUpdate {
    id: string
    date: string // ISO string YYYY-MM-DD
    title: string
    description: string // Multi-line text or bullet points
    videoUrl: string // YouTube Link
    youtubeId?: string // Extracted ID
    createdAt: number
}

// Convert Firestore doc to ProjectUpdate
const mapDoc = (doc: any): ProjectUpdate => ({
    id: doc.id,
    ...doc.data()
})

export async function getUpdates() {
    try {
        const snapshot = await db.collection('project_updates')
            .orderBy('date', 'desc')
            .limit(10) // Limit to latest 10 for performance
            .get()

        return snapshot.docs.map(mapDoc)
    } catch (error) {
        console.error('Error fetching updates:', error)
        return []
    }
}

export async function createUpdate(data: Omit<ProjectUpdate, 'id' | 'createdAt' | 'youtubeId'>) {
    try {
        const youtubeId = extractYoutubeId(data.videoUrl)

        await db.collection('project_updates').add({
            ...data,
            youtubeId,
            createdAt: Date.now()
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
        await db.collection('project_updates').doc(id).delete()
        revalidatePath('/')
        revalidatePath('/admin/updates')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to delete' }
    }
}

function extractYoutubeId(url: string) {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
}
