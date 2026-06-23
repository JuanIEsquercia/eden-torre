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
                <div className="flex border-b border-gray-200">
                    <div className="flex space-x-8">
                        {blocks.map(block => {
                            const isActive = activeTab === block.currency
                            return (
                                <button
                                    key={block.currency}
                                    onClick={() => setActiveTab(block.currency)}
                                    className={`relative py-4 px-1 text-sm font-semibold transition-colors focus:outline-none ${
                                        isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                                    }`}
                                >
                                    {block.currency === 'USD' ? 'Dólares (U$D)' : 'Pesos ($)'}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabUnderline"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
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
                    whileHover={{ y: -2 }}
                    className="rounded-xl border border-gray-150 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Operaciones</p>
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-4xl font-bold tracking-tight text-primary">{ventasCount}</p>
                    <p className="mt-1.5 text-xs text-muted-foreground">unidades vendidas en total</p>
                </motion.div>

                {/* Cobrado */}
                <motion.div 
                    whileHover={{ y: -2 }}
                    className="rounded-xl border border-gray-150 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Cobrado</p>
                        <HandCoins className="h-5 w-5 text-emerald-500" />
                    </div>
                    <p className="text-3xl font-bold tracking-tight text-primary">{fmt(totalCobrado, activeBlock.currency)}</p>
                    
                    {/* Progress bar */}
                    <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-150">
                        <div 
                            className="h-full rounded-full bg-emerald-500 transition-all duration-500" 
                            style={{ width: `${Math.min(100, progressPct)}%` }} 
                        />
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">{Math.round(progressPct)}% del total proyectado</p>
                </motion.div>

                {/* Cobro del Mes */}
                <motion.div 
                    whileHover={{ y: -2 }}
                    className="rounded-xl border border-gray-150 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Este Mes</p>
                        <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    {(() => {
                        const nowKey = new Date().toISOString().substring(0, 7)
                        const currentMonth = activeBlock.months.find(m => m.key === nowKey)
                        return currentMonth ? (
                            <>
                                <p className="text-3xl font-bold tracking-tight text-primary">{fmt(currentMonth.projected, activeBlock.currency)}</p>
                                <p className="mt-3 text-xs text-muted-foreground">
                                    cobrado: <span className="font-semibold text-emerald-600">{fmt(currentMonth.collected, activeBlock.currency)}</span>
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-3xl font-bold tracking-tight text-muted-foreground">—</p>
                                <p className="mt-3 text-xs text-muted-foreground">sin cuotas este mes</p>
                            </>
                        )
                    })()}
                </motion.div>

                {/* Vencimientos / Al día */}
                <motion.div 
                    whileHover={{ y: -2 }}
                    className={`rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow duration-200 ${
                        activeBlock.overdueCount > 0 
                            ? 'border-red-200 bg-red-50/30' 
                            : 'border-emerald-200 bg-emerald-50/30'
                    }`}
                >
                    {activeBlock.overdueCount > 0 ? (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-red-600">Vencimientos</p>
                                <AlertCircle className="h-5 w-5 text-red-500" />
                            </div>
                            <p className="text-3xl font-bold tracking-tight text-red-700">{fmt(activeBlock.overdueAmount, activeBlock.currency)}</p>
                            <p className="mt-3 text-xs text-red-600 font-medium">
                                {activeBlock.overdueCount} cuota{activeBlock.overdueCount !== 1 ? 's' : ''} sin cobrar
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 font-medium">Vencimientos</p>
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            </div>
                            <p className="text-3xl font-bold tracking-tight text-emerald-700">Al día</p>
                            <p className="mt-3 text-xs text-emerald-600 font-medium">sin cuotas vencidas</p>
                        </>
                    )}
                </motion.div>
            </div>

            {/* Monthly cash flow breakdown table */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-150 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <h3 className="font-semibold text-primary text-base">Cronograma de Flujo de Caja</h3>
                        <p className="text-xs text-muted-foreground">Proyección de cobro y recaudación mes a mes</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700 font-semibold tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-3.5">Mes</th>
                                <th scope="col" className="px-6 py-3.5">Proyectado</th>
                                <th scope="col" className="px-6 py-3.5">Cobrado</th>
                                <th scope="col" className="px-6 py-3.5">Pendiente / Mora</th>
                                <th scope="col" className="px-6 py-3.5">Progreso</th>
                                <th scope="col" className="px-6 py-3.5">Cuotas</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-150 bg-white">
                            {activeBlock.months.map((month) => {
                                const collectedPct = month.projected > 0 ? (month.collected / month.projected) * 100 : 0
                                const isOverdue = month.isPast && month.pending > 0
                                
                                return (
                                    <tr 
                                        key={month.key} 
                                        className={`hover:bg-gray-50/60 transition-colors ${
                                            month.isCurrentMonth ? 'bg-amber-50/20 font-medium' : ''
                                        }`}
                                    >
                                        {/* Month & Badge */}
                                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                                            {month.label}
                                            {month.isCurrentMonth && (
                                                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                                                    Actual
                                                </span>
                                            )}
                                        </td>
                                        
                                        {/* Projected */}
                                        <td className="px-6 py-4 text-gray-900 font-semibold">
                                            {fmt(month.projected, activeBlock.currency)}
                                        </td>
                                        
                                        {/* Collected */}
                                        <td className="px-6 py-4 text-emerald-600 font-medium">
                                            {fmt(month.collected, activeBlock.currency)}
                                        </td>
                                        
                                        {/* Pending / Overdue */}
                                        <td className="px-6 py-4">
                                            {month.pending > 0 ? (
                                                <span className={`inline-flex items-center gap-1 font-semibold ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                                                    {fmt(month.pending, activeBlock.currency)}
                                                    {isOverdue && (
                                                        <span className="inline-flex items-center rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-extrabold text-red-800 uppercase tracking-widest">
                                                            Mora
                                                        </span>
                                                    )}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 font-normal">—</span>
                                            )}
                                        </td>

                                        {/* Progress Bar inside cell */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-150">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-300 ${
                                                            month.pending === 0 ? 'bg-emerald-500' : 'bg-emerald-400'
                                                        }`}
                                                        style={{ width: `${collectedPct}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-semibold text-gray-700">{Math.round(collectedPct)}%</span>
                                            </div>
                                        </td>

                                        {/* Installments count */}
                                        <td className="px-6 py-4 text-xs text-muted-foreground">
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
