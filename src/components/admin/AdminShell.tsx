'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { AdminSidebar } from './AdminSidebar'

interface AdminShellProps {
    role: string
    children: React.ReactNode
}

export function AdminShell({ role, children }: AdminShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex flex-col md:flex-row md:h-screen md:overflow-hidden bg-slate-50">
            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-all duration-300"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            <AdminSidebar
                role={role}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Mobile top bar (Dark / Gold Theme) */}
                <div className="flex h-14 shrink-0 items-center border-b border-white/5 bg-[#0b0f19] px-4 md:hidden print:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                        aria-label="Abrir menú"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <span className="ml-3 text-sm font-bold tracking-wider text-white uppercase">
                        EDEN <span className="text-accent">ADMIN</span>
                    </span>
                </div>

                <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50/80 via-slate-100/50 to-slate-50/80 p-4 md:p-8 print:p-0">
                    {children}
                </main>
            </div>
        </div>
    )
}
