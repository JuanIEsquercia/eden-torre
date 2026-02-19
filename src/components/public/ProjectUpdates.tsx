'use client'

import { useState } from 'react'
import { Play, Calendar } from 'lucide-react'
import { ProjectUpdate } from '@/app/admin/updates/actions'
import { motion } from 'framer-motion'

export function ProjectUpdates({ updates }: { updates: ProjectUpdate[] }) {
    if (!updates || updates.length === 0) return null

    return (
        <section id="updates" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                        Avance de Obra
                    </h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        Seguí el paso a paso de la construcción de EDEN.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {updates.map((update, index) => (
                        <UpdateCard key={update.id} update={update} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function UpdateCard({ update, index }: { update: ProjectUpdate, index: number }) {
    const [isPlaying, setIsPlaying] = useState(false)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
        >
            {/* Video Area */}
            <div className="relative aspect-video bg-gray-900 overflow-hidden">
                {!isPlaying ? (
                    <button
                        onClick={() => setIsPlaying(true)}
                        className="absolute inset-0 w-full h-full flex items-center justify-center group/btn"
                        aria-label="Reproducir video"
                    >
                        {/* Thumbnail */}
                        <img
                            src={`https://img.youtube.com/vi/${update.youtubeId}/hqdefault.jpg`}
                            alt={update.title}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        />

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        <div className="relative z-10 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover/btn:scale-110 transition-transform">
                            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-lg">
                                <Play className="w-5 h-5 text-white ml-1 fill-white" />
                            </div>
                        </div>
                    </button>
                ) : (
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${update.youtubeId}?autoplay=1&rel=0`}
                        title={update.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                    />
                )}
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs font-medium text-accent mb-3">
                    <Calendar className="w-4 h-4" />
                    <time>{new Date(update.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {update.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line mb-4 flex-1">
                    {update.description}
                </p>
            </div>
        </motion.div>
    )
}
