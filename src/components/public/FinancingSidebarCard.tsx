'use client'

import { PercentCircle, Calculator, ChevronRight } from 'lucide-react'

interface FinancingSidebarCardProps {
    onOpenCalculator?: () => void
}

export function FinancingSidebarCard({ onOpenCalculator }: FinancingSidebarCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-black p-6 ring-1 ring-white/10 shadow-xl transition-all hover:ring-accent/50">
            {/* Ambient Background */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl pointer-events-none transition-all group-hover:bg-accent/30" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-lg bg-accent/10 p-2 text-accent ring-1 ring-accent/20">
                        <PercentCircle className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-white tracking-wide">Planes Flexibles</h3>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed mb-6">
                    Financiamos hasta el <strong className="text-white">100%</strong> de tu compra o armamos un plan a tu medida con anticipo y hasta <strong className="text-white">84 cuotas</strong>*.
                </p>

                {onOpenCalculator && (
                    <button
                        onClick={onOpenCalculator}
                        className="flex w-full items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm font-medium text-white ring-1 ring-white/10 transition-all hover:bg-white/10"
                    >
                        <div className="flex items-center gap-2">
                            <Calculator className="h-4 w-4 text-accent" />
                            Simular Inversión
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-accent transition-colors" />
                    </button>
                )}
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-accent/80">*Sujeto a la unidad elegida</p>
            </div>
        </div>
    )
}
