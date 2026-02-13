'use client'

import { CldImage } from 'next-cloudinary'
import { useState, useEffect } from 'react'

interface BrandLogoProps {
    src: string
    alt: string
}

export function BrandLogo({ src, alt }: BrandLogoProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="h-12 w-32 bg-gray-100 animate-pulse rounded" />
    }

    if (src.includes('cloudinary')) {
        return (
            <CldImage
                width="600"
                height="300"
                src={src}
                alt={alt}
                className="max-h-40 w-full object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                format="auto"
                quality="auto"
            />
        )
    }

    return (
        <img
            src={src}
            alt={alt}
            className="max-h-40 w-full object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
        />
    )
}
