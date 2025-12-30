function Amenities() {
  const amenities = [
    {
      icon: '🔥',
      title: 'Zona de Parrilla',
      description: 'Espacio equipado para asados y reuniones',
    },
    {
      icon: '🏊',
      title: 'Piscina al Aire Libre',
      description: 'Piscina para disfrutar del verano',
    },
    {
      icon: '☀️',
      title: 'Solárium',
      description: 'Área para tomar sol y relajarse',
    },
    {
      icon: '🏡',
      title: 'Pérgola + Living',
      description: 'Espacio cubierto con área de living',
    },
    {
      icon: '🚿',
      title: 'Baño Social',
      description: 'Baño para uso común de las amenidades',
    },
  ]

  return (
    <section className="py-5 bg-background">
      <div className="container px-4">
        <h2 className="display-3 display-md-2 fw-bold text-center mb-2 text-secondary-custom">
          Amenidades
        </h2>
        <p className="text-center text-secondary-custom mb-5">
          Un espacio funcional diseñado para el confort y la recreación de sus residentes
        </p>

        {/* Información destacada */}
        <div className="row mb-5">
          <div className="col-md-6 mb-3 mb-md-0">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4 text-center">
                <h4 className="h5 fw-bold text-primary mb-2">Superficie Total</h4>
                <p className="fs-3 fw-semibold text-secondary-custom mb-0">110 m²</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4 text-center">
                <h4 className="h5 fw-bold text-primary mb-2">Vistas Panorámicas</h4>
                <p className="fs-5 fw-semibold text-secondary-custom mb-0">Al Río Paraná</p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de amenidades */}
        <div className="row g-4">
          {amenities.map((amenity, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body p-4 text-center">
                  <div className="display-4 mb-3">{amenity.icon}</div>
                  <h3 className="h5 fw-semibold mb-2 text-secondary-custom">
                    {amenity.title}
                  </h3>
                  <p className="text-secondary-custom mb-0 small">{amenity.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Información de la constructora */}
        <div className="mt-5 pt-4 border-top">
          <div className="text-center">
            <h4 className="h6 fw-bold text-secondary-custom mb-2">VITASRL</h4>
            <p className="text-muted small mb-0">
              Ingeniería - Construcción | Diseño - Obras
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Amenities

