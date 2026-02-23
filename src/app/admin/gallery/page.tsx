'use client'

import { useState, useEffect } from 'react'
import { getGalleryImages, updateGallery, GalleryImage } from './actions'
import CloudinaryUploadWidget from '@/components/admin/CloudinaryUploadWidget'
import { Save, Loader2, Trash2, ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

export default function GalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        loadImages()
    }, [])

    async function loadImages() {
        setLoading(true)
        const data = await getGalleryImages()
        setImages(data)
        setLoading(false)
    }

    async function handleSave() {
        setSaving(true)
        try {
            await updateGallery(images)
            alert('Galería actualizada correctamente')
        } catch (error) {
            alert('Error al guardar la galería')
        }
        setSaving(false)
    }

    function removeImage(index: number) {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    function moveImage(index: number, direction: 'left' | 'right') {
        const newImages = [...images]
        const targetIndex = direction === 'left' ? index - 1 : index + 1

        if (targetIndex < 0 || targetIndex >= newImages.length) return

        const temp = newImages[index]
        newImages[index] = newImages[targetIndex]
        newImages[targetIndex] = temp
        setImages(newImages)
    }

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl flex items-center gap-3">
                        <ImageIcon className="h-8 w-8 text-accent" />
                        Galería de Renders y Proyecto
                    </h1>
                    <p className="text-gray-500 mt-1">Sube y organiza las imágenes que se verán en la sección "Proyecto" de la web.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Guardar Cambios
                </button>
            </div>

            <div className="bg-white rounded-2xl border p-8 shadow-sm">
                <div className="mb-8">
                    <CloudinaryUploadWidget
                        onUpload={(result: any) => {
                            if (result.event === 'success') {
                                setImages(prev => [...prev, { url: result.info.secure_url }])
                            }
                        }}
                    />
                </div>

                {images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl border-gray-100 bg-gray-50/50">
                        <ImageIcon className="h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No hay imágenes en la galería</p>
                        <p className="text-gray-400 text-sm">Sube renders para que aparezcan en el carrusel público.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {images.map((img, index) => (
                            <div key={index} className="group relative aspect-video rounded-xl overflow-hidden border bg-gray-100 ring-1 ring-gray-200 transition-all hover:ring-accent shadow-sm">
                                <Image
                                    src={img.url}
                                    alt={`Render ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                />

                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                                    <div className="flex justify-end gap-2 text-white">
                                        <button
                                            onClick={() => moveImage(index, 'left')}
                                            disabled={index === 0}
                                            className="p-2 rounded-lg bg-white/20 hover:bg-white/40 disabled:opacity-0 transition-all"
                                            title="Mover a la izquierda"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => moveImage(index, 'right')}
                                            disabled={index === images.length - 1}
                                            className="p-2 rounded-lg bg-white/20 hover:bg-white/40 disabled:opacity-0 transition-all"
                                            title="Mover a la derecha"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeImage(index)}
                                        className="w-full inline-flex items-center justify-center rounded-lg bg-red-600/90 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition-colors gap-2 backdrop-blur-sm shadow-lg"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Eliminar Render
                                    </button>
                                </div>

                                <div className="absolute top-2 left-2 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-md text-xs font-bold text-primary shadow-sm border border-gray-100">
                                    #{index + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
