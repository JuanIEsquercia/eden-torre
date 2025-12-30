export type UnitDisponibilidad = 'disponible' | 'reservado' | 'vendido'

export type UnitTypology = 'monoambiente' | '1-dormitorio' | '2-dormitorios' | '3-dormitorios' | 'penthouse'

export type UnitOrientacion = 'frente' | 'contrafrente' | 'interno'

export interface Unit {
  id: string
  piso: string
  depto: string
  unidad: string // piso + depto (ej: "3B")
  tipologia: UnitTypology
  subtipo?: string // Para diferenciar tipos de monoambiente (ej: "monoambiente-tipo-a", "monoambiente-tipo-b")
  superficieTotal: number // m²
  orientacion?: UnitOrientacion
  disponibilidad: UnitDisponibilidad // Disponible, Reservado, Vendido
  valorM2: number
  precioContado: number // USD
  precioFinanciado: number // USD
  porcentajeEntrega: number // %
  entrega: number // USD
  saldo: number // USD
  cuotas?: {
    '12': number
    '24': number
    '36': number
    '48': number
    '60': number
    '72': number
  }
  imagenPlano?: string // URL de la imagen (Supabase Storage)
}

export interface UnitFilters {
  disponibilidad?: UnitDisponibilidad
  typology?: UnitTypology
  piso?: string
}

