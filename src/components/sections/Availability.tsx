import { useState, useEffect } from 'react'
import { Unit, UnitDisponibilidad, UnitTypology } from '../../types/unit'
import { getFilteredUnits } from '../../services/unitsService'

function Availability() {
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [filters, setFilters] = useState({
    disponibilidad: '',
    typology: '',
  })

  useEffect(() => {
    loadUnits()
  }, [filters])

  const loadUnits = async () => {
    try {
      setLoading(true)
      const filtersToApply = {
        disponibilidad: filters.disponibilidad ? filters.disponibilidad as UnitDisponibilidad : undefined,
        typology: filters.typology ? filters.typology as UnitTypology : undefined,
      }
      const data = await getFilteredUnits(filtersToApply)
      setUnits(data)
    } catch (error) {
      console.error('Error loading units:', error)
      // Si hay error, mostrar array vacío en lugar de datos mock
      setUnits([])
    } finally {
      setLoading(false)
    }
  }

  const getDisponibilidadBadge = (disponibilidad: UnitDisponibilidad): string => {
    const badges: Record<UnitDisponibilidad, string> = {
      disponible: 'bg-success',
      reservado: 'bg-warning',
      vendido: 'bg-secondary',
    }
    return badges[disponibilidad] || 'bg-secondary'
  }

  const getDisponibilidadLabel = (disponibilidad: UnitDisponibilidad): string => {
    const labels: Record<UnitDisponibilidad, string> = {
      disponible: 'Disponible',
      reservado: 'Reservado',
      vendido: 'Vendido',
    }
    return labels[disponibilidad] || disponibilidad
  }

  const getPlanoImage = (unit: Unit) => {
    // Usar la imagen del plano si está definida
    if (unit.imagenPlano) {
      return unit.imagenPlano
    }
    // Fallback: lógica anterior para compatibilidad
    if (unit.tipologia === 'monoambiente') {
      if (unit.unidad === '1B' || unit.unidad === '2B') {
        return '/images/1-2-B.png'
      }
      return '/images/3 a 9 tipo b.png'
    }
    return null
  }

  const handleCardClick = (unit: Unit) => {
    setSelectedUnit(unit)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedUnit(null)
  }

  if (loading) {
    return (
      <section className="py-5 bg-background">
        <div className="container px-4">
          <p className="text-center text-muted">Cargando disponibilidad...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-5 bg-background">
      <div className="container px-4">
        <h2 className="display-3 display-md-2 fw-bold text-center mb-4 text-secondary-custom">
          Disponibilidad y Precios
        </h2>
        <p className="text-center text-muted mb-4">Stock en tiempo real</p>

        {/* Filtros */}
        <div className="mb-4 d-flex flex-wrap gap-3 justify-content-center">
          <select
            value={filters.disponibilidad}
            onChange={(e) => setFilters({ ...filters, disponibilidad: e.target.value as UnitDisponibilidad | '' })}
            className="form-select"
            style={{ maxWidth: '300px' }}
          >
            <option value="">Todas las disponibilidades</option>
            <option value="disponible">Disponible</option>
            <option value="reservado">Reservado</option>
            <option value="vendido">Vendido</option>
          </select>

          <select
            value={filters.typology}
            onChange={(e) => setFilters({ ...filters, typology: e.target.value as UnitTypology | '' })}
            className="form-select"
            style={{ maxWidth: '300px' }}
          >
            <option value="">Todas las tipologías</option>
            <option value="monoambiente">Monoambiente</option>
            <option value="1-dormitorio">1 Dormitorio</option>
            <option value="2-dormitorios">2 Dormitorios</option>
          </select>
        </div>

        {/* Grid de unidades */}
        {units.length === 0 ? (
          <p className="text-center text-muted">
            No hay unidades disponibles con los filtros seleccionados.
          </p>
        ) : (
          <div className="row g-4">
            {units.map((unit) => (
              <div key={unit.id} className="col-md-6 col-lg-4">
                <div 
                  className="card h-100 shadow-sm"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleCardClick(unit)}
                >
                  <div className="position-relative">
                    <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 10 }}>
                      <span className={`badge ${getDisponibilidadBadge(unit.disponibilidad)}`}>
                        {getDisponibilidadLabel(unit.disponibilidad)}
                      </span>
                    </div>
                    {getPlanoImage(unit) ? (
                      <div className="bg-light rounded-top overflow-hidden">
                        <img 
                          src={getPlanoImage(unit)!} 
                          alt={`Plano - Unidad ${unit.unidad}`}
                          className="img-fluid w-100"
                          style={{ 
                            objectFit: 'contain', 
                            display: 'block',
                            minHeight: '250px',
                            maxHeight: '300px'
                          }}
                        />
                      </div>
                    ) : (
                      <div className="bg-light d-flex align-items-center justify-content-center" style={{ aspectRatio: '16/9', minHeight: '200px' }}>
                        <span className="text-muted">Unidad {unit.unidad}</span>
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <h3 className="h5 fw-semibold mb-2 text-secondary-custom">
                      Unidad {unit.unidad}
                    </h3>
                    <p className="text-muted mb-2 small">
                      {unit.tipologia.replace('-', ' ')} • {unit.superficieTotal} m²
                    </p>
                    <p className="h4 fw-bold text-primary mb-0">
                      ${unit.precioContado.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Detalle de Unidad */}
        {showModal && selectedUnit && (
          <div
            className="modal show d-block"
            tabIndex={-1}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={handleCloseModal}
          >
            <div
              className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title h4 fw-bold">Unidad {selectedUnit.unidad}</h2>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row g-4">
                    {/* Información básica */}
                    <div className="col-md-6">
                      <div className="mb-3">
                        <p className="text-muted small mb-1">PISO</p>
                        <p className="fw-semibold mb-0">{selectedUnit.piso}</p>
                      </div>
                      <div className="mb-3">
                        <p className="text-muted small mb-1">DPTO</p>
                        <p className="fw-semibold mb-0">{selectedUnit.depto}</p>
                      </div>
                      <div className="mb-3">
                        <p className="text-muted small mb-1">SUPERFICIE TOTAL M²</p>
                        <p className="fw-semibold mb-0">{selectedUnit.superficieTotal} m²</p>
                      </div>
                      <div className="mb-3">
                        <p className="text-muted small mb-1">TIPOLOGÍA</p>
                        <p className="fw-semibold mb-0">
                          {selectedUnit.tipologia.replace('-', ' ')}
                          {selectedUnit.subtipo && (
                            <span className="text-muted small"> ({selectedUnit.subtipo})</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <p className="text-muted small mb-1">ORIENTACIÓN</p>
                        <p className="fw-semibold mb-0">{selectedUnit.orientacion || 'N/A'}</p>
                      </div>
                      <div className="mb-3">
                        <p className="text-muted small mb-1">DISPONIBILIDAD</p>
                        <span className={`badge ${getDisponibilidadBadge(selectedUnit.disponibilidad)}`}>
                          {getDisponibilidadLabel(selectedUnit.disponibilidad)}
                        </span>
                      </div>
                      <div className="mb-3">
                        <p className="text-muted small mb-1">VALOR M²</p>
                        <p className="fw-semibold mb-0">${selectedUnit.valorM2.toLocaleString()} /m²</p>
                      </div>
                    </div>
                  </div>

                  <hr />

                  {/* Precios */}
                  <div className="row g-4 mb-4">
                    <div className="col-md-6">
                      <div className="card bg-light">
                        <div className="card-body">
                          <p className="text-muted small mb-2">PRECIO CONTADO (USD)</p>
                          <p className="h4 fw-bold text-primary mb-0">
                            ${selectedUnit.precioContado.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card bg-light">
                        <div className="card-body">
                          <p className="text-muted small mb-2">PRECIO FINANCIADO (USD)</p>
                          <p className="h4 fw-bold text-primary mb-0">
                            ${selectedUnit.precioFinanciado.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Entrega y Saldo */}
                  <div className="row g-4 mb-4">
                    <div className="col-md-4">
                      <div className="card">
                        <div className="card-body text-center">
                          <p className="text-muted small mb-2">% DE ENTREGA</p>
                          <p className="h5 fw-bold mb-0">{selectedUnit.porcentajeEntrega}%</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card">
                        <div className="card-body text-center">
                          <p className="text-muted small mb-2">ENTREGA (USD)</p>
                          <p className="h5 fw-bold mb-0">${selectedUnit.entrega.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card">
                        <div className="card-body text-center">
                          <p className="text-muted small mb-2">SALDO (USD)</p>
                          <p className="h5 fw-bold mb-0">${selectedUnit.saldo.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cuotas */}
                  {selectedUnit.cuotas && (
                    <>
                      <h5 className="fw-bold mb-3">Plan de Financiamiento</h5>
                      <div className="row g-3">
                        {Object.entries(selectedUnit.cuotas).map(([cuotas, monto]) => (
                          <div key={cuotas} className="col-md-4 col-sm-6">
                            <div className="card border">
                              <div className="card-body text-center p-3">
                                <p className="text-muted small mb-1">{cuotas} cuotas</p>
                                <p className="h6 fw-bold mb-0">${monto.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Imagen del plano si existe */}
                  {getPlanoImage(selectedUnit) && (
                    <div className="mt-4">
                      <h5 className="fw-bold mb-3">Plano</h5>
                      <div className="bg-light rounded p-3">
                        <img
                          src={getPlanoImage(selectedUnit)!}
                          alt={`Plano ${selectedUnit.unidad}`}
                          className="img-fluid w-100"
                          style={{ maxHeight: '400px', objectFit: 'contain' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleCloseModal}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Availability

