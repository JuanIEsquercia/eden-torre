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
        <div className="flex flex-col md:flex-row md:h-screen md:overflow-hidden bg-gray-100">
            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
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
                {/* Mobile top bar */}
                <div className="flex h-14 shrink-0 items-center border-b bg-white px-4 md:hidden print:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                        aria-label="Abrir menú"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <span className="ml-3 text-base font-bold tracking-tight text-primary">
                        EDEN Admin
                    </span>
                </div>

                <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8 print:p-0">
                    {children}
                </main>
            </div>
        </div>
    )
}
