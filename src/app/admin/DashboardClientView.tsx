'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { HandCoins, AlertCircle, Building2, CheckCircle2, Clock } from 'lucide-react'
import { CurrencyBlock } from './cashflow'

const CURRENCY_SYM: Record<string, string> = { USD: 'U$D', ARS: '$' }

function fmt(n: number, currency: string) {
    const sym = CURRENCY_SYM[currency] ?? currency
    return `${sym} ${n.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

interface DashboardClientViewProps {
    blocks: CurrencyBlock[]
    ventasCount: number
}

export default function DashboardClientView({ blocks, ventasCount }: DashboardClientViewProps) {
    const [activeTab, setActiveTab] = useState(blocks[0]?.currency || 'USD')
    const activeBlock = blocks.find(b => b.currency === activeTab) || blocks[0]

    if (!activeBlock) return null

    const totalCobrado = activeBlock.anticipo + activeBlock.totalCollected
    const totalGeneral = activeBlock.anticipo + activeBlock.totalProjected
    const progressPct = totalGeneral > 0 ? (totalCobrado / totalGeneral) * 100 : 0

    return (
        <div className="space-y-8">
            {/* Currency Select Tabs */}
            {blocks.length > 1 && (
                <div className="flex border-b border-slate-200/60 pb-3">
                    <div className="inline-flex rounded-xl bg-slate-100/80 p-1 border border-slate-200/50 backdrop-blur-sm shadow-inner relative">
                        {blocks.map(block => {
                            const isActive = activeTab === block.currency
                            return (
                                <button
                                    key={block.currency}
                                    onClick={() => setActiveTab(block.currency)}
                                    className={`relative py-2 px-5 text-xs font-bold uppercase tracking-wider transition-colors duration-250 rounded-lg focus:outline-none cursor-pointer ${
                                        isActive ? 'text-primary' : 'text-slate-500 hover:text-primary'
                                    }`}
                                >
                                    <span className="relative z-10">
                                        {block.currency === 'USD' ? 'Dólares (U$D)' : 'Pesos ($)'}
                                    </span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabPill"
                                            className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/60"
                                            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                                        />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* KPI Cards Grid */}
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                
                {/* Operaciones */}
                <motion.div 
                    whileHover={{ y: -3 }}
                    className="rounded-2xl border border-slate-200/75 bg-white p-6 shadow-premium shadow-gold-hover transition-all duration-350"
                >
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Operaciones</p>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-600">
                            <Building2 className="h-4.5 w-4.5" />
                        </div>
                    </div>
                    <p className="text-4xl font-extrabold tracking-tight text-primary">{ventasCount}</p>
                    <p className="mt-2 text-xs text-slate-400 font-medium">unidades vendidas en total</p>
                </motion.div>
 
                {/* Cobrado */}
                <motion.div 
                    whileHover={{ y: -3 }}
                    className="rounded-2xl border border-slate-200/75 bg-white p-6 shadow-premium shadow-gold-hover transition-all duration-350"
                >
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Cobrado</p>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100/50 text-emerald-600">
                            <HandCoins className="h-4.5 w-4.5" />
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold tracking-tight text-primary">{fmt(totalCobrado, activeBlock.currency)}</p>
                    
                    {/* Progress bar */}
                    <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div 
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
                            style={{ width: `${Math.min(100, progressPct)}%` }} 
                        />
                    </div>
                    <p className="mt-2 text-xs text-slate-400 font-medium">{Math.round(progressPct)}% del total proyectado</p>
                </motion.div>

                {/* Cobro del Mes */}
                <motion.div 
                    whileHover={{ y: -3 }}
                    className="rounded-2xl border border-slate-200/75 bg-white p-6 shadow-premium shadow-gold-hover transition-all duration-350"
                >
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Este Mes</p>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-600">
                            <Clock className="h-4.5 w-4.5" />
                        </div>
                    </div>
                    {(() => {
                        const nowKey = new Date().toISOString().substring(0, 7)
                        const currentMonth = activeBlock.months.find(m => m.key === nowKey)
                        return currentMonth ? (
                            <>
                                <p className="text-3xl font-extrabold tracking-tight text-primary">{fmt(currentMonth.projected, activeBlock.currency)}</p>
                                <p className="mt-3.5 text-xs text-slate-400 font-medium">
                                    cobrado: <span className="font-semibold text-emerald-600">{fmt(currentMonth.collected, activeBlock.currency)}</span>
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-3xl font-extrabold tracking-tight text-slate-300">—</p>
                                <p className="mt-3.5 text-xs text-slate-400 font-medium">sin cuotas este mes</p>
                            </>
                        )
                    })()}
                </motion.div>

                {/* Vencimientos / Al día */}
                <motion.div 
                    whileHover={{ y: -3 }}
                    className={`rounded-2xl border p-6 shadow-premium transition-all duration-350 ${
                        activeBlock.overdueCount > 0 
                            ? 'border-red-200/80 bg-gradient-to-br from-red-50/40 via-red-50/10 to-transparent' 
                            : 'border-emerald-250 bg-gradient-to-br from-emerald-50/30 via-emerald-50/5 to-transparent'
                    }`}
                >
                    {activeBlock.overdueCount > 0 ? (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-red-600">Vencimientos</p>
                                <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-red-150 border border-red-200 text-red-500 animate-pulse-ring-red">
                                    <AlertCircle className="h-4.5 w-4.5" />
                                </div>
                            </div>
                            <p className="text-3xl font-extrabold tracking-tight text-red-700">{fmt(activeBlock.overdueAmount, activeBlock.currency)}</p>
                            <div className="mt-3.5 flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                <p className="text-xs text-red-600 font-semibold">
                                    {activeBlock.overdueCount} cuota{activeBlock.overdueCount !== 1 ? 's' : ''} sin cobrar
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Vencimientos</p>
                                <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600">
                                    <CheckCircle2 className="h-4.5 w-4.5" />
                                </div>
                            </div>
                            <p className="text-3xl font-extrabold tracking-tight text-emerald-700">Al día</p>
                            <div className="mt-3.5 flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <p className="text-xs text-emerald-600 font-semibold">sin cuotas vencidas</p>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>

            {/* Monthly cash flow breakdown table */}
            <div className="rounded-2xl border border-slate-200/70 bg-white shadow-premium overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="font-bold text-primary text-base tracking-tight">Cronograma de Flujo de Caja</h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">Proyección de cobro y recaudación mes a mes</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-500">
                        <thead className="bg-slate-50/75 text-[10px] uppercase text-slate-500 font-bold tracking-wider border-b border-slate-100">
                            <tr>
                                <th scope="col" className="px-6 py-4">Mes</th>
                                <th scope="col" className="px-6 py-4">Proyectado</th>
                                <th scope="col" className="px-6 py-4">Cobrado</th>
                                <th scope="col" className="px-6 py-4">Pendiente / Mora</th>
                                <th scope="col" className="px-6 py-4">Progreso</th>
                                <th scope="col" className="px-6 py-4">Cuotas</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {activeBlock.months.map((month) => {
                                const collectedPct = month.projected > 0 ? (month.collected / month.projected) * 100 : 0
                                const isOverdue = month.isPast && month.pending > 0
                                
                                return (
                                    <tr 
                                        key={month.key} 
                                        className={`hover:bg-slate-50/55 transition-colors duration-150 ${
                                            month.isCurrentMonth ? 'bg-accent/5 font-medium border-l-2 border-l-accent' : ''
                                        }`}
                                    >
                                        {/* Month & Badge */}
                                        <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-2">
                                            {month.label}
                                            {month.isCurrentMonth && (
                                                <span className="inline-flex items-center rounded-full bg-accent/10 border border-accent/20 px-2 py-0.5 text-[9px] font-bold text-accent uppercase tracking-wider">
                                                    Actual
                                                </span>
                                            )}
                                        </td>
                                        
                                        {/* Projected */}
                                        <td className="px-6 py-4 text-slate-900 font-semibold">
                                            {fmt(month.projected, activeBlock.currency)}
                                        </td>
                                        
                                        {/* Collected */}
                                        <td className="px-6 py-4 text-emerald-600 font-semibold">
                                            {fmt(month.collected, activeBlock.currency)}
                                        </td>
                                        
                                        {/* Pending / Overdue */}
                                        <td className="px-6 py-4">
                                            {month.pending > 0 ? (
                                                <span className={`inline-flex items-center gap-1.5 font-bold ${isOverdue ? 'text-red-600' : 'text-slate-500'}`}>
                                                    {fmt(month.pending, activeBlock.currency)}
                                                    {isOverdue && (
                                                        <span className="inline-flex items-center rounded-full bg-red-50 border border-red-100 px-2 py-0.5 text-[9px] font-extrabold text-red-600 uppercase tracking-widest">
                                                            Mora
                                                        </span>
                                                    )}
                                                </span>
                                            ) : (
                                                <span className="text-slate-300 font-normal">—</span>
                                            )}
                                        </td>

                                        {/* Progress Bar inside cell */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-300 ${
                                                            month.pending === 0 ? 'bg-emerald-500' : 'bg-emerald-450'
                                                        }`}
                                                        style={{ width: `${collectedPct}%` }}
                                                    />
                                                </div>
                                                <span className="text-[11px] font-bold text-slate-600">{Math.round(collectedPct)}%</span>
                                            </div>
                                        </td>

                                        {/* Installments count */}
                                        <td className="px-6 py-4 text-xs text-slate-400 font-medium">
                                            {month.paidCount} / {month.total} pagadas
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
