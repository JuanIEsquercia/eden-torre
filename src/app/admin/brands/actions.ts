'use server'

import { db } from '@/lib/firebase-admin'

export interface Brand {
    id: string
    name: string
    logoUrl: string
    logoPublicId?: string
    website?: string
}

const COLLECTION_NAME = 'brands'

export async function getBrands(): Promise<Brand[]> {
    try {
        const snapshot = await db.collection(COLLECTION_NAME).get()
        return snapshot.docs.map(doc => {
            const data = doc.data()
            return {
                id: doc.id,
                name: data.name,
                logoUrl: data.logoUrl,
                logoPublicId: data.logoPublicId,
                website: data.website
            }
        }) as Brand[]
    } catch (error) {
        console.error("Error fetching brands:", error)
        return []
    }
}

export async function createBrand(formData: FormData) {
    try {
        const name = formData.get('name') as string
        const logoUrl = formData.get('logoUrl') as string
        const logoPublicId = formData.get('logoPublicId') as string
        const website = formData.get('website') as string

        if (!name || !logoUrl) {
            throw new Error('Name and Logo are required')
        }

        const newBrand = {
            name,
            logoUrl,
            logoPublicId,
            website,
            createdAt: new Date()
        }

        await db.collection(COLLECTION_NAME).add(newBrand)
        return { success: true }
    } catch (error) {
        console.error("Error creating brand:", error)
        return { success: false, error: 'Failed to create brand' }
    }
}

export async function deleteBrand(id: string) {
    try {
        await db.collection(COLLECTION_NAME).doc(id).delete()
        return { success: true }
    } catch (error) {
        console.error("Error deleting brand:", error)
        return { success: false, error: 'Failed to delete brand' }
    }
}
