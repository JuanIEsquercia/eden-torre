-- Tabla de unidades
CREATE TABLE IF NOT EXISTS units (
  id TEXT PRIMARY KEY,
  piso TEXT NOT NULL,
  depto TEXT NOT NULL,
  unidad TEXT NOT NULL UNIQUE,
  tipologia TEXT NOT NULL CHECK (tipologia IN ('monoambiente', '1-dormitorio', '2-dormitorios', '3-dormitorios', 'penthouse')),
  subtipo TEXT,
  superficie_total NUMERIC NOT NULL,
  orientacion TEXT NOT NULL CHECK (orientacion IN ('frente', 'contrafrente')),
  disponibilidad TEXT NOT NULL CHECK (disponibilidad IN ('disponible', 'reservado', 'vendido')),
  valor_m2 NUMERIC NOT NULL,
  precio_contado NUMERIC NOT NULL,
  precio_financiado NUMERIC NOT NULL,
  porcentaje_entrega NUMERIC NOT NULL,
  entrega NUMERIC NOT NULL,
  saldo NUMERIC NOT NULL,
  cuotas JSONB,
  imagen_plano TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar las consultas
CREATE INDEX IF NOT EXISTS idx_units_disponibilidad ON units(disponibilidad);
CREATE INDEX IF NOT EXISTS idx_units_tipologia ON units(tipologia);
CREATE INDEX IF NOT EXISTS idx_units_piso_depto ON units(piso, depto);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON units
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE units ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública (para la página pública)
CREATE POLICY "Allow public read access" ON units
  FOR SELECT
  USING (true);

-- Política para permitir inserción, actualización y eliminación solo para usuarios autenticados
-- Por ahora, como no hay autenticación, puedes desactivar RLS o crear políticas más permisivas
-- Para desarrollo, puedes desactivar RLS temporalmente:
-- ALTER TABLE units DISABLE ROW LEVEL SECURITY;

-- O crear políticas que permitan todo (solo para desarrollo):
CREATE POLICY "Allow all operations for development" ON units
  FOR ALL
  USING (true)
  WITH CHECK (true);

