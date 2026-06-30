'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export type Agency = {
    id: string
    name: string
    logoUrl: string
    logoPublicId?: string
    phone: string
    createdAt: Date
}

export async function getAgencies(): Promise<Agency[]> {
    try {
        const rows = await prisma.agency.findMany({ orderBy: { name: 'asc' } })
        return rows.map(r => ({
            id: r.id,
            name: r.name,
            logoUrl: r.logoUrl ?? '',
            logoPublicId: r.logoPublicId ?? undefined,
            phone: r.phone ?? '',
            createdAt: r.createdAt,
        }))
    } catch (error) {
        console.error('Error fetching agencies:', error)
        return []
    }
}

export async function createAgency(data: Omit<Agency, 'id' | 'createdAt'>) {
    try {
        await prisma.agency.create({
            data: {
                name: data.name,
                logoUrl: data.logoUrl,
                logoPublicId: data.logoPublicId ?? null,
                phone: data.phone,
            },
        })
        revalidatePath('/admin/agencies')
        return { success: true }
    } catch (error) {
        console.error('Error creating agency:', error)
        return { success: false, error }
    }
}

export async function deleteAgency(id: string) {
    try {
        await prisma.agency.delete({ where: { id } })
        revalidatePath('/admin/agencies')
        return { success: true }
    } catch (error) {
        console.error('Error deleting agency:', error)
        return { success: false, error }
    }
}
