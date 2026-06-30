import { prisma } from '@/lib/prisma'
import { CreateUserForm } from './CreateUserForm'
import { deleteUser } from './actions'
import { Trash2 } from 'lucide-react'

interface UserRecord {
    uid: string  // Firebase UID (usado por deleteUser)
    name: string
    email: string
    createdAt: Date
}

async function getUsers(): Promise<UserRecord[]> {
    const rows = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
    return rows.map(r => ({
        uid: r.firebaseUid ?? '',
        name: r.name,
        email: r.email,
        createdAt: r.createdAt,
    }))
}

export default async function UsersPage() {
    const users = await getUsers()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Gestión de Usuarios</h1>
                <p className="text-sm text-muted-foreground">
                    Creá accesos para el equipo. El nuevo usuario recibirá un email para configurar su contraseña.
                </p>
            </div>

            <CreateUserForm />

            <div className="rounded-lg border bg-white shadow-sm">
                <div className="border-b px-6 py-4">
                    <h2 className="text-base font-semibold">Usuarios con acceso</h2>
                </div>

                {users.length === 0 ? (
                    <div className="px-6 py-10 text-center text-sm text-muted-foreground">
                        No hay usuarios creados todavía.
                    </div>
                ) : (
                    <>
                        {/* Mobile: card list */}
                        <ul className="divide-y md:hidden">
                            {users.map(user => (
                                <li key={user.uid} className="flex items-start justify-between gap-3 px-4 py-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
                                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {user.createdAt.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <form action={deleteUser.bind(null, user.uid)} className="shrink-0">
                                        <button
                                            type="submit"
                                            className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </form>
                                </li>
                            ))}
                        </ul>

                        {/* Desktop: table */}
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        <th className="px-6 py-3">Nombre</th>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3">Creado</th>
                                        <th className="px-6 py-3 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {users.map(user => (
                                        <tr key={user.uid} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4 font-medium">{user.name}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {user.createdAt.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <form action={deleteUser.bind(null, user.uid)}>
                                                    <button
                                                        type="submit"
                                                        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        Eliminar
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
