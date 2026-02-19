import { getAgencies } from '@/app/admin/agencies/actions'
import { AgenciesMarquee } from './AgenciesMarquee'

export async function Agencies() {
    const agencies = await getAgencies()

    // If no agencies, we might want to hide thesection or show a placeholder.
    // For now, let's hide it if empty to keep the design clean.
    if (!agencies || agencies.length === 0) return null

    return (
        <div id="agencies" className="bg-white py-24 sm:py-32 border-t border-gray-100">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                        Comercializan EDEN
                    </h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        Selecciona la inmobiliaria de tu confianza
                    </p>
                </div>

                <AgenciesMarquee agencies={agencies} />

            </div>
        </div>
    )
}
