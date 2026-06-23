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
            'flex h-full w-64 flex-col border-r bg-white print:hidden',
            // Mobile: fixed overlay drawer; Desktop: static in flex layout
            'fixed inset-y-0 left-0 z-50 md:static md:z-auto md:translate-x-0',
            'transition-transform duration-300 ease-in-out md:transition-none',
            isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}>
            <div className="flex h-16 items-center border-b px-6">
                <span className="text-lg font-bold tracking-tight text-primary">EDEN Admin</span>
                <button
                    onClick={onClose}
                    className="ml-auto rounded-md p-1 text-muted-foreground hover:bg-muted md:hidden"
                    aria-label="Cerrar menú"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                <nav className="mt-1 flex-1 space-y-1 px-2">
                    {visibleItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    isActive
                                        ? 'bg-muted text-primary'
                                        : 'text-muted-foreground hover:bg-muted hover:text-primary',
                                    'group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors'
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary',
                                        'mr-3 h-5 w-5 flex-shrink-0'
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>
            <div className="border-t p-4">
                <form action={logout}>
                    <button
                        type="submit"
                        className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut
                            className="mr-3 h-5 w-5 flex-shrink-0 text-muted-foreground group-hover:text-red-600"
                            aria-hidden="true"
                        />
                        Cerrar Sesión
                    </button>
                </form>
            </div>
        </div>
    )
}
