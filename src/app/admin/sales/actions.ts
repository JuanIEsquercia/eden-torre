'use server'

import { db } from '@/lib/firebase-admin'
import { revalidatePath, revalidateTag } from 'next/cache'

export type Currency = 'USD' | 'ARS'
export type CuotaStatus = 'pendiente' | 'pagada' | 'vencida'
export type IndexType = 'CAC' | 'IPC' | 'UVA' | 'Dólar oficial' | 'Otro'

export interface Cuota {
    id: string
    number: number
    dueDate: string        // YYYY-MM-DD
    amount: number
    status: CuotaStatus
    paymentDate?: string   // YYYY-MM-DD, set when paid
    appliedPercentage?: number
}

export interface Venta {
    id: string
    buyerName: string
    buyerLastName: string
    buyerDni: string
    buyerPhone: string
    buyerEmail: string
    unitId: string
    closingValue: number
    currency: Currency
    deliveryPercentage: number
    deliveryAmount: number
    installmentCount: number
    installmentsBalance: number
    installmentBaseAmount: number
    updatableIndex: boolean
    indexType?: IndexType
    boletoDate: string     // YYYY-MM-DD
    createdAt: Date
}

function generateCuotas(boletoDate: string, count: number, baseAmount: number): Omit<Cuota, 'id'>[] {
    const boleto = new Date(boletoDate + 'T12:00:00')
    return Array.from({ length: count }, (_, i) => {
        const due = new Date(boleto.getFullYear(), boleto.getMonth() + i + 1, 1)
        return {
            number: i + 1,
            dueDate: due.toISOString().split('T')[0],
            amount: Math.round(baseAmount * 100) / 100,
            status: 'pendiente' as CuotaStatus,
        }
    })
}

export async function getVentas(): Promise<Venta[]> {
    const snapshot = await db.collection('ventas').orderBy('createdAt', 'desc').get()
    return snapshot.docs.map(doc => {
        const d = doc.data()
        return {
            id: doc.id,
            ...d,
            createdAt: d.createdAt?.toDate?.() ?? new Date(),
        } as Venta
    })
}

export async function getVenta(id: string): Promise<Venta | null> {
    const doc = await db.collection('ventas').doc(id).get()
    if (!doc.exists) return null
    const d = doc.data()!
    return { id: doc.id, ...d, createdAt: d.createdAt?.toDate?.() ?? new Date() } as Venta
}

export async function getCuotas(ventaId: string): Promise<Cuota[]> {
    const snapshot = await db
        .collection('ventas').doc(ventaId)
        .collection('cuotas')
        .orderBy('number')
        .get()
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Cuota)
}

export async function createSale(formData: FormData): Promise<{ error?: string }> {
    const unitId = formData.get('unitId') as string
    const closingValue = Number(formData.get('closingValue'))
    const deliveryPercentage = Number(formData.get('deliveryPercentage'))
    const installmentCount = Number(formData.get('installmentCount'))
    const boletoDate = formData.get('boletoDate') as string

    if (!unitId || !closingValue || !boletoDate) {
        return { error: 'Faltan datos obligatorios.' }
    }

    const deliveryAmount = Math.round(closingValue * deliveryPercentage / 100 * 100) / 100
    const installmentsBalance = Math.round((closingValue - deliveryAmount) * 100) / 100
    const installmentBaseAmount = installmentCount > 0
        ? Math.round(installmentsBalance / installmentCount * 100) / 100
        : 0

    const updatableIndex = formData.get('updatableIndex') === 'on'
    const rawIndex = formData.get('indexType') as string

    const ventaData: Omit<Venta, 'id'> = {
        buyerName: formData.get('buyerName') as string,
        buyerLastName: formData.get('buyerLastName') as string,
        buyerDni: formData.get('buyerDni') as string,
        buyerPhone: formData.get('buyerPhone') as string,
        buyerEmail: formData.get('buyerEmail') as string,
        unitId,
        closingValue,
        currency: formData.get('currency') as Currency,
        deliveryPercentage,
        deliveryAmount,
        installmentCount,
        installmentsBalance,
        installmentBaseAmount,
        updatableIndex,
        ...(updatableIndex && rawIndex ? { indexType: rawIndex as IndexType } : {}),
        boletoDate,
        createdAt: new Date(),
    }

    try {
        const batch = db.batch()
        const ventaRef = db.collection('ventas').doc()

        batch.set(ventaRef, ventaData)

        const cuotas = generateCuotas(boletoDate, installmentCount, installmentBaseAmount)
        cuotas.forEach(cuota => {
            const ref = ventaRef.collection('cuotas').doc()
            batch.set(ref, cuota)
        })

        batch.update(db.collection('properties').doc(unitId), { status: 'sold' })

        await batch.commit()

        revalidatePath('/admin/sales')
        revalidatePath('/admin/properties')
        revalidateTag('cuotas')
        return {}
    } catch (err) {
        console.error(err)
        return { error: 'Error al registrar la venta. Intentá de nuevo.' }
    }
}

export async function deleteSale(ventaId: string, unitId: string): Promise<void> {
    const cuotasSnap = await db.collection('ventas').doc(ventaId).collection('cuotas').get()
    const batch = db.batch()

    cuotasSnap.docs.forEach(doc => batch.delete(doc.ref))
    batch.delete(db.collection('ventas').doc(ventaId))
    batch.update(db.collection('properties').doc(unitId), { status: 'available' })

    await batch.commit()

    revalidatePath('/admin/sales')
    revalidatePath('/admin/properties')
    revalidateTag('cuotas')
}

export async function updateCuotaStatus(
    ventaId: string,
    cuotaId: string,
    currentStatus: CuotaStatus
): Promise<void> {
    const nextStatus: CuotaStatus = currentStatus === 'pagada' ? 'pendiente' : 'pagada'
    const update: Record<string, unknown> = { status: nextStatus }

    if (nextStatus === 'pagada') {
        update.paymentDate = new Date().toISOString().split('T')[0]
    } else {
        update.paymentDate = null
    }

    await db.collection('ventas').doc(ventaId).collection('cuotas').doc(cuotaId).update(update)
    revalidatePath(`/admin/sales/${ventaId}`)
    revalidateTag('cuotas')
}

export async function updateCuotaAmount(
    ventaId: string,
    cuotaId: string,
    amount: number
): Promise<void> {
    await db.collection('ventas').doc(ventaId).collection('cuotas').doc(cuotaId).update({ amount })
    revalidatePath(`/admin/sales/${ventaId}`)
    revalidateTag('cuotas')
}

export async function applyPercentageUpdate(
    ventaId: string,
    percentage: number
): Promise<{ error?: string }> {
    if (percentage === 0) return { error: 'El porcentaje no puede ser 0.' }

    const snap = await db
        .collection('ventas').doc(ventaId)
        .collection('cuotas')
        .where('status', '==', 'pendiente')
        .get()

    if (snap.empty) return { error: 'No hay cuotas pendientes para actualizar.' }

    const batch = db.batch()
    snap.docs.forEach(doc => {
        const currentAmount = doc.data().amount as number
        const newAmount = Math.round(currentAmount * (1 + percentage / 100) * 100) / 100
        batch.update(doc.ref, { amount: newAmount, appliedPercentage: percentage })
    })

    await batch.commit()
    revalidatePath(`/admin/sales/${ventaId}`)
    revalidateTag('cuotas')
    return {}
}
