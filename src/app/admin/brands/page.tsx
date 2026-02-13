'use client';

import { useState, useEffect } from 'react';
import { getBrands, createBrand, deleteBrand, type Brand } from './actions';
import { Trash2, ExternalLink, Plus, Loader2, X } from 'lucide-react';
import CloudinaryUploadWidget from '@/components/admin/CloudinaryUploadWidget';

export default function BrandsPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [name, setName] = useState('');
    const [website, setWebsite] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [logoPublicId, setLogoPublicId] = useState('');

    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadBrands();
    }, []);

    const loadBrands = async () => {
        setLoading(true);
        const data = await getBrands();
        setBrands(data);
        setLoading(false);
    };

    const handleUpload = (result: any) => {
        if (result.info) {
            setLogoUrl(result.info.secure_url);
            setLogoPublicId(result.info.public_id);
        }
    };

    const handleRemoveLogo = () => {
        setLogoUrl('');
        setLogoPublicId('');
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !logoUrl) {
            alert("El nombre y el logo son obligatorios.");
            return;
        }

        setCreating(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('logoUrl', logoUrl);
            if (logoPublicId) formData.append('logoPublicId', logoPublicId);
            if (website) formData.append('website', website);

            const result = await createBrand(formData);

            if (result.success) {
                // Reset Form
                setName('');
                setWebsite('');
                setLogoUrl('');
                setLogoPublicId('');
                loadBrands();
            } else {
                alert("Error al guardar en base de datos.");
                console.error("Create error:", result.error);
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("Error desconocido al crear la marca.");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar esta marca?")) return;
        await deleteBrand(id);
        loadBrands();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-primary">Marcas y Partners</h1>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Form Column */}
                <div className="lg:col-span-1">
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-medium flex items-center gap-2">
                            <Plus className="h-5 w-5" /> Nueva Marca
                        </h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ej: Empresa Constructora"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sitio Web (Opcional)</label>
                                <input
                                    type="url"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                                {logoUrl ? (
                                    <div className="relative w-full h-32 border rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
                                        <img src={logoUrl} alt="Logo Preview" className="h-full object-contain" />
                                        <button
                                            type="button"
                                            onClick={handleRemoveLogo}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full">
                                        <CloudinaryUploadWidget onUpload={handleUpload} folder="eden_brands" />
                                        <p className="mt-2 text-xs text-gray-500">Subir logo (PNG/JPG)</p>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={creating}
                                className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {creating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                                    </>
                                ) : (
                                    'Agregar Marca'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Column */}
                <div className="lg:col-span-2">
                    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                        <div className="border-b bg-gray-50/50 px-6 py-4">
                            <h2 className="text-lg font-medium text-gray-900">Listado de Marcas</h2>
                        </div>

                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Cargando...</div>
                        ) : brands.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No hay marcas cargadas aún.
                            </div>
                        ) : (
                            <ul role="list" className="divide-y divide-gray-100">
                                {brands.map((brand) => (
                                    <li key={brand.id} className="flex items-center justify-between gap-x-6 px-6 py-5 hover:bg-gray-50 transition-colors">
                                        <div className="flex min-w-0 gap-x-4">
                                            <div className="h-16 w-24 flex-none rounded-lg bg-gray-100 border border-gray-200 object-contain flex items-center justify-center overflow-hidden bg-white p-1">
                                                <img
                                                    src={brand.logoUrl}
                                                    alt={brand.name}
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-auto self-center">
                                                <p className="text-sm font-semibold leading-6 text-gray-900">{brand.name}</p>
                                                {brand.website && (
                                                    <a
                                                        href={brand.website}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-1 truncate text-xs leading-5 text-gray-500 hover:text-primary flex items-center gap-1"
                                                    >
                                                        {brand.website} <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-none items-center gap-x-4">
                                            <button
                                                onClick={() => handleDelete(brand.id)}
                                                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-50 hover:text-red-600 hover:ring-red-200 transition-all"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                                <span className="sr-only">Eliminar</span>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
