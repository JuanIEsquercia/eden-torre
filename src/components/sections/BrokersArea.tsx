function BrokersArea() {
  return (
    <section className="py-5 bg-primary text-white position-relative overflow-hidden">
      {/* Efecto de fondo decorativo */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          zIndex: 0
        }}
      />
      
      <div className="container px-4 text-center position-relative" style={{ zIndex: 1 }}>
        <h2 className="display-3 display-md-2 fw-bold mb-4">
          ¿Te interesa ofrecer para la venta?
        </h2>
        <p className="fs-4 mb-3 mx-auto fw-light" style={{ maxWidth: '52rem' }}>
          Te dejamos toda la información que necesitas para que puedas
          <span className="fw-bold"> ofrecer y promocionar</span> el proyecto a tus clientes
        </p>
        <p className="fs-5 mb-5 mx-auto opacity-90" style={{ maxWidth: '48rem' }}>
          Contáctate con nosotros para conocer los métodos de trabajo y
          <span className="fw-semibold"> corroborar la información actualizada</span>
        </p>
        <div className="d-flex flex-wrap gap-3 justify-content-center">
          <button className="btn btn-light btn-lg px-5 fw-bold shadow-lg">
            📥 Descargar Kit de Venta
          </button>
          <button className="btn btn-outline-light btn-lg px-5 fw-semibold">
            📋 Ver Materiales Disponibles
          </button>
        </div>
        <div className="mt-4">
          <p className="small opacity-75 mb-0">
            Material actualizado • Información completa • Soporte profesional
          </p>
        </div>
      </div>
    </section>
  )
}

export default BrokersArea

