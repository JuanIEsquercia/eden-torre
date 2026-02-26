import Link from 'next/link'
import { Building2, LayoutDashboard, CarFront, Waves, MapPin, HeartPulse, ArrowRight } from 'lucide-react'
import { getProperties } from '@/app/admin/properties/actions'
import { getTypologies } from '@/app/admin/typologies/actions'
import { getUpdates } from '@/app/admin/updates/actions'
import { getGalleryImages } from '@/app/admin/gallery/actions'
import { PropertyCard } from '@/components/public/PropertyCard'
import { Agencies } from '@/components/public/Agencies'
import { Brands } from '@/components/public/Brands'
import { ProjectUpdates } from '@/components/public/ProjectUpdates'
import { ProjectGallery } from '@/components/public/ProjectGalleryCarousel'
import { FinancingBanner } from '@/components/public/FinancingBanner'

async function LatestUpdates() {
    const updates = await getUpdates()
    // Only show latest 3
    const latest = updates.slice(0, 3)

    if (latest.length === 0) return null

    return (
        <div id="updates" className="border-t border-gray-100">
            <ProjectUpdates updates={latest} />
            <div className="flex justify-center pb-24 -mt-12 bg-white">
                <Link
                    href="/avance-obra"
                    className="text-sm font-semibold leading-6 text-accent hover:text-accent/80 flex items-center gap-1"
                >
                    Ver historial completo <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    )
}


export const dynamic = 'force-dynamic'

export default async function LandingPage() {
    const properties = await getProperties()
    const typologies = await getTypologies()
    const galleryImages = await getGalleryImages()

    // Show only available properties, limit to 6 for the landing page
    const featuredProperties = properties
        .filter(p => p.status === 'available')
        .slice(0, 3) // Show top 3 available

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <div className="relative isolate flex flex-col justify-center px-6 pt-14 lg:px-8 bg-primary min-h-[90vh] overflow-hidden">
                {/* Premium Background Gradients */}
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary via-slate-900 to-black opacity-90" />
                <div className="absolute top-0 right-0 -z-10 w-full h-full bg-gradient-to-b from-transparent via-transparent to-primary/80" />

                {/* Subtle Accent Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-20 w-[800px] h-[800px] bg-accent/15 rounded-full blur-[120px] pointer-events-none" />

                <div className="mx-auto max-w-4xl py-16 text-center z-10">
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        <div className="relative rounded-full px-4 py-1.5 text-xs font-semibold leading-6 text-accent ring-1 ring-accent/30 hover:ring-accent/50 bg-accent/5 backdrop-blur-sm transition-all tracking-widest uppercase mb-4">
                            Lanzamiento Exclusivo en Corrientes
                        </div>
                    </div>

                    <h1 className="text-5xl font-extrabold tracking-tighter text-white sm:text-7xl drop-shadow-md">
                        Vivir en <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-400">EDEN</span> es vivir conectado
                    </h1>

                    <p className="mt-8 text-lg leading-relaxed text-gray-300 max-w-2xl mx-auto font-light">
                        Un desarrollo inmobiliario de vanguardia. Diseño moderno, ubicación estratégica y amenities de primera categoría diseñados para elevar tu calidad de vida.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                        <Link
                            href="/properties"
                            className="w-full sm:w-auto rounded-full bg-accent px-8 py-3.5 text-sm font-bold tracking-wide text-primary shadow-[0_0_20px_rgba(202,138,4,0.3)] hover:shadow-[0_0_30px_rgba(202,138,4,0.5)] hover:scale-105 transition-all duration-300 uppercase"
                        >
                            Ver Unidades
                        </Link>
                        <Link
                            href="/#project"
                            className="w-full sm:w-auto rounded-full px-8 py-3.5 text-sm font-semibold tracking-wide text-white ring-1 ring-white/20 hover:ring-white hover:bg-white/10 transition-all duration-300"
                        >
                            Descubrir Proyecto
                        </Link>
                    </div>
                </div>
            </div>

            {/* Brands / Partners Section */}
            <Brands />

            {/* Feature/Overview Section */}
            <div id="project" className="pt-24 pb-24 bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center mb-16">
                        <h2 className="text-base font-semibold leading-7 text-accent uppercase tracking-widest">El Edificio</h2>
                        <p className="mt-2 text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                            Elegancia y Vanguardia
                        </p>
                        <p className="mt-4 text-lg leading-8 text-gray-600">
                            Diseñamos cada detalle para ofrecerte una experiencia de vida superior en la mejor ubicación de Corrientes.
                        </p>
                    </div>

                    {/* New Project Gallery */}
                    <div className="mb-24">
                        <ProjectGallery images={galleryImages} />
                    </div>

                    <div className="mx-auto max-w-2xl lg:text-center">
                        <p className="text-3xl font-bold tracking-tight text-primary sm:text-4xl mb-12">
                            Especificaciones y Amenities
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

            {/* Commercial Partners Section */}
            <Agencies />

            {/* Properties Section */}
            <div id="properties" className="py-24 sm:py-32 bg-gray-50">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Unidades Destacadas</h2>
                        <p className="mt-2 text-lg leading-8 text-gray-600">
                            Descubre las oportunidades exclusivas que EDEN tiene para ofrecerte.
                        </p>
                    </div>

                    <div className="mx-auto mt-12 max-w-5xl">
                        <FinancingBanner contactUrl="/#agencies" />
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

            {/* Project Updates Section (Latest 3) */}
            <LatestUpdates />
        </div>
    )
}
