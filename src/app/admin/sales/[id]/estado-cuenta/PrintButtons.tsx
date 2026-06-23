'use client'

import { Printer, MessageCircle, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
    ventaId: string
    buyerPhone: string
    buyerName: string
}

export default function PrintButtons({ ventaId, buyerPhone, buyerName }: Props) {
    const router = useRouter()

    function handlePrint() {
        window.print()
    }

    function handleWhatsApp() {
        const cleanPhone = buyerPhone.replace(/\D/g, '')
        const url = typeof window !== 'undefined' ? window.location.href : ''
        const text = encodeURIComponent(
            `Hola ${buyerName.split(' ')[0]}, te compartimos tu estado de cuenta: ${url}`
        )
        window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank')
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
            >
                <ArrowLeft className="h-4 w-4" />
                Volver
            </button>
            <button
                onClick={handleWhatsApp}
                className="inline-flex items-center gap-1.5 rounded-md bg-green-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-600"
            >
                <MessageCircle className="h-4 w-4" />
                Compartir
            </button>
            <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
                <Printer className="h-4 w-4" />
                Imprimir / PDF
            </button>
        </div>
    )
}
