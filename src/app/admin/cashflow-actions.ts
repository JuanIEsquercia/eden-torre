'use server'

import { revalidateTag } from 'next/cache'

export async function revalidateCashFlow() {
    revalidateTag('cuotas')
}
