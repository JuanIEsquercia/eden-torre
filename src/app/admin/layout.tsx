import { cookies } from 'next/headers'
import { AdminShell } from '@/components/admin/AdminShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const role = cookieStore.get('eden-role')?.value ?? 'user'

    return (
        <AdminShell role={role}>
            {children}
        </AdminShell>
    )
}
