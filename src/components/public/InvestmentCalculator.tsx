'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, ChevronDown, ChevronUp } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { getFinancingRules, calculateInstallment } from '@/lib/financing-rules'

interface InvestmentCalculatorProps {
    price: number
    propertyTitle: string
    typologyName: string
    disposition: string
}

export default function InvestmentCalculator({ price, propertyTitle, typologyName, disposition }: InvestmentCalculatorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [downPaymentPercent, setDownPaymentPercent] = useState(25)
    const [installments, setInstallments] = useState(24)

    // Calculate Rules based on current selection
    const { maxInstallments, plan, annualInterest } = getFinancingRules(typologyName, disposition, downPaymentPercent)

    // Auto-adjust installments if they exceed max
    useEffect(() => {
        if (installments > maxInstallments) {
            setInstallments(maxInstallments)
        }
    }, [maxInstallments, installments])

    const downPaymentAmount = price * (downPaymentPercent / 100)
    const monthlyInstallment = calculateInstallment(price, downPaymentPercent, installments, annualInterest)

    return (
        <div>
            {/* Trigger Button - Clean & Professional */}
            <div className="w-full border-t border-b border-white/10 py-4 my-4">
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center justify-between w-full text-left group bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 transition-all"
                >
                    <div className="flex items-center gap-3 text-white">
                        <div className="bg-accent/20 p-1.5 rounded-md">
                            <Calculator className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <span className="font-bold block text-sm">Calcular Financiación</span>
                            <span className="text-xs text-gray-400 font-normal">Ver planes de pago</span>
                        </div>
                    </div>
                    <ChevronDown className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
                </button>
            </div>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal Card */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden z-10"
                        >
                            {/* Header */}
                            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-white">
                                    <Calculator className="w-5 h-5 text-accent" />
                                    <h3 className="font-bold text-lg">Calculadora de Inversión</h3>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-white/60 hover:text-white transition-colors"
                                >
                                    <span className="text-2xl leading-none">&times;</span>
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Property Info */}
                                <div className="text-center border-b border-gray-100 pb-4">
                                    <p className="text-sm text-gray-500">{propertyTitle}</p>
                                    <p className="text-2xl font-bold text-primary mt-1">{formatCurrency(price)}</p>
                                </div>

                                {/* Down Payment Selector */}
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600 font-medium">Anticipo ({downPaymentPercent}%)</span>
                                        <span className="font-bold text-gray-900">{formatCurrency(downPaymentAmount)}</span>
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={downPaymentPercent}
                                            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                                            className="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-primary transition-colors cursor-pointer"
                                        >
                                            <option value={0}>0% - Financiación Total</option>
                                            <option value={10}>10% - Entrega Mínima</option>
                                            <option value={25}>25% - Plan Estándar</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <ChevronDown className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>

                                {/* Installments Selector */}
                                <div>
                                    <span className="flex justify-between text-sm font-medium text-gray-600 mb-3">
                                        <span>Cantidad de Cuotas</span>
                                        <span className="text-xs text-accent font-normal bg-accent/10 px-2 py-0.5 rounded">
                                            Max: {maxInstallments}
                                        </span>
                                    </span>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[12, 24, 36, 48, 60, 72, 84].map(m => (
                                            <button
                                                key={m}
                                                disabled={m > maxInstallments}
                                                onClick={() => setInstallments(m)}
                                                className={`py-2 text-sm rounded-lg border transition-all ${installments === m
                                                    ? 'bg-primary text-white border-primary shadow-lg scale-105 font-semibold'
                                                    : m > maxInstallments
                                                        ? 'bg-gray-50 text-gray-200 border-gray-100 cursor-not-allowed hidden' // Hide invalid options strictly
                                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Result Box */}
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 text-center relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-primary" />
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">Cuota Mensual Estimada</p>
                                    <p className="text-3xl font-bold text-primary font-serif">
                                        {monthlyInstallment.toLocaleString('es-AR', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
                                    </p>

                                    {annualInterest > 0 && <p className="text-[10px] text-red-500 font-semibold mt-2">*Incluye {annualInterest * 100}% interés anual</p>}
                                </div>

                                {/* Info Footer */}
                                <div className="text-center px-4">
                                    <p className="text-xs text-gray-400">
                                        * Los valores son estimados y están sujetos a aprobación crediticia.
                                    </p>
                                    <p className="text-[10px] text-gray-300 mt-2 font-mono">
                                        Debug: {typologyName} | {disposition} | Plan {plan || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
