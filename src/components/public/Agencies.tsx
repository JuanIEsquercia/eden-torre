import { getAgencies } from '@/app/admin/agencies/actions'
import { AgencyLogo } from './AgencyLogo'

// Define the default message here centrally
const DEFAULT_WHATSAPP_MESSAGE = "Hola, vi el desarrollo de Torre Eden en su web y me interesa tener más información para inversión."

export async function Agencies() {
    const agencies = await getAgencies()

    // If no agencies, we might want to hide thesection or show a placeholder.
    // For now, let's hide it if empty to keep the design clean.
    if (!agencies || agencies.length === 0) return null

    return (
        <div id="agencies" className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                        Comercializan EDEN
                    </h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        Selecciona la inmobiliaria y contactala al Whatsapp
                    </p>
                </div>
                {/* Dynamic grid based on count */}
                <div className="mx-auto mt-16 flex flex-nowrap overflow-x-auto gap-12 items-center justify-start md:justify-center pb-4 scrollbar-hide snap-x w-full px-4">
                    {agencies.map((agency) => {
                        // Construct the dynamic link
                        // Use phone property
                        const waLink = `https://wa.me/${agency.phone}?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`

                        return (
                            <div key={agency.id} className="flex-shrink-0 flex justify-center snap-center min-w-[160px]">
                                <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative group block flex items-center justify-center p-4 transition-all duration-300 hover:scale-105"
                                >
                                    <AgencyLogo
                                        src={agency.logoUrl}
                                        alt={agency.name}
                                    />
                                </a>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
