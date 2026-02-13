import { getProperties } from '@/app/admin/properties/actions'
import { getTypologies } from '@/app/admin/typologies/actions'
import { PropertyCard } from '@/components/public/PropertyCard'

export const dynamic = 'force-dynamic'

export default async function PublicPropertiesPage() {
    const properties = await getProperties()
    const typologies = await getTypologies()

    // Filter only available properties or maybe all but with status badge?
    // Let's show all for now but highlgiht status.

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-accent">Catálogo</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                        Encontra tu próxima inversión
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Explora nuestras unidades disponibles.
                    </p>
                </div>

                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {properties.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500">
                            No hay propiedades publicadas en este momento.
                        </div>
                    ) : (
                        properties.map((property) => {
                            const typology = typologies.find(t => t.id === property.typologyId)
                            return (
                                <PropertyCard key={property.id} property={property} typology={typology} />
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}
