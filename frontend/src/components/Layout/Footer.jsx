import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'
import estilos from '../../pages/modules/Footer.module.css'

function Footer() {
  return (
    <footer className={estilos.pie}>
      <div className={`contenedor ${estilos.contenido}`}>
        <div className={estilos.columna}>
          <div className={estilos.marca}>
            <Icon icon="mdi:book-open-page-variant" />
            <span>Biblium</span>
          </div>
          <p className={estilos.descripcion}>
            Tu librería de confianza, con una amplia selección de títulos y servicio de préstamos
            para los lectores más asiduos.
          </p>
        </div>

        <div className={estilos.columna}>
          <h4 className={estilos.tituloColumna}>Catálogo</h4>
          <ul>
            <li><Link to="/catalogo">Todos los libros</Link></li>
            <li><Link to="/catalogo?nuevo=true">Novedades</Link></li>
          </ul>
        </div>

        <div className={estilos.columna}>
          <h4 className={estilos.tituloColumna}>Biblium</h4>
          <ul>
            <li><Link to="/sobre-nosotros">Sobre nosotros</Link></li>
            <li><Link to="/terminos">Términos y condiciones</Link></li>
          </ul>
        </div>
      </div>

      <div className={estilos.derechos}>
        <p>© {new Date().getFullYear()} Biblium. Hecho con mucho café y buenas lecturas.</p>
      </div>
    </footer>
  )
}

export default Footer
