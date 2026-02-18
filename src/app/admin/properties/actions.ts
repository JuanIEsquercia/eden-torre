'use server'

import { db } from '@/lib/firebase-admin'
import { revalidatePath } from 'next/cache'

export interface Property {
    id: string
    unitNumber: string
    typologyId: string
    floor: number
    status: 'available' | 'reserved' | 'sold'
    price: number
    area: number
    disposition?: 'front' | 'back' | 'lateral'
    images?: {
        url: string
        publicId: string
    }[]
}

const COLLECTION_NAME = 'properties'

export async function getProperties(): Promise<Property[]> {
    try {
        const snapshot = await db.collection(COLLECTION_NAME).orderBy('unitNumber').get()
        return snapshot.docs.map(doc => {
            const data = doc.data()
            return {
                id: doc.id,
                unitNumber: data.unitNumber,
                typologyId: data.typologyId,
                floor: data.floor,
                status: data.status,
                price: data.price,
                area: data.area,
                disposition: data.disposition || 'front',
                images: data.images || []
            }
        }) as Property[]
    } catch (error) {
        console.error("Error fetching properties:", error)
        return []
    }
}

export async function getProperty(id: string): Promise<Property | null> {
    console.log(`[getProperty] Fetching property with ID: '${id}'`);
    try {
        if (!id) throw new Error("ID is required");
        const docSnap = await db.collection(COLLECTION_NAME).doc(id).get()

        if (docSnap.exists) {
            const data = docSnap.data() || {}
            return {
                id: docSnap.id,
                unitNumber: data.unitNumber,
                typologyId: data.typologyId,
                floor: data.floor,
                status: data.status,
                price: data.price,
                area: data.area,
                disposition: data.disposition || 'front',
                images: data.images || []
            } as Property
        } else {
            console.log("No such document!");
            return null
        }
    } catch (error) {
        console.error("Error fetching property:", error)
        return null
    }
}

export async function createProperty(formData: FormData) {
    const unitNumber = formData.get('unitNumber') as string
    const typologyId = formData.get('typologyId') as string
    const floor = Number(formData.get('floor'))
    const price = Number(formData.get('price'))
    const area = Number(formData.get('area'))
    const status = formData.get('status') as string
    const disposition = formData.get('disposition') as string

    // Parse images from JSON string
    const imagesJson = formData.get('images') as string
    let images = []
    try {
        images = imagesJson ? JSON.parse(imagesJson) : []
    } catch (e) {
        console.error("Error parsing images JSON", e)
    }

    if (!unitNumber || !typologyId) return { error: "Faltan datos obligatorios" }

    try {
        await db.collection(COLLECTION_NAME).add({
            unitNumber,
            typologyId,
            floor,
            status,
            price,
            area,
            disposition,
            images,
            createdAt: new Date()
        })
        revalidatePath('/admin/properties')
        return { success: true }
    } catch (error) {
        console.error("Error creating property:", error)
        return { error: "Error al crear la propiedad" }
    }
}

export async function deleteProperty(id: string) {
    try {
        await db.collection(COLLECTION_NAME).doc(id).delete()
        revalidatePath('/admin/properties')
        return { success: true }
    } catch (error) {
        return { error: "Error al eliminar" }
    }
}

export async function updatePropertyStatus(id: string, newStatus: string) {
    try {
        await db.collection(COLLECTION_NAME).doc(id).update({
            status: newStatus
        })
        revalidatePath('/admin/properties')
        return { success: true }
    } catch (error) {
        return { error: "Error al actualizar estado" }
    }
}
export async function updateProperty(formData: FormData) {
    const id = formData.get('id') as string
    const unitNumber = formData.get('unitNumber') as string
    const typologyId = formData.get('typologyId') as string
    const floor = Number(formData.get('floor'))
    const price = Number(formData.get('price'))
    const area = Number(formData.get('area'))
    const status = formData.get('status') as string
    const disposition = formData.get('disposition') as string

    // Parse images from JSON string
    const imagesJson = formData.get('images') as string
    let images = []
    try {
        images = imagesJson ? JSON.parse(imagesJson) : []
    } catch (e) {
        console.error("Error parsing images JSON", e)
    }

    if (!id || !unitNumber || !typologyId) return { error: "Faltan datos obligatorios" }

    try {
        await db.collection(COLLECTION_NAME).doc(id).update({
            unitNumber,
            typologyId,
            floor,
            status,
            price,
            area,
            disposition,
            images,
            updatedAt: new Date()
        })
        revalidatePath('/admin/properties')
        return { success: true }
    } catch (error) {
        console.error("Error updating property:", error)
        return { error: "Error al actualizar la propiedad" }
    }
}
