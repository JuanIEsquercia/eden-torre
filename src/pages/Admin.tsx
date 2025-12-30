import { useState, useEffect } from 'react'
import { Unit, UnitDisponibilidad, UnitTypology, UnitOrientacion } from '../types/unit'
import { getAllUnits, createUnit } from '../services/unitsService'

function Admin() {
  const [units, setUnits] = useState<Unit[]>([])
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  // Formulario para nueva unidad
  const [newUnit, setNewUnit] = useState<Partial<Unit>>({
    piso: '',
    depto: '',
    tipologia: 'monoambiente',
    superficieTotal: 0,
    orientacion: 'frente',
    disponibilidad: 'disponible',
    valorM2: 0,
    precioContado: 0,
    precioFinanciado: 0,
    porcentajeEntrega: 30,
    entrega: 0,
    saldo: 0,
    cuotas: {
      '12': 0,
      '24': 0,
      '36': 0,
      '48': 0,
      '60': 0,
      '72': 0,
    },
  })

  useEffect(() => {
    loadUnits()
  }, [])

  const loadUnits = async () => {
    try {
      setLoading(true)
      const data = await getAllUnits()
      setUnits(data)
    } catch (error) {
      console.error('Error loading units:', error)
      alert('Error al cargar las unidades. Verifica la configuración de Supabase.')
    } finally {
      setLoading(false)
    }
  }

  const getDisponibilidadBadge = (disponibilidad: UnitDisponibilidad) => {
    const badges = {
      disponible: 'bg-success',
      reservado: 'bg-warning',
      vendido: 'bg-secondary',
    }
    return badges[disponibilidad] || 'bg-secondary'
  }

  const getDisponibilidadLabel = (disponibilidad: UnitDisponibilidad) => {
    const labels = {
      disponible: 'Disponible',
      reservado: 'Reservado',
      vendido: 'Vendido',
    }
    return labels[disponibilidad] || disponibilidad
  }

  const handleCardClick = (unit: Unit) => {
    setSelectedUnit(unit)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedUnit(null)
  }

  const handleOpenCreateModal = () => {
    setNewUnit({
      piso: '',
      depto: '',
      tipologia: 'monoambiente',
      superficieTotal: 0,
      orientacion: 'frente',
      disponibilidad: 'disponible',
      valorM2: 0,
      precioContado: 0,
      precioFinanciado: 0,
      porcentajeEntrega: 30,
      entrega: 0,
      saldo: 0,
      cuotas: {
        '12': 0,
        '24': 0,
        '36': 0,
        '48': 0,
        '60': 0,
        '72': 0,
      },
    })
    setSelectedFile(null)
    setImagePreview(null)
    setShowCreateModal(true)
  }

  const handleCloseCreateModal = () => {
    setShowCreateModal(false)
    setNewUnit({
      piso: '',
      depto: '',
      tipologia: 'monoambiente',
      superficieTotal: 0,
      orientacion: 'frente',
      disponibilidad: 'disponible',
      valorM2: 0,
      precioContado: 0,
      precioFinanciado: 0,
      porcentajeEntrega: 30,
      entrega: 0,
      saldo: 0,
      cuotas: {
        '12': 0,
        '24': 0,
        '36': 0,
        '48': 0,
        '60': 0,
        '72': 0,
      },
    })
    setSelectedFile(null)
    setImagePreview(null)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Crear preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImageToSupabase = async (file: File, unitId: string): Promise<string | null> => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      // Si Supabase está configurado, subir a Storage
      if (supabaseUrl && supabaseKey) {
        const { supabase } = await import('../lib/supabase')
        const fileExt = file.name.split('.').pop()
        const fileName = `${unitId}-${Date.now()}.${fileExt}`
        const filePath = `planos/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('planos')
          .upload(filePath, file)

        if (uploadError) {
          console.error('Error uploading file:', uploadError)
          // Si falla, usar preview local como fallback
          return imagePreview || null
        }

        const { data } = supabase.storage
          .from('planos')
          .getPublicUrl(filePath)

        return data.publicUrl
      }

      // Si Supabase no está configurado, usar preview local (base64)
      // Nota: En producción deberías usar Supabase Storage
      console.warn('Supabase no configurado. Usando preview local. Configura .env para subir a Supabase Storage.')
      return imagePreview || null
    } catch (error) {
      console.error('Error uploading image:', error)
      // Fallback a preview local si hay error
      return imagePreview || null
    }
  }

  const calculateDerivedFields = (unit: Partial<Unit>) => {
    const updated = { ...unit }
    
    // Calcular unidad (piso + depto)
    if (updated.piso && updated.depto) {
      updated.unidad = `${updated.piso}${updated.depto}`
      updated.id = updated.unidad
    }
    
    // Calcular valorM2 si hay precio y superficie (basado en precio contado)
    if (updated.precioContado && updated.precioContado > 0 && updated.superficieTotal && updated.superficieTotal > 0) {
      updated.valorM2 = Math.round(updated.precioContado / updated.superficieTotal)
    } else {
      updated.valorM2 = 0
    }
    
    // Calcular entrega basada en precio financiado
    if (updated.precioFinanciado && updated.precioFinanciado > 0 && updated.porcentajeEntrega && updated.porcentajeEntrega > 0) {
      updated.entrega = Math.round(updated.precioFinanciado * (updated.porcentajeEntrega / 100))
      // Saldo se calcula sobre el precio financiado
      updated.saldo = updated.precioFinanciado - updated.entrega
    } else {
      updated.entrega = 0
      updated.saldo = 0
    }
    
    // Calcular cuotas basadas en el saldo del precio financiado
    if (updated.saldo && updated.saldo > 0 && updated.cuotas) {
      const cuotas = { ...updated.cuotas }
      // Calcular sobre el saldo del precio financiado
      cuotas['12'] = Math.round(updated.saldo / 12)
      cuotas['24'] = Math.round(updated.saldo / 24)
      cuotas['36'] = Math.round(updated.saldo / 36)
      cuotas['48'] = Math.round(updated.saldo / 48)
      cuotas['60'] = Math.round(updated.saldo / 60)
      cuotas['72'] = Math.round(updated.saldo / 72)
      updated.cuotas = cuotas
    } else if (updated.cuotas) {
      // Resetear cuotas si no hay saldo
      updated.cuotas = {
        '12': 0,
        '24': 0,
        '36': 0,
        '48': 0,
        '60': 0,
        '72': 0,
      }
    }
    
    return updated
  }

  const handleInputChange = (field: keyof Unit, value: any) => {
    const updated = { ...newUnit, [field]: value }
    const calculated = calculateDerivedFields(updated)
    setNewUnit(calculated)
  }

  const handleSaveUnit = async () => {
    if (!newUnit.piso || !newUnit.depto || !newUnit.tipologia) {
      alert('Por favor completa los campos obligatorios: Piso, Depto y Tipología')
      return
    }

    try {
      const unitId = newUnit.id || `${newUnit.piso}${newUnit.depto}`
      let imageUrl = newUnit.imagenPlano

      // Subir imagen si hay un archivo seleccionado
      if (selectedFile) {
        setUploadingImage(true)
        const uploadedUrl = await uploadImageToSupabase(selectedFile, unitId)
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        }
        setUploadingImage(false)
      }

      const unitToSave: Unit = {
        id: unitId,
        piso: newUnit.piso!,
        depto: newUnit.depto!,
        unidad: newUnit.unidad || `${newUnit.piso}${newUnit.depto}`,
        tipologia: newUnit.tipologia!,
        subtipo: newUnit.subtipo,
        superficieTotal: newUnit.superficieTotal || 0,
        orientacion: newUnit.orientacion,
        disponibilidad: newUnit.disponibilidad || 'disponible',
        valorM2: newUnit.valorM2 || 0,
        precioContado: newUnit.precioContado || 0,
        precioFinanciado: newUnit.precioFinanciado || 0,
        porcentajeEntrega: newUnit.porcentajeEntrega || 30,
        entrega: newUnit.entrega || 0,
        saldo: newUnit.saldo || 0,
        cuotas: newUnit.cuotas,
        imagenPlano: imageUrl,
      }

      // Guardar en Supabase
      await createUnit(unitToSave)
      
      // Recargar unidades
      await loadUnits()
      
      handleCloseCreateModal()
      alert('Unidad creada exitosamente')
    } catch (error) {
      console.error('Error saving unit:', error)
      alert('Error al guardar la unidad. Verifica la consola para más detalles.')
    }
  }

  if (loading) {
    return (
      <div className="container py-5">
        <p className="text-center">Cargando unidades...</p>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 fw-bold mb-0">Panel de Administración</h1>
        <button 
          className="btn btn-primary"
          onClick={handleOpenCreateModal}
        >
          + Nueva Unidad
        </button>
      </div>
      
      {/* Grid de cards */}
      <div className="row g-4">
        {units.map((unit) => (
          <div key={unit.id} className="col-md-6 col-lg-4">
            <div 
              className="card h-100 shadow-sm cursor-pointer"
              style={{ cursor: 'pointer' }}
              onClick={() => handleCardClick(unit)}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h3 className="h5 fw-bold text-secondary-custom mb-1">
                      Unidad {unit.unidad}
                    </h3>
                    <p className="text-muted small mb-0">
                      Piso {unit.piso} - Depto {unit.depto}
                    </p>
                  </div>
                  <span className={`badge ${getDisponibilidadBadge(unit.disponibilidad)}`}>
                    {getDisponibilidadLabel(unit.disponibilidad)}
                  </span>
                </div>
                
                <div className="mb-3">
                  <p className="text-muted small mb-1">Tipología</p>
                  <p className="fw-semibold mb-0">{unit.tipologia}</p>
                </div>
                
                <div>
                  <p className="text-muted small mb-1">Precio Contado</p>
                  <p className="h5 fw-bold text-primary mb-0">
                    ${unit.precioContado.toLocaleString()} USD
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
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
                        {selectedUnit.tipologia}
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
                      <p className="text-muted small mb-1">VALOR M² %</p>
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
                {selectedUnit.imagenPlano && (
                  <div className="mt-4">
                    <h5 className="fw-bold mb-3">Plano</h5>
                    <div className="bg-light rounded p-3">
                      <img 
                        src={selectedUnit.imagenPlano} 
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
                  className="btn btn-secondary" 
                  onClick={handleCloseModal}
                >
                  Cerrar
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => {
                    // TODO: Implementar edición
                    console.log('Editar unidad:', selectedUnit)
                  }}
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Crear/Editar Unidad */}
      {showCreateModal && (
        <div 
          className="modal show d-block" 
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={handleCloseCreateModal}
        >
          <div 
            className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title h4 fw-bold">Nueva Unidad</h2>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseCreateModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  {/* Información básica */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Piso *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUnit.piso || ''}
                      onChange={(e) => handleInputChange('piso', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Depto *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUnit.depto || ''}
                      onChange={(e) => handleInputChange('depto', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Tipología *</label>
                    <select
                      className="form-select"
                      value={newUnit.tipologia || 'monoambiente'}
                      onChange={(e) => handleInputChange('tipologia', e.target.value as UnitTypology)}
                      required
                    >
                      <option value="monoambiente">Monoambiente</option>
                      <option value="1-dormitorio">1 Dormitorio</option>
                      <option value="2-dormitorios">2 Dormitorios</option>
                      <option value="3-dormitorios">3 Dormitorios</option>
                      <option value="penthouse">Penthouse</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Subtipo (opcional)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUnit.subtipo || ''}
                      onChange={(e) => handleInputChange('subtipo', e.target.value)}
                      placeholder="Ej: monoambiente-tipo-a"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Superficie Total (m²) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newUnit.superficieTotal || ''}
                      onChange={(e) => handleInputChange('superficieTotal', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Orientación *</label>
                    <select
                      className="form-select"
                      value={newUnit.orientacion || 'frente'}
                      onChange={(e) => handleInputChange('orientacion', e.target.value as UnitOrientacion)}
                      required
                    >
                      <option value="frente">Frente</option>
                      <option value="contrafrente">Contrafrente</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Disponibilidad *</label>
                    <select
                      className="form-select"
                      value={newUnit.disponibilidad || 'disponible'}
                      onChange={(e) => handleInputChange('disponibilidad', e.target.value as UnitDisponibilidad)}
                      required
                    >
                      <option value="disponible">Disponible</option>
                      <option value="reservado">Reservado</option>
                      <option value="vendido">Vendido</option>
                    </select>
                  </div>

                  <div className="col-12"><hr /></div>

                  {/* Precios */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Precio Contado (USD) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newUnit.precioContado || ''}
                      onChange={(e) => handleInputChange('precioContado', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Precio Financiado (USD) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newUnit.precioFinanciado || ''}
                      onChange={(e) => handleInputChange('precioFinanciado', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Valor M²</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newUnit.valorM2 || ''}
                      readOnly
                      style={{ backgroundColor: '#f8f9fa' }}
                    />
                    <small className="text-muted">Calculado automáticamente</small>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">% de Entrega *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newUnit.porcentajeEntrega || ''}
                      onChange={(e) => handleInputChange('porcentajeEntrega', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Entrega (USD)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newUnit.entrega || ''}
                      readOnly
                      style={{ backgroundColor: '#f8f9fa' }}
                    />
                    <small className="text-muted">Calculado automáticamente</small>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Saldo (USD)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newUnit.saldo || ''}
                      readOnly
                      style={{ backgroundColor: '#f8f9fa' }}
                    />
                    <small className="text-muted">Calculado automáticamente</small>
                  </div>

                  <div className="col-12"><hr /></div>

                  {/* Cuotas */}
                  <div className="col-12">
                    <h5 className="fw-bold mb-3">Plan de Financiamiento (calculado automáticamente)</h5>
                    <div className="row g-3">
                      {[12, 24, 36, 48, 60, 72].map((cuota) => (
                        <div key={cuota} className="col-md-4">
                          <label className="form-label small">{cuota} cuotas (USD)</label>
                          <input
                            type="number"
                            className="form-control"
                            value={newUnit.cuotas?.[cuota.toString() as '12' | '24' | '36' | '48' | '60' | '72'] || ''}
                            readOnly
                            style={{ backgroundColor: '#f8f9fa' }}
                          />
                          <small className="text-muted">Calculado automáticamente</small>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-12"><hr /></div>

                  {/* Imagen del plano */}
                  <div className="col-12">
                    <label className="form-label fw-semibold">Imagen del Plano (opcional)</label>
                    
                    {/* Input de archivo */}
                    <input
                      type="file"
                      className="form-control mb-3"
                      accept="image/*,.svg,.png,.jpg,.jpeg"
                      onChange={handleFileSelect}
                    />
                    <small className="text-muted d-block mb-3">
                      Sube una imagen del plano (PNG, JPG, SVG). Se guardará en Supabase Storage.
                    </small>

                    {/* Preview de imagen */}
                    {imagePreview && (
                      <div className="mb-3">
                        <p className="small fw-semibold mb-2">Vista previa:</p>
                        <div className="border rounded p-2 bg-light">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="img-fluid"
                            style={{ maxHeight: '200px', objectFit: 'contain' }}
                          />
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger mt-2"
                          onClick={() => {
                            setSelectedFile(null)
                            setImagePreview(null)
                            handleInputChange('imagenPlano', '')
                          }}
                        >
                          Eliminar imagen
                        </button>
                      </div>
                    )}

                    {/* O usar URL manual */}
                    <div className="mt-3">
                      <label className="form-label small">O ingresa una URL manualmente:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newUnit.imagenPlano || ''}
                        onChange={(e) => handleInputChange('imagenPlano', e.target.value)}
                        placeholder="/images/plano.png o URL de Supabase"
                        disabled={!!selectedFile}
                      />
                      {selectedFile && (
                        <small className="text-muted">Desactiva la imagen subida para usar URL manual</small>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleCloseCreateModal}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleSaveUnit}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Subiendo imagen...
                    </>
                  ) : (
                    'Guardar Unidad'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
