import { getProperty } from '@/app/admin/properties/actions'
import { getTypologies } from '@/app/admin/typologies/actions'
import { getAgencies } from '@/app/admin/agencies/actions'
import { notFound } from 'next/navigation'
import { Ruler, BedDouble, Calendar, ArrowLeft, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { PropertyGallery } from '@/components/public/PropertyGallery'
import InvestmentCalculator from '@/components/public/InvestmentCalculator'

export const dynamic = 'force-dynamic'

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const property = await getProperty(id)
    const typologies = await getTypologies()
    const agencies = await getAgencies()

    if (!property) {
        notFound()
    }

    const typology = typologies.find(t => t.id === property.typologyId)

    return (
        <div className="bg-white py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-8">
                    <Link href="/properties" className="text-sm font-semibold leading-6 text-primary hover:text-gray-600 flex items-center gap-2 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Volver al listado
                    </Link>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
                    {/* Left Column: Images & Content (Span 7 or 8) */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-12">
                        {/* Main Image / Gallery */}
                        <PropertyGallery
                            images={property.images}
                            title={`Unidad ${property.unitNumber} - ${typology?.name}`}
                        />

                        {/* Description & Details */}
                        <div className="border-t border-gray-100 pt-10">
                            <h2 className="text-2xl font-bold tracking-tight text-primary">Descripción</h2>
                            <p className="mt-6 text-base leading-8 text-gray-600">
                                Disfruta de la excelencia en diseño y confort. Esta unidad {typology?.name?.toLowerCase()} en el piso {property.floor} ofrece
                                una distribución inteligente y acabados de primera calidad. Ideal para quienes buscan
                                invertir en una ubicación privilegiada con todas las comodidades.
                            </p>
                        </div>

                        {/* Specs Grid */}
                        <div className="border-t border-gray-100 pt-10">
                            <h2 className="text-2xl font-bold tracking-tight text-primary mb-6">Características</h2>
                            <dl className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-3">
                                <div className="flex flex-col gap-1 rounded-xl bg-gray-50 p-4">
                                    <dt className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                        <Ruler className="h-5 w-5 text-accent" /> Superficie
                                    </dt>
                                    <dd className="text-lg font-bold text-primary">{property.area} m²</dd>
                                </div>
                                <div className="flex flex-col gap-1 rounded-xl bg-gray-50 p-4">
                                    <dt className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                        <BedDouble className="h-5 w-5 text-accent" /> Tipología
                                    </dt>
                                    <dd className="text-lg font-bold text-primary">{typology?.name}</dd>
                                </div>
                                {/* Removed Entrega section as per request (Desarrollo al pozo) */}
                            </dl>
                        </div>
                    </div>

                    {/* Right Column: Sticky Sidebar (Span 5 or 4) */}
                    <div className="lg:col-span-5 xl:col-span-4 mt-10 lg:mt-0">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            {/* Title Section (Desktop) */}
                            <div>
                                <p className="text-sm font-bold text-accent tracking-wider uppercase">Unidad {property.unitNumber}</p>
                                <h1 className="mt-1 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                                    {typology?.name || 'Departamento Exclusivo'}
                                </h1>
                            </div>



                            {/* Conversion Card */}
                            <div className="rounded-2xl bg-slate-900 p-8 shadow-2xl ring-1 ring-white/10">
                                <h3 className="text-base font-semibold leading-7 text-accent/90">Valor de Inversión</h3>
                                <div className="mt-4 flex items-baseline gap-x-2">
                                    <span className="text-4xl font-bold tracking-tight text-white">
                                        USD {property.price.toLocaleString('es-AR')}
                                    </span>
                                </div>
                                <p className="mt-4 text-sm leading-6 text-gray-300">
                                    Financiación propia a medida.
                                </p>

                                {/* Calculator Component */}
                                <InvestmentCalculator
                                    price={property.price}
                                    propertyTitle={`Unidad ${property.unitNumber}`}
                                    typologyName={typology?.name || ''}
                                    disposition={property.disposition || 'front'}
                                />

                                <div className="mt-8 flex flex-col gap-3">
                                    <p className="text-sm font-medium text-gray-400 mb-1">Contactar Comercializadora:</p>
                                    {agencies.length > 0 ? (
                                        agencies.map((agency, index) => {
                                            const message = `Hola, estoy interesado en la Unidad ${property.unitNumber} de Torre Eden, vi la ficha en la web.`
                                            const waLink = `https://wa.me/${agency.phone}?text=${encodeURIComponent(message)}`

                                            // Muted WhatsApp-like green style
                                            return (
                                                <Link
                                                    key={agency.id}
                                                    href={waLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 px-4 py-3.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 hover:scale-[1.01] transition-all tracking-wide group"
                                                >
                                                    <MessageCircle className="h-5 w-5 text-white/90 group-hover:scale-110 transition-transform" />
                                                    Contactar a {agency.name}
                                                </Link>
                                            )
                                        })
                                    ) : (
                                        <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-sm">
                                            Consultas directas próximamente
                                        </div>
                                    )}
                                </div>
                                <p className="mt-6 text-center text-xs text-gray-500">
                                    Ref: {property.id} • EDEN Corrientes
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
