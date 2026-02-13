import { getProperties } from './actions'
import { getTypologies } from '../typologies/actions'
import { Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import PropertyForm from './PropertyForm'
import Link from 'next/link'
import DeletePropertyButton from './DeletePropertyButton'

export default async function PropertiesPage(props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;
    const properties = await getProperties()
    const typologies = await getTypologies()

    const editId = searchParams?.edit as string;
    const editingProperty = editId ? properties.find(p => p.id === editId) : null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-primary">Propiedades</h1>
            </div>

            {/* Create/Edit Form */}
            <PropertyForm typologies={typologies} initialData={editingProperty} />

            {/* List */}
            <div className="rounded-lg border bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">Unidad</th>
                                <th scope="col" className="px-6 py-3">Tipología</th>
                                <th scope="col" className="px-6 py-3">Estado</th>
                                <th scope="col" className="px-6 py-3">Precio</th>
                                <th scope="col" className="px-6 py-3">Area</th>
                                <th scope="col" className="px-6 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {properties.map((property) => {
                                const typologyName = typologies.find(t => t.id === property.typologyId)?.name || 'Desconocida'
                                return (
                                    <tr key={property.id} className="border-b bg-white hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{property.unitNumber}</td>
                                        <td className="px-6 py-4">{typologyName}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                                property.status === 'available' ? "bg-green-100 text-green-800" :
                                                    property.status === 'reserved' ? "bg-yellow-100 text-yellow-800" :
                                                        "bg-red-100 text-red-800"
                                            )}>
                                                {property.status === 'available' ? 'Disponible' : property.status === 'reserved' ? 'Reservado' : 'Vendido'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">${property.price.toLocaleString()}</td>
                                        <td className="px-6 py-4">{property.area} m²</td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <Link
                                                href={`/admin/properties?edit=${property.id}`}
                                                scroll={false} // Prevent scrolling to top
                                                className="text-blue-600 hover:text-blue-900 p-1"
                                                title="Editar"
                                            >
                                                <Pencil className="h-5 w-5" />
                                            </Link>
                                            <DeletePropertyButton id={property.id} />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {properties.length === 0 && (
                        <div className="px-6 py-8 text-center text-sm text-gray-500">
                            No hay propiedades cargadas aún.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
