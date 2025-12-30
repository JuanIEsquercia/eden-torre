import { supabase } from '../lib/supabase'
import { Unit, UnitDisponibilidad, UnitTypology } from '../types/unit'

// Tipo para la base de datos (sin el campo cuotas como objeto, sino como JSON)
export interface UnitDB {
  id: string
  piso: string
  depto: string
  unidad: string
  tipologia: UnitTypology
  subtipo?: string
  superficie_total: number
  orientacion: 'frente' | 'contrafrente'
  disponibilidad: UnitDisponibilidad
  valor_m2: number
  precio_contado: number
  precio_financiado: number
  porcentaje_entrega: number
  entrega: number
  saldo: number
  cuotas: {
    '12': number
    '24': number
    '36': number
    '48': number
    '60': number
    '72': number
  } | null
  imagen_plano?: string
  created_at?: string
  updated_at?: string
}

// Convertir de DB a Unit
function dbToUnit(db: UnitDB): Unit {
  return {
    id: db.id,
    piso: db.piso,
    depto: db.depto,
    unidad: db.unidad,
    tipologia: db.tipologia,
    subtipo: db.subtipo,
    superficieTotal: db.superficie_total,
    orientacion: db.orientacion,
    disponibilidad: db.disponibilidad,
    valorM2: db.valor_m2,
    precioContado: db.precio_contado,
    precioFinanciado: db.precio_financiado,
    porcentajeEntrega: db.porcentaje_entrega,
    entrega: db.entrega,
    saldo: db.saldo,
    cuotas: db.cuotas || undefined,
    imagenPlano: db.imagen_plano,
  }
}

// Convertir de Unit a DB
function unitToDB(unit: Unit): Omit<UnitDB, 'created_at' | 'updated_at'> {
  return {
    id: unit.id,
    piso: unit.piso,
    depto: unit.depto,
    unidad: unit.unidad,
    tipologia: unit.tipologia,
    subtipo: unit.subtipo,
    superficie_total: unit.superficieTotal,
    orientacion: unit.orientacion || 'frente',
    disponibilidad: unit.disponibilidad,
    valor_m2: unit.valorM2,
    precio_contado: unit.precioContado,
    precio_financiado: unit.precioFinanciado,
    porcentaje_entrega: unit.porcentajeEntrega,
    entrega: unit.entrega,
    saldo: unit.saldo,
    cuotas: unit.cuotas || null,
    imagen_plano: unit.imagenPlano,
  }
}

// Obtener todas las unidades
export async function getAllUnits(): Promise<Unit[]> {
  try {
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .order('piso', { ascending: true })
      .order('depto', { ascending: true })

    if (error) {
      console.error('Error fetching units:', error)
      throw error
    }

    return data.map(dbToUnit)
  } catch (error) {
    console.error('Error in getAllUnits:', error)
    throw error
  }
}

// Obtener una unidad por ID
export async function getUnitById(id: string): Promise<Unit | null> {
  try {
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No se encontró la unidad
        return null
      }
      console.error('Error fetching unit:', error)
      throw error
    }

    return dbToUnit(data)
  } catch (error) {
    console.error('Error in getUnitById:', error)
    throw error
  }
}

// Crear una nueva unidad
export async function createUnit(unit: Unit): Promise<Unit> {
  try {
    const unitDB = unitToDB(unit)

    const { data, error } = await supabase
      .from('units')
      .insert(unitDB)
      .select()
      .single()

    if (error) {
      console.error('Error creating unit:', error)
      throw error
    }

    return dbToUnit(data)
  } catch (error) {
    console.error('Error in createUnit:', error)
    throw error
  }
}

// Actualizar una unidad
export async function updateUnit(id: string, unit: Partial<Unit>): Promise<Unit> {
  try {
    // Convertir campos de Unit a DB
    const updateData: any = {}
    
    if (unit.piso !== undefined) updateData.piso = unit.piso
    if (unit.depto !== undefined) updateData.depto = unit.depto
    if (unit.unidad !== undefined) updateData.unidad = unit.unidad
    if (unit.tipologia !== undefined) updateData.tipologia = unit.tipologia
    if (unit.subtipo !== undefined) updateData.subtipo = unit.subtipo
    if (unit.superficieTotal !== undefined) updateData.superficie_total = unit.superficieTotal
    if (unit.orientacion !== undefined) updateData.orientacion = unit.orientacion
    if (unit.disponibilidad !== undefined) updateData.disponibilidad = unit.disponibilidad
    if (unit.valorM2 !== undefined) updateData.valor_m2 = unit.valorM2
    if (unit.precioContado !== undefined) updateData.precio_contado = unit.precioContado
    if (unit.precioFinanciado !== undefined) updateData.precio_financiado = unit.precioFinanciado
    if (unit.porcentajeEntrega !== undefined) updateData.porcentaje_entrega = unit.porcentajeEntrega
    if (unit.entrega !== undefined) updateData.entrega = unit.entrega
    if (unit.saldo !== undefined) updateData.saldo = unit.saldo
    if (unit.cuotas !== undefined) updateData.cuotas = unit.cuotas || null
    if (unit.imagenPlano !== undefined) updateData.imagen_plano = unit.imagenPlano

    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('units')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating unit:', error)
      throw error
    }

    return dbToUnit(data)
  } catch (error) {
    console.error('Error in updateUnit:', error)
    throw error
  }
}

// Eliminar una unidad
export async function deleteUnit(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('units')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting unit:', error)
      throw error
    }
  } catch (error) {
    console.error('Error in deleteUnit:', error)
    throw error
  }
}

// Filtrar unidades
export async function getFilteredUnits(filters: {
  disponibilidad?: UnitDisponibilidad
  typology?: UnitTypology
}): Promise<Unit[]> {
  try {
    let query = supabase
      .from('units')
      .select('*')

    if (filters.disponibilidad) {
      query = query.eq('disponibilidad', filters.disponibilidad)
    }

    if (filters.typology) {
      query = query.eq('tipologia', filters.typology)
    }

    const { data, error } = await query
      .order('piso', { ascending: true })
      .order('depto', { ascending: true })

    if (error) {
      console.error('Error fetching filtered units:', error)
      throw error
    }

    return data.map(dbToUnit)
  } catch (error) {
    console.error('Error in getFilteredUnits:', error)
    throw error
  }
}

