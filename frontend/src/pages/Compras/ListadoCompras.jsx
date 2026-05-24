import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'
import useFetch from '../../hooks/useFetch'
import API from '../../services/api'
import Card from '../../components/UI/Card'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import EstadoVacio from '../../components/UI/EstadoVacio'
import BadgeEstado from '../../components/UI/BadgeEstado'
import { formatearFecha, formatearPrecio, etiquetaEstadoCompra } from '../../utils/formatters'
import estilos from '../modules/Compras.module.css'

function ListadoCompras() {
  const { peticion, loading } = useFetch()
  const [compras, setCompras] = useState([])
  const [expandida, setExpandida] = useState(null)
  const [detalles, setDetalles] = useState({})
  const fetchDetalles = useFetch()

  useEffect(() => {
    peticion(API.compras()).then(({ data }) => {
      if (data) setCompras(data.data || data || [])
    })
  }, [peticion])

  const toggleExpandir = async (id) => {
    if (expandida === id) { setExpandida(null); return }
    setExpandida(id)
    if (!detalles[id]) {
      const { data } = await fetchDetalles.peticion(API.compraDetalles(id))
      if (data) setDetalles((d) => ({ ...d, [id]: data.data || data || [] }))
    }
  }

  if (loading) return <LoadingSpinner mensaje="Cargando compras..." />

  return (
    <main className={`contenedor ${estilos.pagina}`}>
      <h1 className={estilos.titulo}>Mis compras</h1>

      {compras.length === 0 ? (
        <EstadoVacio
          icono="mdi:shopping-outline"
          titulo="Aún no has realizado compras"
          descripcion="Explora el catálogo y realiza tu primer pedido."
        />
      ) : (
        <div className={estilos.lista}>
          {compras.map((compra) => (
            <Card variante="normal" key={compra.id} className={estilos.tarjeta}>
              <div className={estilos.cabeceraCompra}>
                <div className={estilos.infoCompra}>
                  <span className={estilos.idCompra}>Pedido #{compra.id}</span>
                  <span className={estilos.fechaCompra}>
                    <Icon icon="mdi:calendar" /> {formatearFecha(compra.created_at)}
                  </span>
                </div>
                <div className={estilos.derechaCompra}>
                  <BadgeEstado
                    estado={compra.estado}
                    etiqueta={etiquetaEstadoCompra(compra.estado)}
                  />
                  <span className={estilos.totalCompra}>{formatearPrecio(compra.total)}</span>
                  <button
                    className="boton boton-secundario boton-sm"
                    onClick={() => toggleExpandir(compra.id)}
                  >
                    <Icon icon={expandida === compra.id ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
                    {expandida === compra.id ? 'Ocultar' : 'Ver detalles'}
                  </button>
                </div>
              </div>

              {expandida === compra.id && (
                <div className={estilos.detalles}>
                  {fetchDetalles.loading ? (
                    <LoadingSpinner tamaño="sm" />
                  ) : (
                    <ul className={estilos.listaDetalles}>
                      {(detalles[compra.id] || []).map((d) => (
                        <li key={d.id} className={estilos.itemDetalle}>
                          <Link to={`/libros/${d.libro_id}`} className={estilos.tituloDetalle}>
                            {d.libro?.titulo || `Libro #${d.libro_id}`}
                          </Link>
                          <span className={estilos.cantidadDetalle}>x{d.cantidad}</span>
                          <span className={estilos.precioDetalle}>{formatearPrecio(d.precio_unitario)}</span>
                          <span className={estilos.subtotalDetalle}>{formatearPrecio(parseFloat(d.precio_unitario) * d.cantidad)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}

export default ListadoCompras
