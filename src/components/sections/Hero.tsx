function Hero() {
  return (
    <section className="hero-section position-relative d-flex align-items-center justify-content-center text-white" style={{ minHeight: '100vh', overflow: 'hidden' }}>
      {/* Background futurista con gradiente sofisticado */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100" 
        style={{ 
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 30%, #334155 60%, #1E293B 100%)',
          zIndex: 0
        }}
      >
        {/* Efecto de luz/brillo sutil */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ 
            background: 'radial-gradient(circle at 20% 30%, rgba(234, 88, 12, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(234, 88, 12, 0.1) 0%, transparent 50%)',
            opacity: 0.8
          }}
        />
        
        {/* Patrón de líneas geométricas sutiles */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ 
            backgroundImage: `
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            opacity: 0.4
          }}
        />
        
        {/* Overlay oscuro sutil para mejor contraste del texto */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ 
            background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.3) 0%, rgba(15, 23, 42, 0.6) 100%)'
          }} 
        />
      </div>

      {/* Contenido */}
      <div className="container position-relative" style={{ zIndex: 10 }}>
        <div className="text-center px-4">
          <h1 
            className="display-1 display-md-1 fw-bold mb-4"
            style={{
              letterSpacing: '-0.02em'
            }}
          >
            Bienvenido a Eden
          </h1>
          <p 
            className="lead fs-3 mb-5 mx-auto" 
            style={{ 
              maxWidth: '42rem',
            }}
          >
            Tu nuevo hogar te espera en el desarrollo inmobiliario más exclusivo
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <button className="btn btn-primary btn-lg px-5">
              Ver Disponibilidad
            </button>
            <button className="btn btn-outline-light btn-lg px-5">
              Agendar Visita
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

