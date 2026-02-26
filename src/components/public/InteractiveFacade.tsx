'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import mapping from '@/lib/facade-mapping.json'
import { Property } from '@/app/admin/properties/actions'
import { formatCurrency } from '@/lib/utils'

interface InteractiveFacadeProps {
    properties: Property[]
}

export default function InteractiveFacade({ properties }: InteractiveFacadeProps) {
    const [viewId, setViewId] = useState('front')
    const [hoveredUnit, setHoveredUnit] = useState<string | null>(null)
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

    const currentView = mapping.views.find(v => v.id === viewId) || mapping.views[0]

    // Create a map for fast property lookup
    const propertiesMap = useMemo(() => {
        const map = new Map<string, Property>()
        properties.forEach(p => {
            // Normalize unit number (trim spaces, uppercase) to ensure matching
            // JSON: "6 A" -> DB: "6A" or "6 A". We try to match robustly.
            const key = p.unitNumber.replace(/\s/g, '').toUpperCase()
            map.set(key, p)
        })
        return map
    }, [properties])

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'available': return 'rgba(34, 197, 94, 0.4)' // Green
            case 'reserved': return 'rgba(234, 179, 8, 0.4)' // Yellow
            case 'sold': return 'rgba(239, 68, 68, 0.4)' // Red
            default: return 'rgba(156, 163, 175, 0.4)' // Gray (Not listed)
        }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        setTooltipPos({ x: e.clientX, y: e.clientY })
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            {/* View Selector (Future-proofing for multiple views) */}
            <div className="flex justify-center gap-4 mb-6">
                {mapping.views.map(view => (
                    <button
                        key={view.id}
                        onClick={() => setViewId(view.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${viewId === view.id
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {view.name}
                    </button>
                ))}
            </div>

            <div className="relative inline-block w-full shadow-2xl rounded-xl overflow-hidden bg-gray-50">
                {/* Image Container */}
                <div
                    className="relative w-full"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setHoveredUnit(null)}
                >
                    <img
                        src={currentView.imageUrl}
                        alt={currentView.name}
                        className="w-full h-auto block select-none"
                        draggable={false}
                    />

                    {/* SVG Overlay */}
                    <svg
                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        {currentView.polygons.map((poly, i) => {
                            // Try to find the matching property
                            // We normalize the JSON unit as well to match the Map key
                            const lookupKey = poly.unit.replace(/\s/g, '').toUpperCase()
                            const property = propertiesMap.get(lookupKey)
                            const isHovered = hoveredUnit === poly.unit

                            return (
                                <polygon
                                    key={i}
                                    points={poly.points}
                                    fill={getStatusColor(property?.status)}
                                    fillOpacity={isHovered ? 0.7 : 0.0} // Invisible unless hovered or special mode? 
                                    // Actually, we probably want to show availability always OR only on hover.
                                    // Let's show a subtle tint always, and strong on hover.
                                    className="cursor-pointer transition-all duration-300 pointer-events-auto"
                                    stroke={isHovered ? "white" : "transparent"}
                                    strokeWidth="0.5"
                                    onMouseEnter={() => setHoveredUnit(poly.unit)}
                                // onClick={() => property && router.push(`/properties/${property.id}`)}
                                />
                            )
                        })}
                    </svg>
                </div>

                {/* Tooltip */}
                <AnimatePresence>
                    {hoveredUnit && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            style={{
                                top: tooltipPos.y + 20, // Offset to avoid cursor
                                left: tooltipPos.x,
                                position: 'fixed', // Fixed to screen for smoother follow
                                zIndex: 50
                            }}
                            className="bg-white p-4 rounded-lg shadow-xl border border-gray-100 min-w-[200px] pointer-events-none transform -translate-x-1/2"
                        >
                            {(() => {
                                const lookupKey = hoveredUnit.replace(/\s/g, '').toUpperCase()
                                const property = propertiesMap.get(lookupKey)

                                if (!property) return (
                                    <div className="text-gray-500 text-sm">
                                        <p className="font-bold">Unidad {hoveredUnit}</p>
                                        <p>No listada</p>
                                    </div>
                                )

                                return (
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-gray-900">Unidad {property.unitNumber}</h3>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${property.status === 'available' ? 'bg-green-100 text-green-700' :
                                                property.status === 'reserved' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {property.status === 'available' ? 'Disponible' :
                                                    property.status === 'reserved' ? 'Reservado' : 'Vendido'}
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p>Piso {property.floor}</p>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mt-2">Valor de Contado</p>
                                            <p className="text-primary font-bold text-lg">
                                                {formatCurrency(property.price)}
                                            </p>
                                            {property.area > 0 && <p>{property.area} m²</p>}
                                        </div>
                                    </div>
                                )
                            })()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm text-gray-500">
                <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 opacity-50"></div>
                    <span>Disponible</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-50"></div>
                    <span>Reservado</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 opacity-50"></div>
                    <span>Vendido</span>
                </div>
            </div>
        </div>
    )
}
