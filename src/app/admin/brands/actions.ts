'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface Brand {
    id: string
    name: string
    logoUrl: string
    logoPublicId?: string
    website?: string
}

export async function getBrands(): Promise<Brand[]> {
    try {
        const rows = await prisma.brand.findMany({ orderBy: { name: 'asc' } })
        return rows.map(r => ({
            id: r.id,
            name: r.name,
            logoUrl: r.logoUrl ?? '',
            logoPublicId: r.logoPublicId ?? undefined,
            website: r.website ?? undefined,
        }))
    } catch (error) {
        console.error('Error fetching brands:', error)
        return []
    }
}

export async function createBrand(formData: FormData) {
    try {
        const name = formData.get('name') as string
        const logoUrl = formData.get('logoUrl') as string
        const logoPublicId = formData.get('logoPublicId') as string
        const website = formData.get('website') as string

        if (!name || !logoUrl) throw new Error('Name and Logo are required')

        await prisma.brand.create({
            data: {
                name,
                logoUrl,
                logoPublicId: logoPublicId || null,
                website: website || null,
            },
        })
        revalidatePath('/admin/brands')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error creating brand:', error)
        return { success: false, error: 'Failed to create brand' }
    }
}

export async function deleteBrand(id: string) {
    try {
        await prisma.brand.delete({ where: { id } })
        revalidatePath('/admin/brands')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error deleting brand:', error)
        return { success: false, error: 'Failed to delete brand' }
    }
}
