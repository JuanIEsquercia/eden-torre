'use client'

import { PercentCircle, CalendarDays, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface FinancingBannerProps {
    contactUrl?: string
}

export function FinancingBanner({ contactUrl = '#contact' }: FinancingBannerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full relative overflow-hidden rounded-3xl bg-slate-900 border border-white/10 shadow-2xl isolate"
        >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-[80px] pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-8 md:p-12 relative z-10">
                {/* Text Content */}
                <div className="md:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent ring-1 ring-inset ring-accent/20">
                        <PercentCircle className="h-4 w-4" />
                        <span>Oportunidad Única</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
                        Financiación a tu medida
                    </h3>
                    <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
                        Invertí de contado y obtené grandes beneficios, o entregá un anticipo y financiá el saldo hasta en <strong className="text-white">84 cuotas</strong>. Posibilidad de financiar hasta el <strong className="text-white">100%</strong> de la compra*.
                    </p>
                    <p className="text-sm font-semibold tracking-wide text-accent/90 italic mt-2">*Sujeto a la unidad elegida.</p>
                </div>

                {/* Features & CTA */}
                <div className="md:col-span-5 flex flex-col items-start md:items-end gap-6 border-t border-white/10 md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-8">
                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                                <span className="text-lg font-bold text-accent">100%</span>
                            </div>
                            <span className="text-sm font-medium text-gray-200">Financiación total disponible</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                                <CalendarDays className="h-5 w-5 text-accent" />
                            </div>
                            <span className="text-sm font-medium text-gray-200">Hasta 84 cuotas</span>
                        </div>
                    </div>

                    <Link
                        href={contactUrl}
                        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 text-sm font-bold text-primary shadow-[0_0_20px_rgba(202,138,4,0.15)] hover:shadow-[0_0_30px_rgba(202,138,4,0.3)] transition-all hover:scale-[1.02]"
                    >
                        <span>Consultar Planes</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
