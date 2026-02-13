import Link from 'next/link'
import { Building2, LayoutDashboard, CarFront, Waves, MapPin, HeartPulse, ArrowRight } from 'lucide-react'
import { getProperties } from '@/app/admin/properties/actions'
import { getTypologies } from '@/app/admin/typologies/actions'
import { PropertyCard } from '@/components/public/PropertyCard'
import { Agencies } from '@/components/public/Agencies'
import { Brands } from '@/components/public/Brands'

export const dynamic = 'force-dynamic'

export default async function LandingPage() {
    const properties = await getProperties()
    const typologies = await getTypologies()

    // Show only available properties, limit to 6 for the landing page
    const featuredProperties = properties
        .filter(p => p.status === 'available')
        .slice(0, 3) // Show top 3 available

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <div className="relative isolate flex flex-col justify-center px-6 pt-14 lg:px-8 bg-primary min-h-[85vh]">
                {/* ... (Hero content) ... */}
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.gray.800),theme(colors.gray.900))] opacity-80" />
                <div className="absolute inset-0 -z-20 h-full w-full object-cover">
                    {/* TODO: Add real hero image here */}
                    <div className="h-full w-full bg-gradient-to-br from-primary via-slate-900 to-black" />
                </div>

                <div className="mx-auto max-w-2xl py-16 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                        Vivir en <span className="text-accent">EDEN</span> es vivir conectado.
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                        Un desarrollo exclusivo en el corazón de Corrientes. Diseño moderno, ubicación estratégica y amenities de primera categoría.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link
                            href="/properties"
                            className="rounded-md bg-accent px-3.5 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        >
                            Ver Unidades Disponibles
                        </Link>
                        <Link href="/#project" className="text-sm font-semibold leading-6 text-white hover:text-accent transition-colors">
                            Conocer más <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Brands / Partners Section */}
            <Brands />

            {/* Feature/Overview Section */}
            <div id="project" className="pt-16 pb-24 sm:pb-32 bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-accent">Desarrollo EDEN</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                            Innovación y confort en barrio San Martín
                        </p>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Una torre residencial diseñada con enfoque en la eficiencia y la calidad de vida.
                            Ubicada estratégicamente en Gdor. Raúl Castillo 2149, Corrientes Capital.
                        </p>
                    </div>

                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            {[
                                {
                                    name: 'Especificaciones',
                                    description: 'Torre de 9 pisos en un terreno de 10x47m. Diseño optimizado entre medianeras para máxima funcionalidad.',
                                    icon: Building2
                                },
                                {
                                    name: 'Unidades Versátiles',
                                    description: 'Monoambientes, 1 y 2 dormitorios. Espacios pensados para la comodidad y eficiencia diaria.',
                                    icon: LayoutDashboard
                                },
                                {
                                    name: 'Cocheras Privadas',
                                    description: '15 unidades de estacionamiento distribuidas cómodamente entre planta baja y primer piso.',
                                    icon: CarFront
                                },
                                {
                                    name: 'Amenities Premium',
                                    description: 'Disfruta de piscina al aire libre, solárium exclusivo y zona de parrilla para tus momentos de relax.',
                                    icon: Waves
                                },
                                {
                                    name: 'Ubicación Estratégica',
                                    description: 'Gdor. Raúl Castillo 2149. A solo 5’ de Peatonal Junín, Costanera Sur y Av. 3 de Abril.',
                                    icon: MapPin
                                },
                                {
                                    name: 'Salud y Servicios',
                                    description: 'Próximo a importantes centros médicos y servicios esenciales, ideal para inversión o vivienda.',
                                    icon: HeartPulse
                                },
                            ].map((feature) => (
                                <div key={feature.name} className="flex flex-col items-start">
                                    <div className="rounded-lg bg-gray-50 p-2 ring-1 ring-gray-900/10 mb-4">
                                        <feature.icon className="h-6 w-6 text-accent" aria-hidden="true" />
                                    </div>
                                    <dt className="text-base font-semibold leading-7 text-gray-900">
                                        {feature.name}
                                    </dt>
                                    <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                        <p className="flex-auto">{feature.description}</p>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>

            {/* Properties Section */}
            <div id="properties" className="py-24 sm:py-32 bg-gray-50">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Unidades Destacadas</h2>
                        <p className="mt-2 text-lg leading-8 text-gray-600">
                            Descubre las oportunidades exclusivas que EDEN tiene para ofrecerte.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        {featuredProperties.map((property) => {
                            const typology = typologies.find(t => t.id === property.typologyId)
                            return (
                                <PropertyCard key={property.id} property={property} typology={typology} />
                            )
                        })}
                    </div>
                    <div className="mt-10 flex justify-center">
                        <Link
                            href="/properties"
                            className="text-sm font-semibold leading-6 text-accent hover:text-accent/80 flex items-center gap-1"
                        >
                            Ver todo el inventario <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Commercial Partners Section */}
            <Agencies />

        </div>
    )
}
