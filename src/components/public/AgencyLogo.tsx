'use client'

import { CldImage } from 'next-cloudinary'

interface AgencyLogoProps {
    src: string
    alt: string
}

export function AgencyLogo({ src, alt }: AgencyLogoProps) {
    return (
        <CldImage
            width="160"
            height="80"
            src={src}
            alt={alt}
            className="object-contain max-h-24 grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
            format="auto"
            quality="auto"
        />
    )
}
