export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
            <div className="rounded-lg border bg-white p-8 shadow-sm">
                <h2 className="text-lg font-medium text-foreground">Bienvenido al Panel de Control de EDEN</h2>
                <p className="mt-2 text-muted-foreground">
                    Selecciona una opción del menú lateral para comenzar a gestionar el contenido.
                </p>
            </div>
        </div>
    )
}
