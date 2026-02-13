'use client'

import Link from 'next/link'
import { Ruler, BedDouble, Bath, ArrowUpRight } from 'lucide-react'
import { Property } from '@/app/admin/properties/actions'
import { CldImage } from 'next-cloudinary'
import { Typology } from '@/app/admin/typologies/actions'
import { cn } from '@/lib/utils'

interface PropertyCardProps {
    property: Property
    typology?: Typology
}

export function PropertyCard({ property, typology }: PropertyCardProps) {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-xl hover:ring-gray-900/10">
            {/* Image Section */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                {property.images && property.images.length > 0 ? (
                    property.images[0].publicId ? (
                        <CldImage
                            src={property.images[0].publicId}
                            alt={`Unidad ${property.unitNumber}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            format="auto"
                            quality="auto"
                        />
                    ) : (
                        <img
                            src={property.images[0].url}
                            alt={`Unidad ${property.unitNumber}`}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    )
                ) : (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            <span className="text-sm font-medium tracking-wider uppercase opacity-50">Vista Previa</span>
                        </div>
                    </>
                )}

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                    <span className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium backdrop-blur-md shadow-sm",
                        property.status === 'available' ? "bg-white/90 text-green-700" :
                            property.status === 'reserved' ? "bg-white/90 text-yellow-700" :
                                "bg-white/90 text-red-700"
                    )}>
                        {property.status === 'available' ? 'Disponible' : property.status === 'reserved' ? 'Reservado' : 'Vendido'}
                    </span>
                </div>

                {/* Price Tag (Floating) */}
                <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="rounded-lg bg-gray-900/90 px-3 py-1.5 text-sm font-semibold text-white shadow-lg backdrop-blur-sm">
                        USD {property.price.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-1 flex-col p-6">
                <div className="mb-4">
                    <p className="text-xs font-medium text-accent uppercase tracking-widest">{typology?.name || 'Departamento'}</p>
                    <h3 className="mt-2 text-xl font-bold tracking-tight text-gray-900 group-hover:text-gray-600 transition-colors">
                        <Link href={`/properties/${property.id}`}>
                            <span className="absolute inset-0" />
                            Unidad {property.unitNumber}
                        </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">Piso {property.floor} • Disposición Frente</p>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-600">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5" title="Superficie Total">
                            <Ruler className="h-4 w-4 text-gray-400" />
                            <span>{property.area} m²</span>
                        </div>
                        <div className="flex items-center gap-1.5" title="Dormitorios">
                            <BedDouble className="h-4 w-4 text-gray-400" />
                            <span>{typology?.name?.toLowerCase().includes('mono') ? 'Mono' : typology?.name?.match(/\d+/)?.[0] || '-'}</span>
                        </div>

                    </div>

                    <ArrowUpRight className="h-5 w-5 text-gray-300 transition-colors group-hover:text-accent" />
                </div>
            </div>
        </div>
    )
}
