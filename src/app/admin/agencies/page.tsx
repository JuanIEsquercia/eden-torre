'use client';

import { useState, useEffect } from 'react';
import { getAgencies, createAgency, deleteAgency, type Agency } from './actions';
import { Trash2, ExternalLink, Plus, Loader2, X } from 'lucide-react';
import CloudinaryUploadWidget from '@/components/admin/CloudinaryUploadWidget';
import Link from 'next/link';

export default function AgenciesPage() {
    const [agencies, setAgencies] = useState<Agency[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    // const [logoPublicId, setLogoPublicId] = useState(''); // Not strictly needed for creation if backend doesn't expect it, but better to support deletion later

    // We can extract public_id from result too if your createAgency expects it.
    // Assuming createAgency expects { name, phone, logoUrl, logoPublicId? } based on previous actions.ts update.
    const [logoPublicId, setLogoPublicId] = useState('');

    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadAgencies();
    }, []);

    const loadAgencies = async () => {
        setLoading(true);
        const data = await getAgencies();
        setAgencies(data);
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
        if (!name || !phone || !logoUrl) {
            alert("Por favor complete todos los campos e imagen.");
            return;
        }

        setCreating(true);
        try {
            const payload = {
                name,
                phone,
                logoUrl,
                logoPublicId // Optional, but good practice if schema supports it
            };

            const result = await createAgency(payload);

            if (result.success) {
                // Reset Form
                setName('');
                setPhone('');
                setLogoUrl('');
                setLogoPublicId('');
                loadAgencies();
            } else {
                alert("Error al guardar en base de datos. Ver consola para detalles.");
                console.error("Create error:", result.error);
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("Error desconocido al crear la agencia.");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar esta inmobiliaria?")) return;
        await deleteAgency(id);
        loadAgencies();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-primary">Inmobiliarias</h1>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Form Column */}
                <div className="lg:col-span-1">
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-medium flex items-center gap-2">
                            <Plus className="h-5 w-5" /> Nueva Inmobiliaria
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
                                    placeholder="Ej: Inmobiliaria X"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Número de WhatsApp (549...)</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} // Only numbers
                                    placeholder="5493794..."
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Ingrese solo números, sin espacios ni símbolos. El mensaje se agregará automáticamente.
                                </p>
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
                                        <CloudinaryUploadWidget onUpload={handleUpload} folder="eden_agencies" />
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
                                    'Agregar Inmobiliaria'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Column */}
                <div className="lg:col-span-2">
                    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                        <div className="border-b bg-gray-50/50 px-6 py-4">
                            <h2 className="text-lg font-medium text-gray-900">Listado de Aliados</h2>
                        </div>

                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Cargando...</div>
                        ) : agencies.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No hay inmobiliarias cargadas aún.
                            </div>
                        ) : (
                            <ul role="list" className="divide-y divide-gray-100">
                                {agencies.map((agency) => (
                                    <li key={agency.id} className="flex items-center justify-between gap-x-6 px-6 py-5 hover:bg-gray-50 transition-colors">
                                        <div className="flex min-w-0 gap-x-4">
                                            <div className="h-16 w-24 flex-none rounded-lg bg-gray-100 border border-gray-200 object-contain flex items-center justify-center overflow-hidden bg-white p-1">
                                                <img
                                                    src={agency.logoUrl}
                                                    alt={agency.name}
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-auto self-center">
                                                <p className="text-sm font-semibold leading-6 text-gray-900">{agency.name}</p>
                                                <a
                                                    href={`https://wa.me/${agency.phone}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-1 truncate text-xs leading-5 text-gray-500 hover:text-primary flex items-center gap-1"
                                                >
                                                    {agency.phone} <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex flex-none items-center gap-x-4">
                                            <button
                                                onClick={() => handleDelete(agency.id)}
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
