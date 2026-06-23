import { db } from '@/lib/firebase-admin'
import { CreateUserForm } from './CreateUserForm'
import { deleteUser } from './actions'
import { Trash2 } from 'lucide-react'

interface UserRecord {
    uid: string
    name: string
    email: string
    createdAt: Date
}

async function getUsers(): Promise<UserRecord[]> {
    const snapshot = await db.collection('users').orderBy('createdAt', 'desc').get()
    return snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() ?? new Date(),
    })) as UserRecord[]
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
                )}
            </div>
        </div>
    )
}
