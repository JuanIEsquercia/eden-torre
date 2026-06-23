'use client';

import { useState, useEffect } from 'react';
import { createProperty, updateProperty, Property } from './actions';
import CloudinaryUploadWidget from '@/components/admin/CloudinaryUploadWidget';
import { Typology } from '../typologies/actions';
import { Plus, Loader2, X, Save, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface PropertyFormProps {
    typologies: any[];
    initialData?: Property | null;
}

export default function PropertyForm({ typologies, initialData }: PropertyFormProps) {
    const router = useRouter();
    const [images, setImages] = useState<{ url: string; publicId: string }[]>([]);
    const [loading, setLoading] = useState(false);

    // Effect to update images when initialData changes (e.g. user clicks edit on different row)
    useEffect(() => {
        if (initialData) {
            setImages(initialData.images || []);
        } else {
            setImages([]);
        }
    }, [initialData]);

    const handleUpload = (result: any) => {
        if (result.info) {
            const newImage = {
                url: result.info.secure_url,
                publicId: result.info.public_id,
            };
            setImages((prev) => {
                const exists = prev.some((img) => img.publicId === newImage.publicId);
                if (exists) return prev;
                return [...prev, newImage];
            });
        }
    };

    const removeImage = (publicId: string) => {
        setImages((prev) => prev.filter((img) => img.publicId !== publicId));
    };

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        // Append images as JSON string
        formData.append('images', JSON.stringify(images));

        let result;
        if (initialData) {
            formData.append('id', initialData.id);
            result = await updateProperty(formData);
        } else {
            result = await createProperty(formData);
        }

        if (result?.error) {
            alert(result.error);
        } else {
            // Reset form
            const form = document.querySelector('form') as HTMLFormElement;
            form?.reset();
            setImages([]);
            router.push('/admin/properties'); // Close modal by clearing searchParams
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            {/* Backdrop click to close */}
            <div 
                className="absolute inset-0 cursor-default" 
                onClick={() => router.push('/admin/properties')} 
            />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border bg-white p-6 shadow-xl z-10"
            >
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-primary">
                        {initialData ? 'Editar Propiedad' : 'Nueva Propiedad'}
                    </h2>
                    <button
                        type="button"
                        onClick={() => router.push('/admin/properties')}
                        className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form action={handleSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Hidden ID input not strictly needed as we append to formData manually, but good for semantics if we used pure server actions */}
                {initialData && <input type="hidden" name="id" value={initialData.id} />}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Unidad (Ej: 1A)</label>
                    <input type="text" name="unitNumber" defaultValue={initialData?.unitNumber} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipología</label>
                    <select name="typologyId" defaultValue={initialData?.typologyId} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm">
                        <option value="">Seleccionar...</option>
                        {typologies.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Piso</label>
                    <input type="number" name="floor" defaultValue={initialData?.floor} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Precio (USD)</label>
                    <input type="number" name="price" defaultValue={initialData?.price} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Area (m²)</label>
                    <input type="number" name="area" step="0.01" defaultValue={initialData?.area} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <select name="status" defaultValue={initialData?.status || 'available'} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm">
                        <option value="available">Disponible</option>
                        <option value="reserved">Reservado</option>
                        <option value="sold">Vendido</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Disposición</label>
                    <select name="disposition" defaultValue={initialData?.disposition || 'front'} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm">
                        <option value="front">Frente</option>
                        <option value="back">Contrafrente</option>
                        <option value="lateral">Lateral / Interno</option>
                    </select>
                </div>

                {/* Image Upload Section */}
                <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes de la Propiedad</label>
                    <div className="mb-4 flex flex-wrap gap-4">
                        {images.map((img) => (
                            <div key={img.publicId} className="relative h-24 w-24 overflow-hidden rounded-md border border-gray-200">
                                <img src={img.url} alt="Propiedad" className="h-full w-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(img.publicId)}
                                    className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                        <CloudinaryUploadWidget onUpload={handleUpload} />
                    </div>
                </div>

                <div className="flex items-end md:col-span-2 lg:col-span-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (initialData ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />)}
                        {loading ? 'Guardando...' : (initialData ? 'Guardar Cambios' : 'Agregar Propiedad')}
                    </button>
                </div>
                </form>
            </motion.div>
        </div>
    );
}
