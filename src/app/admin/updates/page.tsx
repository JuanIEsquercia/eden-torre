'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Youtube, Calendar, FileText } from 'lucide-react'
import { getUpdates, createUpdate, deleteUpdate, type ProjectUpdate } from './actions'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function UpdatesPage() {
    const [updates, setUpdates] = useState<ProjectUpdate[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        videoUrl: ''
    })

    useEffect(() => {
        loadUpdates()
    }, [])

    const loadUpdates = async () => {
        setIsLoading(true)
        const data = await getUpdates()
        setUpdates(data)
        setIsLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const res = await createUpdate(formData)
            if (res.success) {
                setIsFormOpen(false)
                setFormData({
                    title: '',
                    date: new Date().toISOString().split('T')[0],
                    description: '',
                    videoUrl: ''
                })
                loadUpdates()
            } else {
                alert('Error al crear: ' + res.error)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Seguro que quieres eliminar este avance?')) return

        const res = await deleteUpdate(id)
        if (res.success) {
            loadUpdates()
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Avance de Obra</h1>
                    <p className="text-gray-500">Gestiona las novedades y videos del proyecto.</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                >
                    <Plus className="h-4 w-4" />
                    Nuevo Avance
                </button>
            </div>

            {/* Form Modal */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-lg font-bold">Nuevo Avance</h2>
                                <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                                        placeholder="Ej: Losa Piso 3 Finalizada"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                                        <input
                                            required
                                            type="date"
                                            value={formData.date}
                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Link YouTube</label>
                                        <input
                                            required
                                            type="url"
                                            value={formData.videoUrl}
                                            onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                                            placeholder="https://youtu.be/..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                                        placeholder="Detalles sobre el avance..."
                                    />
                                </div>

                                <div className="pt-4 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsFormOpen(false)}
                                        className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 text-sm bg-black text-white hover:bg-gray-800 rounded-md disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Guardando...' : 'Guardar Avance'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Updates List */}
            {isLoading ? (
                <div className="text-center py-10">Cargando...</div>
            ) : updates.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500">No hay avances cargados aún.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {updates.map(update => (
                        <div key={update.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            {/* Video Preview */}
                            <div className="aspect-video bg-gray-100 relative group">
                                {update.youtubeId ? (
                                    <img
                                        src={`https://img.youtube.com/vi/${update.youtubeId}/hqdefault.jpg`}
                                        alt={update.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        <Youtube className="w-8 h-8" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                            </div>

                            <div className="p-4">
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(update.date).toLocaleDateString()}
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">{update.title}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{update.description}</p>

                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                                    <button
                                        onClick={() => handleDelete(update.id)}
                                        className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                                    >
                                        <Trash2 className="w-4 h-4" /> Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
