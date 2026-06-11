'use server'

import { db } from '@/lib/firebase-admin'
import { revalidatePath } from 'next/cache'

export type Agency = {
    id: string
    name: string
    logoUrl: string
    logoPublicId?: string
    phone: string // Changed from linkUrl to store just the number
    createdAt: Date
}

// MOCK_AGENCIES removed

export async function getAgencies(): Promise<Agency[]> {
    try {
        const snapshot = await db.collection('agencies').get()
        return snapshot.docs.map(doc => {
            const data = doc.data()
            return {
                id: doc.id,
                name: data.name,
                logoUrl: data.logoUrl,
                logoPublicId: data.logoPublicId,
                phone: data.phone
            }
        }) as Agency[]
    } catch (error) {
        console.error("Error fetching agencies:", error)
        return []
    }
}

export async function createAgency(data: Omit<Agency, 'id' | 'createdAt'>) {
    try {
        await db.collection('agencies').add({
            ...data,
            createdAt: new Date()
        })
        revalidatePath('/admin/agencies')
        return { success: true }
    } catch (error) {
        console.error("Error creating agency:", error)
        return { success: false, error }
    }
}

export async function deleteAgency(id: string) {
    try {
        await db.collection('agencies').doc(id).delete()
        revalidatePath('/admin/agencies')
        return { success: true }
    } catch (error) {
        console.error("Error deleting agency:", error)
        return { success: false, error }
    }
}
