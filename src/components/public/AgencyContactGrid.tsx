'use client'

import { MessageCircle } from 'lucide-react'
import { CldImage } from 'next-cloudinary'

interface Agency {
    id: string
    name: string
    logoUrl: string
    phone: string
}

const DEFAULT_MESSAGE = "Hola, vi el desarrollo de Torre EDEN en su web y me interesa recibir más información."

export function AgencyContactGrid({ agencies }: { agencies: Agency[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agencies.map((agency) => {
                const waLink = `https://wa.me/${agency.phone}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`
                return (
                    <div
                        key={agency.id}
                        className="group flex flex-col items-center gap-5 rounded-2xl border border-gray-100 bg-gray-50 p-8 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all duration-300"
                    >
                        <div className="flex h-20 w-full items-center justify-center">
                            <CldImage
                                src={agency.logoUrl}
                                alt={agency.name}
                                width={160}
                                height={80}
                                format="auto"
                                quality="auto"
                                className="max-h-16 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                            />
                        </div>
                        <p className="text-sm font-semibold text-gray-700 text-center">{agency.name}</p>
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-900/15 hover:bg-emerald-500 hover:scale-[1.02] transition-all duration-200"
                        >
                            <MessageCircle className="h-4 w-4" />
                            Consultar por WhatsApp
                        </a>
                    </div>
                )
            })}
        </div>
    )
}
