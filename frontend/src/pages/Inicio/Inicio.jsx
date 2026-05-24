import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'
import useFetch from '../../hooks/useFetch'
import API from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import Card from '../../components/UI/Card'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import ConnectionError from '../Shared/ConnectionError'
import { formatearPrecio, truncarTexto } from '../../utils/formatters'
import estilos from '../modules/Inicio.module.css'

function Inicio() {
  const { peticion, loading, error } = useFetch()
  const { usuario } = useAuth()
  const [datos, setDatos] = useState(null)

  useEffect(() => {
    const cargar = async () => {
      const { data } = await peticion(API.inicio())
      if (data) setDatos(data.data || data)
    }
    cargar()
  }, [peticion])

  if (loading) return <LoadingSpinner mensaje="Preparando tu librería..." tamaño="lg" />
  if (error?.sinConexion) return <ConnectionError onReintentar={() => window.location.reload()} />

  const librosDestacados = datos?.libros_destacados || datos?.libros || []
  const generos = datos?.generos || []

  return (
    <main>
      {/* Hero */}
      <section className={estilos.hero}>
        <div className={`contenedor ${estilos.heroContenido}`}>
          <h1 className={estilos.heroTitulo}>
            Tu próxima historia <br />
            <span>te está esperando</span>
          </h1>
          <p className={estilos.heroSubtitulo}>
            Explora cientos de títulos, compra los que te enamoren y disfruta de nuestro servicio
            de préstamos para los lectores más curiosos.
          </p>
          <div className={estilos.heroAcciones}>
            <Link to="/catalogo" className="boton boton-primario boton-lg">
              <Icon icon="mdi:bookshelf" /> Ver catálogo
            </Link>
            <Link to={usuario ? '/perfil' : '/register'} className="boton boton-secundario boton-lg" style={{ borderColor: '#fff', color: '#fff' }}>
              <Icon icon={usuario ? 'mdi:account' : 'mdi:account-plus'} /> {usuario ? 'Mi perfil' : 'Únete gratis'}
            </Link>
          </div>
        </div>
      </section>

      {/* Propuestas de valor */}
      <section className={`contenedor ${estilos.propuestas}`}>
        <div className={estilos.propuestaGrid}>
          <Card variante="plana" className={estilos.propuestaTarjeta}>
            <Icon icon="mdi:cart-check" className={estilos.propuestaIcono} />
            <h3>Compra fácil</h3>
            <p>Añade libros al carrito y finaliza tu pedido en segundos.</p>
          </Card>
          <Card variante="plana" className={estilos.propuestaTarjeta}>
            <Icon icon="mdi:book-clock" className={estilos.propuestaIcono} />
            <h3>Préstamos físicos</h3>
            <p>¿Quieres leer sin comprar? Solicita un préstamo y devuélvelo cuando quieras.</p>
          </Card>
          <Card variante="plana" className={estilos.propuestaTarjeta}>
            <Icon icon="mdi:shield-check" className={estilos.propuestaIcono} />
            <h3>Tu cuenta segura</h3>
            <p>Consulta tu historial de compras, préstamos y multas en cualquier momento.</p>
          </Card>
        </div>
      </section>

      {/* Libros destacados */}
      {librosDestacados.length > 0 && (
        <section className={`contenedor ${estilos.seccion}`}>
          <div className={estilos.cabeceraSección}>
            <h2>Libros destacados</h2>
            <Link to="/catalogo" className={estilos.verTodos}>
              Ver todos <Icon icon="mdi:arrow-right" />
            </Link>
          </div>
          <div className={estilos.gridLibros}>
            {librosDestacados.slice(0, 8).map((libro) => (
              <TarjetaLibroPequeña key={libro.id} libro={libro} />
            ))}
          </div>
        </section>
      )}

      {/* Géneros */}
      {generos.length > 0 && (
        <section className={estilos.seccionGeneros}>
          <div className="contenedor">
            <h2 className={estilos.tituloSeccionGeneros}>Explorar por género</h2>
            <div className={estilos.gridGeneros}>
              {generos.slice(0, 8).map((genero) => (
                <Link
                  key={genero.id}
                  to={`/catalogo?genero=${genero.id}`}
                  className={estilos.tarjetaGenero}
                >
                  <Icon icon="mdi:tag-outline" />
                  <span>{genero.nombre}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

function TarjetaLibroPequeña({ libro }) {
  return (
    <Link to={`/libros/${libro.id}`} className={estilos.tarjetaLibroLink}>
      <Card variante="normal" className={estilos.tarjetaLibro}>
        <div className={estilos.portada}>
          {libro.imagen ? (
            <img src={libro.imagen} alt={libro.titulo} className={estilos.imagenPortada} />
          ) : (
            <div className={estilos.portadaPlaceholder}>
              <Icon icon="mdi:book-open-variant" />
            </div>
          )}
        </div>
        <div className={estilos.infoLibro}>
          <p className={estilos.tituloLibro}>{truncarTexto(libro.titulo, 50)}</p>
          <p className={estilos.autorLibro}>{libro.autor}</p>
          <p className={estilos.precioLibro}>{formatearPrecio(libro.precio)}</p>
        </div>
      </Card>
    </Link>
  )
}

export default Inicio
