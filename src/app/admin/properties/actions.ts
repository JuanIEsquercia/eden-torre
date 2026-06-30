'use server'

import { prisma } from '@/lib/prisma'
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

// Convierte fila de Prisma + imágenes al tipo Property del resto del app
function mapProperty(row: {
    id: string
    unitNumber: string
    typologyId: string | null
    floor: number
    status: string
    price: { toNumber(): number } | null
    area: { toNumber(): number } | null
    disposition: string | null
    images: { url: string; publicId: string | null; position: number }[]
}): Property {
    return {
        id: row.id,
        unitNumber: row.unitNumber,
        typologyId: row.typologyId ?? '',
        floor: row.floor,
        status: row.status as Property['status'],
        price: row.price ? Number(row.price) : 0,
        area: row.area ? Number(row.area) : 0,
        disposition: (row.disposition as Property['disposition']) ?? 'front',
        images: row.images
            .sort((a, b) => a.position - b.position)
            .map(img => ({ url: img.url, publicId: img.publicId ?? '' })),
    }
}

const WITH_IMAGES = { images: { orderBy: { position: 'asc' as const } } }

export async function getProperties(): Promise<Property[]> {
    try {
        const rows = await prisma.property.findMany({
            orderBy: { unitNumber: 'asc' },
            include: WITH_IMAGES,
        })
        return rows.map(mapProperty)
    } catch (error) {
        console.error('Error fetching properties:', error)
        return []
    }
}

export async function getProperty(id: string): Promise<Property | null> {
    try {
        if (!id) throw new Error('ID is required')
        const row = await prisma.property.findUnique({
            where: { id },
            include: WITH_IMAGES,
        })
        return row ? mapProperty(row) : null
    } catch (error) {
        console.error('Error fetching property:', error)
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

    const imagesJson = formData.get('images') as string
    let images: { url: string; publicId: string }[] = []
    try {
        images = imagesJson ? JSON.parse(imagesJson) : []
    } catch {
        // imagesJson mal formado — continúa sin imágenes
    }

    if (!unitNumber || !typologyId) return { error: 'Faltan datos obligatorios' }

    try {
        await prisma.property.create({
            data: {
                unitNumber,
                typologyId,
                floor,
                price,
                area,
                status: status as Property['status'],
                disposition: disposition as Property['disposition'],
                images: {
                    create: images.map((img, i) => ({
                        url: img.url,
                        publicId: img.publicId || null,
                        position: i,
                    })),
                },
            },
        })
        revalidatePath('/admin/properties')
        return { success: true }
    } catch (error) {
        console.error('Error creating property:', error)
        return { error: 'Error al crear la propiedad' }
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

    const imagesJson = formData.get('images') as string
    let images: { url: string; publicId: string }[] = []
    try {
        images = imagesJson ? JSON.parse(imagesJson) : []
    } catch {
        // imagesJson mal formado
    }

    if (!id || !unitNumber || !typologyId) return { error: 'Faltan datos obligatorios' }

    try {
        await prisma.$transaction([
            // Reemplaza imágenes: borra las anteriores y crea las nuevas
            prisma.propertyImage.deleteMany({ where: { propertyId: id } }),
            prisma.property.update({
                where: { id },
                data: {
                    unitNumber,
                    typologyId,
                    floor,
                    price,
                    area,
                    status: status as Property['status'],
                    disposition: disposition as Property['disposition'],
                    updatedAt: new Date(),
                    images: {
                        create: images.map((img, i) => ({
                            url: img.url,
                            publicId: img.publicId || null,
                            position: i,
                        })),
                    },
                },
            }),
        ])
        revalidatePath('/admin/properties')
        return { success: true }
    } catch (error) {
        console.error('Error updating property:', error)
        return { error: 'Error al actualizar la propiedad' }
    }
}

export async function updatePropertyStatus(id: string, newStatus: string) {
    try {
        await prisma.property.update({
            where: { id },
            data: { status: newStatus as Property['status'], updatedAt: new Date() },
        })
        revalidatePath('/admin/properties')
        return { success: true }
    } catch (error) {
        return { error: 'Error al actualizar estado' }
    }
}

export async function deleteProperty(id: string) {
    try {
        // Las imágenes se borran solas por el CASCADE del schema
        await prisma.property.delete({ where: { id } })
        revalidatePath('/admin/properties')
        return { success: true }
    } catch (error) {
        return { error: 'Error al eliminar' }
    }
}
