import { useState } from 'react'

type Typology = 'monoambiente' | '1-dormitorio' | '2-dormitorios'

function Typologies() {
  const [activeTab, setActiveTab] = useState<Typology>('monoambiente')

  const typologies: { 
    key: Typology
    label: string
    description: string
  }[] = [
    {
      key: 'monoambiente',
      label: 'Monoambiente',
      description: 'Unidades funcionales diseñadas con enfoque en la comodidad y eficiencia',
    },
    {
      key: '1-dormitorio',
      label: '1 Dormitorio',
      description: 'Departamentos ideales para solteros o parejas jóvenes',
    },
    {
      key: '2-dormitorios',
      label: '2 Dormitorios',
      description: 'Espacios perfectos para familias pequeñas',
    },
  ]

  return (
    <section className="py-5 bg-surface">
      <div className="container px-4">
        <h2 className="display-3 display-md-2 fw-bold text-center mb-4 text-secondary-custom">
          Tipologías
        </h2>

        {/* Información del proyecto */}
        <div className="row mb-5">
          <div className="col-md-8 mx-auto">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="row g-4 text-center">
                  <div className="col-md-4">
                    <h4 className="h5 fw-bold text-primary mb-2">Superficie Total</h4>
                    <p className="fs-4 fw-semibold text-secondary-custom mb-0">3,200 m²</p>
                  </div>
                  <div className="col-md-4">
                    <h4 className="h5 fw-bold text-primary mb-2">Torre Residencial</h4>
                    <p className="fs-4 fw-semibold text-secondary-custom mb-0">9 Pisos</p>
                  </div>
                  <div className="col-md-4">
                    <h4 className="h5 fw-bold text-primary mb-2">Cocheras</h4>
                    <p className="fs-4 fw-semibold text-secondary-custom mb-0">2 Niveles</p>
                  </div>
                </div>
                <hr className="my-4" />
                <p className="text-center text-secondary-custom mb-0">
                  <strong>Terreno:</strong> Perímetro entre medianeras de 10x47m
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
          {typologies.map((typology) => (
            <button
              key={typology.key}
              onClick={() => setActiveTab(typology.key)}
              className={`btn ${activeTab === typology.key ? 'btn-primary' : 'btn-outline-secondary'}`}
            >
              {typology.label}
            </button>
          ))}
        </div>

        {/* Contenido del tab activo */}
        <div className="bg-light rounded p-4">
          {typologies
            .filter((t) => t.key === activeTab)
            .map((typology) => (
              <div key={typology.key}>
                <div className="text-center mb-4">
                  <h3 className="display-5 fw-semibold mb-3 text-secondary-custom">
                    {typology.label}
                  </h3>
                  <p className="fs-5 text-secondary-custom mb-0">
                    {typology.description}
                  </p>
                </div>
                
                {/* Área de plano/render mejorada */}
                <div className="bg-white rounded border shadow-sm overflow-hidden">
                  <div 
                    className="d-flex align-items-center justify-content-center position-relative"
                    style={{ 
                      aspectRatio: '16/9', 
                      minHeight: '450px',
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
                    }}
                  >
                    {/* Placeholder mejorado */}
                    <div className="text-center p-4">
                      <div className="mb-3">
                        <svg 
                          width="80" 
                          height="80" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="1.5"
                          className="text-muted"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                      </div>
                      <p className="text-muted fw-semibold mb-1">Plano de {typology.label}</p>
                      <p className="text-muted small mb-0">Render o plano arquitectónico</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}

export default Typologies

