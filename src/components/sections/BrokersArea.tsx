function BrokersArea() {
  return (
    <section className="py-5 bg-primary text-white">
      <div className="container px-4 text-center">
        <h2 className="display-3 display-md-2 fw-bold mb-4">
          Área de Colegas
        </h2>
        <p className="fs-5 fs-md-4 mb-4 mx-auto opacity-75" style={{ maxWidth: '48rem' }}>
          Descarga el kit completo de venta con toda la información que
          necesitas para promocionar el proyecto
        </p>
        <div className="d-flex flex-wrap gap-3 justify-content-center">
          <button className="btn btn-light btn-lg px-5">
            📥 Descargar Kit de Venta
          </button>
          <button className="btn btn-outline-light btn-lg px-5">
            📋 Ver Materiales
          </button>
        </div>
      </div>
    </section>
  )
}

export default BrokersArea

