import { cache } from 'react'
import { getProperties } from '@/app/admin/properties/actions'
import { getTypologies } from '@/app/admin/typologies/actions'
import { PropertyCard } from '@/components/public/PropertyCard'
import { FinancingBanner } from '@/components/public/FinancingBanner'
import { buildPropertyListSchema } from '@/lib/schema'

const getCachedProperties = cache(() => getProperties())
const getCachedTypologies = cache(() => getTypologies())

export const revalidate = 10800 // 3 hours

export const metadata = {
    title: 'Departamentos del Pozo en Corrientes | Catálogo Torre EDEN',
    description: 'Explorá el catálogo completo de departamentos del pozo en Corrientes. Monoambientes, 1 y 2 dormitorios disponibles. Precios, superficies y financiación en Torre EDEN.',
    keywords: [
        'departamentos del pozo Corrientes',
        'comprar departamento Corrientes',
        'departamentos nuevos Corrientes',
        'desarrollo inmobiliario Corrientes',
        'unidades disponibles Torre EDEN',
    ],
    openGraph: {
        title: 'Departamentos del Pozo en Corrientes | Torre EDEN',
        description: 'Catálogo completo de departamentos del pozo en Corrientes. Precios y disponibilidad en tiempo real.',
        url: '/properties',
    },
}

export default async function PublicPropertiesPage() {
    const [properties, typologies] = await Promise.all([
        getCachedProperties(),
        getCachedTypologies(),
    ])

    const typologyMap = Object.fromEntries(typologies.map(t => [t.id, t.name]))
    const listSchema = buildPropertyListSchema(properties, typologyMap)

    return (
        <div className="bg-white py-24 sm:py-32">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
            />
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

                <div className="mx-auto mt-12 max-w-5xl">
                    <FinancingBanner contactUrl="/#agencies" />
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
