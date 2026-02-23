'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'
import Image from 'next/image'

interface GalleryImage {
    url: string
    caption?: string
}

export function ProjectGallery({ images }: { images: GalleryImage[] }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const [isMaximized, setIsMaximized] = useState(false)

    useEffect(() => {
        if (!isAutoPlaying || images.length <= 1 || isMaximized) return
        const interval = setInterval(() => {
            nextSlide()
        }, 5000)
        return () => clearInterval(interval)
    }, [currentIndex, isAutoPlaying, images.length, isMaximized])

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    if (!images || images.length === 0) return null

    return (
        <>
            <div className="relative group max-w-6xl mx-auto px-4">
                <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-black shadow-2xl ring-1 ring-white/10">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            {/* Blurred Background to fill spaces */}
                            <Image
                                src={images[currentIndex].url}
                                alt="Background Blur"
                                fill
                                className="object-cover opacity-30 blur-2xl scale-110 pointer-events-none"
                            />

                            {/* Main Contain Image */}
                            <div className="relative w-full h-full p-4 sm:p-8 flex items-center justify-center">
                                <Image
                                    src={images[currentIndex].url}
                                    alt={images[currentIndex].caption || `Proyecto EDEN Render ${currentIndex + 1}`}
                                    fill
                                    className="object-contain drop-shadow-2xl"
                                    priority
                                />
                            </div>

                            {/* Overlay Gradient (Bottom) */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <button
                            onClick={(e) => { e.stopPropagation(); prevSlide(); setIsAutoPlaying(false); }}
                            className="p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/40 transition-all pointer-events-auto shadow-lg"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); nextSlide(); setIsAutoPlaying(false); }}
                            className="p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/40 transition-all pointer-events-auto shadow-lg"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => { setCurrentIndex(i); setIsAutoPlaying(false); }}
                                className={`h-1.5 transition-all rounded-full ${i === currentIndex ? 'w-8 bg-accent' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                            />
                        ))}
                    </div>

                    {/* Top Controls: Counter & Maximize */}
                    <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20 pointer-events-none">
                        <div className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold tracking-widest shadow-lg">
                            {currentIndex + 1} / {images.length}
                        </div>

                        <button
                            onClick={() => setIsMaximized(true)}
                            className="group/max p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-accent hover:text-white transition-all pointer-events-auto shadow-lg flex items-center gap-2"
                        >
                            <Maximize2 className="h-5 w-5" />
                            <span className="max-w-0 overflow-hidden group-hover/max:max-w-xs transition-all duration-300 text-[11px] font-bold uppercase tracking-wider pr-0 group-hover/max:pr-2">Ampliar</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Fullscreen Lightbox Modal */}
            <AnimatePresence>
                {isMaximized && (
                    <motion.div
                        key="lightbox-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-12"
                    >
                        <button
                            onClick={() => setIsMaximized(false)}
                            className="absolute top-8 right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all z-50 border border-white/10"
                        >
                            <X className="h-8 w-8" />
                        </button>

                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* Lightbox Navigation */}
                            <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none px-0 sm:px-8">
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                    className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all pointer-events-auto"
                                >
                                    <ChevronLeft className="h-10 w-10" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                    className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all pointer-events-auto"
                                >
                                    <ChevronRight className="h-10 w-10" />
                                </button>
                            </div>

                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="relative w-full h-full"
                            >
                                <Image
                                    src={images[currentIndex].url}
                                    alt="Full Size Render"
                                    fill
                                    className="object-contain"
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
