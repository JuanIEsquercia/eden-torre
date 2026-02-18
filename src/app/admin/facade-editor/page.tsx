'use client'

import { useState, useRef, useEffect } from 'react'

/**
 * Editor de Fachada v2
 * Features:
 * - Coordenadas porcentuales (%)
 * - CLONAR formas (para mantener consistencia)
 * - ARRASTRAR formas (para ubicar copias rápidamente)
 */
export default function FacadeEditor() {
    // Current drawing points
    const [points, setPoints] = useState<{ x: number, y: number }[]>([])
    // Saved polygons
    const [polygons, setPolygons] = useState<{ unit: string, points: string }[]>([])

    // UI State
    const [currentUnit, setCurrentUnit] = useState('')
    const [dragState, setDragState] = useState<{ idx: number, startX: number, startY: number } | null>(null)

    const containerRef = useRef<HTMLDivElement>(null)

    // --- Helpers ---
    const getCoords = (e: React.MouseEvent | MouseEvent) => {
        if (!containerRef.current) return { x: 0, y: 0 }
        const rect = containerRef.current.getBoundingClientRect()
        return {
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100
        }
    }

    const parsePoints = (str: string) => {
        return str.split(' ').map(p => {
            const [x, y] = p.split(',')
            return { x: parseFloat(x), y: parseFloat(y) }
        })
    }

    const stringifyPoints = (pts: { x: number, y: number }[]) => {
        return pts.map(p => `${p.x.toFixed(4)},${p.y.toFixed(4)}`).join(' ')
    }

    // --- Handlers ---

    const handleMouseDown = (e: React.MouseEvent) => {
        // If clicking a polygon (handled by SVG event), ignore container click
        if ((e.target as Element).tagName === 'polygon') return

        if (dragState) return // Should not happen if mouse up works

        // Drawing Mode: Add point
        const coords = getCoords(e)
        setPoints([...points, coords])
    }

    const handlePolygonMouseDown = (e: React.MouseEvent, index: number) => {
        e.stopPropagation() // Prevent adding a point to "current drawing"
        const coords = getCoords(e)
        setDragState({ idx: index, startX: coords.x, startY: coords.y })
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!dragState) return

        const coords = getCoords(e)
        const dx = coords.x - dragState.startX
        const dy = coords.y - dragState.startY

        // Update the polygon being dragged immediately (UI feedback)
        const poly = polygons[dragState.idx]
        const pts = parsePoints(poly.points)
        const newPts = pts.map(p => ({ x: p.x + dx, y: p.y + dy }))

        const newPolygons = [...polygons]
        newPolygons[dragState.idx] = { ...poly, points: stringifyPoints(newPts) }
        setPolygons(newPolygons)

        // Update drag start for next frame (delta approach)
        setDragState({ idx: dragState.idx, startX: coords.x, startY: coords.y })
    }

    const handleMouseUp = () => {
        setDragState(null)
    }

    // Global mouse up to catch dragging outside container
    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp)
        return () => window.removeEventListener('mouseup', handleMouseUp)
    }, [])

    // --- Actions ---

    const savePolygon = () => {
        if (!currentUnit) return alert("Falta número de unidad")
        if (points.length < 3) return alert("Mínimo 3 puntos")

        setPolygons([...polygons, {
            unit: currentUnit,
            points: stringifyPoints(points)
        }])
        setPoints([])
        setCurrentUnit('')
    }

    const clonePolygon = (index: number) => {
        const poly = polygons[index]
        // Offset slightly so it's visible
        const pts = parsePoints(poly.points).map(p => ({ x: p.x + 2, y: p.y + 2 }))

        setPolygons([...polygons, {
            unit: `${poly.unit}_COPY`,
            points: stringifyPoints(pts)
        }])
    }

    return (
        <div className="flex h-screen flex-col md:flex-row overflow-hidden bg-gray-100">
            {/* Canvas Area */}
            <div
                className="flex-1 relative overflow-auto flex items-center justify-center p-8 select-none"
                onMouseMove={handleMouseMove}
            >
                <div
                    ref={containerRef}
                    className="relative shadow-2xl inline-block w-fit cursor-crosshair"
                    onMouseDown={handleMouseDown}
                >
                    <img
                        src="/building-facade.png"
                        alt="Fachada Base"
                        draggable={false}
                        className="max-h-[85vh] w-auto block pointer-events-none"
                    />

                    <svg
                        className="absolute top-0 left-0 w-full h-full"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        {/* Saved Polygons */}
                        {polygons.map((poly, i) => (
                            <polygon
                                key={i}
                                points={poly.points}
                                fill={dragState?.idx === i ? "rgba(59, 130, 246, 0.5)" : "rgba(34, 197, 94, 0.4)"}
                                stroke="white"
                                strokeWidth="0.2"
                                className="cursor-move hover:stroke-yellow-400 pointer-events-auto"
                                onMouseDown={(e) => handlePolygonMouseDown(e, i)}
                            />
                        ))}

                        {/* Current Drawing */}
                        {points.length > 0 && (
                            <polygon
                                points={stringifyPoints(points)}
                                fill="rgba(239, 68, 68, 0.4)"
                                stroke="red"
                                strokeWidth="0.2"
                                className="pointer-events-none"
                            />
                        )}
                        {points.map((p, i) => (
                            <circle key={i} cx={p.x} cy={p.y} r="0.4" fill="yellow" stroke="black" strokeWidth="0.1" />
                        ))}
                    </svg>
                </div>
            </div>

            {/* Sidebar Controls */}
            <div className="w-full md:w-80 bg-white p-6 shadow-xl flex flex-col z-10 border-l">
                <h2 className="text-xl font-bold mb-2 text-gray-800">Editor v2</h2>
                <p className="text-xs text-gray-500 mb-4">
                    1. Dibuja UNO perfecto.<br />
                    2. Dale "Clonar".<br />
                    3. Arrástralo a la nueva posición.<br />
                    4. Repite.
                </p>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Unidad (ej: 101)</label>
                        <input
                            value={currentUnit}
                            onChange={e => setCurrentUnit(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && savePolygon()}
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Nombre..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={savePolygon}
                            disabled={!currentUnit || points.length < 3}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-medium disabled:opacity-50"
                        >
                            Guardar
                        </button>
                        <button
                            onClick={() => setPoints(points.slice(0, -1))}
                            disabled={points.length === 0}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded"
                        >
                            Deshacer Puntos
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto border-t py-4">
                    <h3 className="font-bold text-sm mb-2 text-gray-500">LISTA ({polygons.length})</h3>
                    <ul className="space-y-2">
                        {polygons.map((p, i) => (
                            <li key={i} className="bg-gray-50 p-2 rounded border hover:bg-blue-50 transition group">
                                <div className="flex justify-between items-center mb-1">
                                    <input
                                        className="font-mono font-bold bg-transparent border-none w-20 focus:ring-0 p-0"
                                        value={p.unit}
                                        onChange={(e) => {
                                            const newPolys = [...polygons]
                                            newPolys[i].unit = e.target.value
                                            setPolygons(newPolys)
                                        }}
                                    />
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => clonePolygon(i)}
                                            className="text-blue-500 hover:bg-blue-100 p-1 rounded text-xs px-2"
                                            title="Clonar esta forma"
                                        >
                                            Clonar
                                        </button>
                                        <button
                                            onClick={() => setPolygons(polygons.filter((_, idx) => idx !== i))}
                                            className="text-red-500 hover:bg-red-100 p-1 rounded"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-bold text-sm mb-2 text-gray-500">JSON FINAL</h3>
                    <textarea
                        readOnly
                        className="w-full h-24 border p-2 text-xs font-mono bg-slate-50 rounded cursor-pointer"
                        value={JSON.stringify(polygons, null, 2)}
                        onClick={e => e.currentTarget.select()}
                    />
                </div>
            </div>
        </div>
    )
}
