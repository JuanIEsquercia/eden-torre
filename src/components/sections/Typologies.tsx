import { useState, useEffect } from 'react'

type Typology = 'monoambiente' | '1-dormitorio' | '2-dormitorios'

// Mapeo de tipologías a nombres de archivos de planos
// Puedes usar cualquier extensión: .png, .jpg, .jpeg, .svg, .webp, etc.
// Si no especificas extensión, el sistema intentará encontrarla automáticamente
const typologyPlans: Record<Typology, string | string[]> = {
  'monoambiente': ['monoambiente.png', 'monoambiente.jpg', 'monoambiente.jpeg', 'monoambiente.svg', 'monoambiente.webp'],
  '1-dormitorio': ['1-dormitorio.png', '1-dormitorio.jpg', '1-dormitorio.jpeg', '1-dormitorio.svg', '1-dormitorio.webp'],
  '2-dormitorios': ['2-dormitorios.png', '2-dormitorios.jpg', '2-dormitorios.jpeg', '2-dormitorios.svg', '2-dormitorios.webp'],
}

// Extensiones soportadas (en orden de prioridad)
const supportedExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif']

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

  // Función para obtener la ruta del plano según la tipología
  // Intenta cargar el archivo con diferentes extensiones si no se especifica
  const getPlanImage = (typology: Typology): string | null => {
    const planConfig = typologyPlans[typology]
    
    // Si es un string (archivo específico), usarlo directamente
    if (typeof planConfig === 'string') {
      return `/planos/${planConfig}`
    }
    
    // Si es un array, usar el primero (el sistema intentará cargarlo)
    if (Array.isArray(planConfig) && planConfig.length > 0) {
      return `/planos/${planConfig[0]}`
    }
    
    return null
  }

  // Función para obtener todas las posibles rutas de un plano (para fallback)
  const getPlanImageOptions = (typology: Typology): string[] => {
    const planConfig = typologyPlans[typology]
    
    if (typeof planConfig === 'string') {
      return [`/planos/${planConfig}`]
    }
    
    if (Array.isArray(planConfig)) {
      return planConfig.map(file => `/planos/${file}`)
    }
    
    return []
  }

  // Componente para cargar imágenes con fallback automático
  const PlanImageLoader = ({ typology, label }: { typology: Typology, label: string }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [imageError, setImageError] = useState(false)
    const imageOptions = getPlanImageOptions(typology)
    const currentImage = imageOptions[currentImageIndex] || null

    // Resetear cuando cambia la tipología
    useEffect(() => {
      setCurrentImageIndex(0)
      setImageError(false)
    }, [typology])

    const handleImageError = () => {
      // Intentar con la siguiente imagen de la lista
      if (currentImageIndex < imageOptions.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1)
      } else {
        // Si no hay más opciones, mostrar placeholder
        setImageError(true)
      }
    }

    if (imageError || !currentImage) {
      // Mostrar placeholder si no hay imagen o todas fallaron
      return (
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div 
            className="d-flex align-items-center justify-content-center bg-light"
            style={{ 
              aspectRatio: '16/9', 
              minHeight: '500px'
            }}
          >
            <div className="text-center p-5">
              <div className="mb-4">
                <svg 
                  width="100" 
                  height="100" 
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
              <h4 className="h5 fw-bold text-secondary-custom mb-2">Plano de {label}</h4>
              <p className="text-muted mb-2">Render o plano arquitectónico</p>
              <p className="text-muted small">
                Archivos esperados en <code>public/planos/</code>:
              </p>
              <ul className="list-unstyled text-muted small">
                {imageOptions.map((file, idx) => (
                  <li key={idx}>• {file.replace('/planos/', '')}</li>
                ))}
              </ul>
      </div>
    )
    }

    return (
      <div className="bg-white rounded border shadow-sm overflow-hidden">
        <div 
          className="d-flex align-items-center justify-content-center bg-light"
          style={{ 
            aspectRatio: '16/9', 
            minHeight: '500px'
          }}
        >
          <img 
            src={currentImage}
            alt={`Plano de ${label}`}
            className="img-fluid"
            style={{ 
              objectFit: 'contain',
              maxWidth: '100%',
              maxHeight: '100%'
            }}
            onError={handleImageError}
          />
        </div>
      </div>
    )
  }

  return (
    <section className="py-5 bg-surface">
      <div className="container px-4">
        <h2 className="display-3 display-md-2 fw-bold text-center mb-4 text-secondary-custom">
          Tipologías
        </h2>

        {/* Información del proyecto */}
        <div className="row mb-5">
          <div className="col-md-10 mx-auto">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-5">
                <div className="row g-4 text-center">
                  <div className="col-md-3">
                    <h4 className="h5 fw-bold text-primary mb-2">Superficie Total</h4>
                    <p className="fs-3 fw-bold text-secondary-custom mb-0">3,200 m²</p>
                  </div>
                  <div className="col-md-3">
                    <h4 className="h5 fw-bold text-primary mb-2">Torre Residencial</h4>
                    <p className="fs-3 fw-bold text-secondary-custom mb-0">9 Pisos</p>
                  </div>
                  <div className="col-md-3">
                    <h4 className="h5 fw-bold text-primary mb-2">Cocheras</h4>
                    <p className="fs-3 fw-bold text-secondary-custom mb-0">2 Niveles</p>
                  </div>
                  <div className="col-md-3">
                    <h4 className="h5 fw-bold text-primary mb-2">Terreno</h4>
                    <p className="fs-6 fw-semibold text-secondary-custom mb-0">Perímetro entre medianeras<br />10x47m</p>
                  </div>
                </div>
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
                <PlanImageLoader typology={typology.key} label={typology.label} />
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}

export default Typologies

