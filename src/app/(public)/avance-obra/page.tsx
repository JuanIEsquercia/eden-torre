import { getUpdates } from '@/app/admin/updates/actions'
import { ProjectUpdates } from '@/components/public/ProjectUpdates'

export const dynamic = 'force-dynamic'

export default async function ProjectProgressPage() {
    const updates = await getUpdates()

    return (
        <main className="min-h-screen bg-white">
            <div className="relative bg-primary py-24 sm:py-32">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.gray.800),theme(colors.gray.900))] opacity-80" />
                </div>
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center text-white">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Avance de Obra</h1>
                    <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
                        Transparencia total. Seguí el crecimiento de tu inversión paso a paso.
                    </p>
                </div>
            </div>

            <ProjectUpdates updates={updates} />
        </main>
    )
}
