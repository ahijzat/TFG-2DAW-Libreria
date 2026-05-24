import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { toast } from 'react-toastify'
import useFetch from '../../hooks/useFetch'
import API from '../../services/api'
import { useCarrito } from '../../contexts/CarritoContext'
import { useAuth } from '../../contexts/AuthContext'
import Card from '../../components/UI/Card'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import { formatearPrecio, formatearFecha } from '../../utils/formatters'
import estilos from '../modules/DetalleLibro.module.css'

function DetalleLibro() {
  const { id } = useParams()
  const { peticion, loading } = useFetch()
  const { agregarAlCarrito } = useCarrito()
  const { usuario } = useAuth()
  const [libro, setLibro] = useState(null)
  const [cantidad, setCantidad] = useState(1)
  const [añadiendo, setAñadiendo] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const cargar = async () => {
      const { data } = await peticion(API.libroDetalle(id))
      if (data) setLibro(data.data || data)
    }
    cargar()
  }, [id, peticion])

  const manejarAgregarCarrito = async () => {
    setAñadiendo(true)
    await agregarAlCarrito(libro.id, cantidad, libro)
    setAñadiendo(false)
  }

  if (loading) return <LoadingSpinner mensaje="Cargando libro..." />

  if (!libro) return (
    <div className={`contenedor ${estilos.pagina}`}>
      <p className={estilos.sinResultado}>No se encontró el libro.</p>
    </div>
  )

  return (
    <main className={`contenedor ${estilos.pagina}`}>
      <button
        className={`boton boton-secundario boton-sm ${estilos.botonVolver}`}
        onClick={() => navigate(-1)}
      >
        <Icon icon="mdi:arrow-left" /> Volver
      </button>

      <div className={estilos.contenido}>
        {/* Portada */}
        <div className={estilos.portadaContenedor}>
          <Card variante="normal" className={estilos.portada}>
            {libro.imagen ? (
              <img src={libro.imagen} alt={libro.titulo} className={estilos.imagen} />
            ) : (
              <div className={estilos.portadaPlaceholder}>
                <Icon icon="mdi:book-open-variant" />
              </div>
            )}
          </Card>
        </div>

        {/* Info principal */}
        <div className={estilos.infoContenedor}>
          {/* Géneros */}
          {libro.generos?.length > 0 && (
            <div className={estilos.generos}>
              {libro.generos.map((g) => (
                <span key={g.id} className={estilos.generoTag}>{g.nombre}</span>
              ))}
            </div>
          )}

          <h1 className={estilos.titulo}>{libro.titulo}</h1>
          <p className={estilos.autor}>
            <Icon icon="mdi:account-edit" /> {libro.autor}
          </p>
          {libro.editorial && (
            <p className={estilos.editorial}>
              <Icon icon="mdi:office-building" /> {libro.editorial}
            </p>
          )}

          {libro.descripcion && (
            <p className={estilos.descripcion}>{libro.descripcion}</p>
          )}

          {/* Metadatos */}
          <Card variante="plana" className={estilos.metadatos}>
            {libro.isbn && (
              <div className={estilos.meta}>
                <span className={estilos.metaEtiqueta}>ISBN</span>
                <span>{libro.isbn}</span>
              </div>
            )}
            {libro.fecha_publicacion && (
              <div className={estilos.meta}>
                <span className={estilos.metaEtiqueta}>Publicado</span>
                <span>{formatearFecha(libro.fecha_publicacion)}</span>
              </div>
            )}
            <div className={estilos.meta}>
              <span className={estilos.metaEtiqueta}>Stock venta</span>
              <span>{libro.stock_venta ?? 0} unidades</span>
            </div>
            <div className={estilos.meta}>
              <span className={estilos.metaEtiqueta}>Stock préstamo</span>
              <span>{libro.stock_prestamo ?? 0} unidades</span>
            </div>
          </Card>

          {/* Panel de compra */}
          <Card variante="elevada" className={estilos.panelCompra}>
            <p className={estilos.precio}>{formatearPrecio(libro.precio)}</p>

            {libro.stock_venta > 0 ? (
              <>
                <div className={estilos.controlesCanTidad}>
                  <label className={estilos.etiquetaCantidad}>Cantidad:</label>
                  <div className={estilos.selector}>
                    <button
                      className={estilos.botonCantidad}
                      onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                      disabled={cantidad <= 1}
                      aria-label="Reducir cantidad"
                    >
                      <Icon icon="mdi:minus" />
                    </button>
                    <span className={estilos.cantidadActual}>{cantidad}</span>
                    <button
                      className={estilos.botonCantidad}
                      onClick={() => setCantidad((c) => Math.min(libro.stock_venta, c + 1))}
                      disabled={cantidad >= libro.stock_venta}
                      aria-label="Aumentar cantidad"
                    >
                      <Icon icon="mdi:plus" />
                    </button>
                  </div>
                </div>
                <button
                  className="boton boton-primario boton-lg"
                  style={{ width: '100%' }}
                  onClick={manejarAgregarCarrito}
                  disabled={añadiendo || !usuario}
                  title={!usuario ? 'Inicia sesión para añadir al carrito' : undefined}
                >
                  <Icon icon="mdi:cart-plus" />
                  {añadiendo ? 'Añadiendo...' : 'Añadir al carrito'}
                </button>
                {!usuario && (
                  <p style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    <Link to="/login">Inicia sesión</Link> para añadir al carrito
                  </p>
                )}
              </>
            ) : (
              <p className={estilos.sinStock}>
                <Icon icon="mdi:close-circle-outline" /> Sin stock disponible
              </p>
            )}
          </Card>
        </div>
      </div>
    </main>
  )
}

export default DetalleLibro
