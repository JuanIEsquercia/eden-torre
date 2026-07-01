import { getProperties } from './actions'
import { getTypologies } from '../typologies/actions'
import { Pencil, Plus } from 'lucide-react'
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
    const isNew = searchParams?.new === 'true';
    const showModal = isNew || !!editingProperty;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-primary">Propiedades</h1>
                    <p className="text-xs text-slate-400 font-semibold mt-1 uppercase tracking-wider">
                        {properties.length} propiedad{properties.length !== 1 ? 'es' : ''} cargada{properties.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <Link
                    href="/admin/properties?new=true"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/95 transition-all shadow-sm border border-white/5 active:scale-95 hover:shadow-gold-hover duration-250 cursor-pointer"
                >
                    <Plus className="h-3.5 w-3.5" />
                    Nueva propiedad
                </Link>
            </div>

            {/* Create/Edit Form Modal */}
            {showModal && (
                <PropertyForm typologies={typologies} initialData={editingProperty} />
            )}

            {/* List */}
            <div className="rounded-2xl border border-slate-200/70 bg-white shadow-premium overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-500">
                        <thead className="bg-slate-50/75 border-b border-slate-100 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            <tr>
                                <th scope="col" className="px-6 py-4">Unidad</th>
                                <th scope="col" className="px-6 py-4">Tipología</th>
                                <th scope="col" className="px-6 py-4">Estado</th>
                                <th scope="col" className="px-6 py-4">Precio</th>
                                <th scope="col" className="px-6 py-4">Área</th>
                                <th scope="col" className="px-6 py-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-150">
                            {properties.map((property) => {
                                const typologyName = typologies.find(t => t.id === property.typologyId)?.name || 'Desconocida'
                                return (
                                    <tr key={property.id} className="hover:bg-slate-50/45 transition-colors duration-150">
                                        <td className="px-6 py-4 font-bold text-slate-900">{property.unitNumber}</td>
                                        <td className="px-6 py-4 font-medium text-slate-600">{typologyName}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold border",
                                                property.status === 'available' 
                                                    ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                                                    : property.status === 'reserved' 
                                                        ? "bg-amber-50 border-amber-100 text-amber-700" 
                                                        : "bg-slate-50 border-slate-200/60 text-slate-500"
                                            )}>
                                                <span className={cn(
                                                    "h-1.5 w-1.5 rounded-full",
                                                    property.status === 'available' ? "bg-emerald-500" :
                                                        property.status === 'reserved' ? "bg-amber-500" :
                                                            "bg-slate-400"
                                                )} />
                                                {property.status === 'available' ? 'Disponible' : property.status === 'reserved' ? 'Reservado' : 'Vendido'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-900">
                                            ${property.price.toLocaleString('es-AR')}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-650">{property.area} m²</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/properties?edit=${property.id}`}
                                                    scroll={false} // Prevent scrolling to top
                                                    className="inline-flex items-center justify-center rounded-lg border border-slate-250/70 p-2 text-slate-700 bg-white hover:bg-slate-50 shadow-sm transition-all duration-200 cursor-pointer"
                                                    title="Editar"
                                                >
                                                    <Pencil className="h-4 w-4 text-slate-500" />
                                                </Link>
                                                <DeletePropertyButton id={property.id} />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {properties.length === 0 && (
                        <div className="px-6 py-12 text-center text-sm text-slate-400 font-medium bg-white">
                            No hay propiedades cargadas aún.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
