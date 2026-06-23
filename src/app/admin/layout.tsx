import { cookies } from 'next/headers'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const role = cookieStore.get('eden-role')?.value ?? 'user'

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            <AdminSidebar role={role} />
            <main className="flex-1 overflow-y-auto bg-gray-50 p-8 print:p-0">
                {children}
            </main>
        </div>
    )
}
