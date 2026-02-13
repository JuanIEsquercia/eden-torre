import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
                {children}
            </main>
        </div>
    )
}
