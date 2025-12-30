function About() {
  return (
    <section className="py-5 bg-surface">
      <div className="container px-4">
        <h2 className="display-3 display-md-2 fw-bold text-center mb-5 text-secondary-custom">
          El Proyecto
        </h2>
        <div className="row g-4 align-items-center">
          <div className="col-md-6">
            <h3 className="h2 fw-semibold mb-4 text-secondary-custom">
              Un proyecto diseñado para ti
            </h3>
            <p className="fs-5 mb-4 text-secondary-custom">
              Eden representa la perfecta combinación entre diseño arquitectónico
              contemporáneo y funcionalidad. Cada espacio ha sido pensado para
              brindar comodidad y elegancia.
            </p>
            <p className="fs-5 text-secondary-custom">
              Ubicado en una zona privilegiada, este desarrollo inmobiliario
              ofrece las mejores amenidades y una calidad de vida excepcional.
            </p>
          </div>
          <div className="col-md-6">
            <div className="rounded overflow-hidden shadow-sm bg-light">
              <img 
                src="/images/frente torre.png" 
                alt="Frente de la torre Eden" 
                className="img-fluid w-100"
                style={{ objectFit: 'contain', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About

