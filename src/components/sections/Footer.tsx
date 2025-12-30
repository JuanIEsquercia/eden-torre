function Footer() {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container px-4">
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <h3 className="h5 fw-semibold mb-3">Eden</h3>
            <p className="text-white-50 mb-0">
              Tu nuevo hogar te espera en el desarrollo inmobiliario más
              exclusivo.
            </p>
          </div>
          <div className="col-md-4">
            <h4 className="h6 fw-semibold mb-3">Contacto</h4>
            <ul className="list-unstyled text-white-50 mb-0">
              <li className="mb-2">📧 info@eden.com</li>
              <li className="mb-2">📞 +1 (555) 123-4567</li>
              <li>📍 Dirección del proyecto</li>
            </ul>
          </div>
          <div className="col-md-4">
            <h4 className="h6 fw-semibold mb-3">Síguenos</h4>
            <div className="d-flex gap-3">
              <a 
                href="#" 
                className="text-white-50 text-decoration-none"
                onMouseOver={(e) => e.currentTarget.classList.add('text-white')}
                onMouseOut={(e) => e.currentTarget.classList.remove('text-white')}
              >
                Facebook
              </a>
              <a 
                href="#" 
                className="text-white-50 text-decoration-none"
                onMouseOver={(e) => e.currentTarget.classList.add('text-white')}
                onMouseOut={(e) => e.currentTarget.classList.remove('text-white')}
              >
                Instagram
              </a>
              <a 
                href="#" 
                className="text-white-50 text-decoration-none"
                onMouseOver={(e) => e.currentTarget.classList.add('text-white')}
                onMouseOut={(e) => e.currentTarget.classList.remove('text-white')}
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="border-top border-white border-opacity-20 pt-4 text-center text-white-50">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Eden. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

