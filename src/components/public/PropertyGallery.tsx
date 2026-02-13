'use client'

import { useState } from 'react'
import { CldImage } from 'next-cloudinary'
import { cn } from '@/lib/utils'

interface PropertyGalleryProps {
    images?: {
        url: string
        publicId: string
    }[]
    title: string
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                <span className="text-lg font-medium">Sin Imágenes</span>
            </div>
        )
    }

    const currentImage = images[selectedIndex]

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm border border-gray-100">
                {currentImage.publicId ? (
                    <CldImage
                        src={currentImage.publicId}
                        alt={`${title} - Imagen ${selectedIndex + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 800px"
                        priority={selectedIndex === 0}
                        format="auto"
                        quality="auto"
                    />
                ) : (
                    <img
                        src={currentImage.url}
                        alt={`${title} - Imagen ${selectedIndex + 1}`}
                        className="h-full w-full object-cover"
                    />
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedIndex(idx)}
                            className={cn(
                                "relative aspect-square overflow-hidden rounded-lg bg-gray-50 border-2 transition-all",
                                selectedIndex === idx ? "border-accent ring-2 ring-accent/20" : "border-transparent hover:border-gray-300 opacity-70 hover:opacity-100"
                            )}
                        >
                            {img.publicId ? (
                                <CldImage
                                    src={img.publicId}
                                    alt={`Thumbnail ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="100px"
                                    format="auto"
                                    quality="auto"
                                />
                            ) : (
                                <img
                                    src={img.url}
                                    alt={`Thumbnail ${idx + 1}`}
                                    className="h-full w-full object-cover"
                                />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
