'use client'

import { AgencyLogo } from './AgencyLogo'

interface Agency {
    id: string
    name: string
    logoUrl: string
    phone: string
}

const DEFAULT_WHATSAPP_MESSAGE = "Hola, vi el desarrollo de Torre Eden en su web y me interesa tener más información para inversión."

export function AgenciesMarquee({ agencies }: { agencies: Agency[] }) {
    // Only marquee if enough items, otherwise center?
    // User wants "automatically... solo como un sin fin".
    // Even if few items, duplicating them allows the loop.

    // Duplicate the list to ensure seamless scrolling
    // If few items (<6), maybe duplicate 4 times to fill width?
    // Let's ensure enough items for a smooth scroll.
    const repeatedAgencies = agencies.length < 5
        ? [...agencies, ...agencies, ...agencies, ...agencies]
        : [...agencies, ...agencies]

    return (
        <div className="relative w-full overflow-hidden mask-fade">
            {/* Gradient Masks for smooth fade out at edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div className="flex w-max animate-marquee items-center">
                {repeatedAgencies.map((agency, index) => {
                    const waLink = `https://wa.me/${agency.phone}?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`
                    const uniqueKey = `${agency.id}-${index}`

                    return (
                        <div key={uniqueKey} className="flex-shrink-0 px-8">
                            <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative group block flex items-center justify-center p-4 transition-all duration-300 hover:scale-105 opacity-60 hover:opacity-100 grayscale hover:grayscale-0"
                            >
                                <div className="h-16 w-auto flex items-center">
                                    <AgencyLogo
                                        src={agency.logoUrl}
                                        alt={agency.name}
                                        className="max-h-16 w-auto object-contain"
                                    />
                                </div>
                            </a>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
