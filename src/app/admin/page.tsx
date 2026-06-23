import { getCashFlowData } from './cashflow'
import { RefreshButton } from './RefreshButton'
import DashboardClientView from './DashboardClientView'

export default async function AdminDashboard() {
    const { blocks, ventasCount, generatedAt } = await getCashFlowData()

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                    <p className="text-sm text-muted-foreground">
                        {ventasCount} operación{ventasCount !== 1 ? 'es' : ''} activa{ventasCount !== 1 ? 's' : ''}
                    </p>
                </div>
                <RefreshButton generatedAt={generatedAt} />
            </div>

            {blocks.length === 0 ? (
                <div className="rounded-lg border bg-white p-16 text-center text-sm text-muted-foreground shadow-sm">
                    No hay ventas registradas todavía.{' '}
                    <a href="/admin/sales/new" className="text-primary underline">Registrá la primera venta.</a>
                </div>
            ) : (
                <DashboardClientView blocks={blocks} ventasCount={ventasCount} />
            )}
        </div>
    )
}
