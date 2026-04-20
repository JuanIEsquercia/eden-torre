import { getAgencies, type Agency } from '@/app/admin/agencies/actions'
import { AgenciesMarquee } from './AgenciesMarquee'
import { AgencyContactGrid } from './AgencyContactGrid'

interface AgenciesProps {
    agencies?: Agency[]
}

export async function Agencies({ agencies: prefetchedAgencies }: AgenciesProps = {}) {
    const agencies = prefetchedAgencies ?? await getAgencies()

    if (!agencies || agencies.length === 0) return null

    return (
        <div id="agencies" className="bg-white py-24 sm:py-32 border-t border-gray-100">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                        Comercializan EDEN
                    </h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        Elegí la inmobiliaria de tu confianza y consultá por WhatsApp
                    </p>
                </div>

                <AgenciesMarquee agencies={agencies} />

                <div className="mt-16">
                    <AgencyContactGrid agencies={agencies} />
                </div>
            </div>
        </div>
    )
}
