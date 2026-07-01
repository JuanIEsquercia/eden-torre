'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Building2, Home, LogOut, Briefcase, History, Image, Users, Tag, HandCoins, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '@/app/admin/actions'

type Role = 'superadmin' | 'user' | string

const navigation = [
    { name: 'Dashboard',        href: '/admin',             icon: LayoutDashboard,  roles: ['superadmin', 'user'] },
    { name: 'Ventas',           href: '/admin/sales',       icon: HandCoins,        roles: ['superadmin', 'user'] },
    { name: 'Tipologías',       href: '/admin/typologies',  icon: Building2,        roles: ['superadmin'] },
    { name: 'Propiedades',      href: '/admin/properties',  icon: Home,             roles: ['superadmin'] },
    { name: 'Inmobiliarias',    href: '/admin/agencies',    icon: Briefcase,        roles: ['superadmin'] },
    { name: 'Marcas',           href: '/admin/brands',      icon: Tag,              roles: ['superadmin'] },
    { name: 'Galería Proyecto', href: '/admin/gallery',     icon: Image,            roles: ['superadmin'] },
    { name: 'Avance Obra',      href: '/admin/updates',     icon: History,          roles: ['superadmin'] },
    { name: 'Usuarios',         href: '/admin/users',       icon: Users,            roles: ['superadmin'] },
]

interface AdminSidebarProps {
    role: Role
    isOpen?: boolean
    onClose?: () => void
}

export function AdminSidebar({ role, isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname()
    const visibleItems = navigation.filter(item => item.roles.includes(role))

    return (
        <div className={cn(
            'flex h-full w-64 flex-col dark-sidebar text-slate-100 print:hidden',
            // Mobile: fixed overlay drawer; Desktop: static in flex layout
            'fixed inset-y-0 left-0 z-50 md:static md:z-auto md:translate-x-0',
            'transition-transform duration-300 ease-in-out md:transition-none',
            isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}>
            <div className="flex h-16 items-center justify-between px-6 border-b border-white/5">
                <div className="flex flex-col">
                    <span className="text-md font-bold tracking-wider text-white flex items-center gap-1.5 uppercase">
                        EDEN <span className="text-xs font-semibold text-accent border border-accent/30 rounded px-1 py-0.5">ADMIN</span>
                    </span>
                    <span className="text-[10px] tracking-widest text-slate-400 font-semibold uppercase -mt-0.5">
                        Torre Residencial
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="rounded-md p-1 text-slate-400 hover:bg-white/5 hover:text-white md:hidden"
                    aria-label="Cerrar menú"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
            
            {/* User Profile Summary */}
            <div className="px-6 py-4 border-b border-white/5 bg-black/10">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 border border-accent/40 text-xs font-bold text-accent uppercase">
                        {role.substring(0, 2)}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-semibold text-slate-200 truncate">Administrador</span>
                        <span className="text-[10px] text-accent font-medium capitalize tracking-wider">{role}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto pt-4 pb-4">
                <nav className="flex-1 space-y-1 px-3">
                    <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Navegación
                    </div>
                    {visibleItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    isActive
                                        ? 'bg-accent/15 text-accent border-l-2 border-accent shadow-sm'
                                        : 'text-slate-350 hover:bg-white/[0.04] hover:text-white',
                                    'group flex items-center rounded-r-md px-3 py-2 text-sm font-medium transition-all duration-200'
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        isActive ? 'text-accent' : 'text-slate-400 group-hover:text-slate-200',
                                        'mr-3 h-4.5 w-4.5 flex-shrink-0 transition-colors'
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="border-t border-white/5 p-4">
                <form action={logout}>
                    <button
                        type="submit"
                        className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                    >
                        <LogOut
                            className="mr-3 h-4.5 w-4.5 flex-shrink-0 text-slate-400 group-hover:text-red-400 transition-colors"
                            aria-hidden="true"
                        />
                        Cerrar Sesión
                    </button>
                </form>
            </div>
        </div>
    )
}
