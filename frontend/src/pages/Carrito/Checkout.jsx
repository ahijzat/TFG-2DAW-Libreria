import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Icon } from '@iconify/react'
import { useCarrito } from '../../contexts/CarritoContext'
import useFetch from '../../hooks/useFetch'
import API from '../../services/api'
import Card from '../../components/UI/Card'
import EstadoVacio from '../../components/UI/EstadoVacio'
import { formatearPrecio } from '../../utils/formatters'
import estilos from '../modules/Checkout.module.css'

function Checkout() {
  const { items, totalPrecio, vaciarCarrito } = useCarrito()
  const { peticion, loading } = useFetch()
  const navigate = useNavigate()

  const confirmarCompra = async () => {
    const { data, error } = await peticion(API.checkout(), {
      method: 'POST',
      body: JSON.stringify({}),
    })

    if (error?.status === 422) {
      toast.error('Revisa los datos del carrito antes de continuar.')
      return
    }

    if (error) return

    if (data) {
      await vaciarCarrito()
      toast.success('¡Compra realizada con éxito! Gracias por tu pedido.')
      navigate('/compras')
    }
  }

  if (items.length === 0) {
    return (
      <main className={`contenedor ${estilos.pagina}`}>
        <EstadoVacio
          icono="mdi:cart-outline"
          titulo="Tu carrito está vacío"
          descripcion="Añade libros desde el catálogo antes de finalizar la compra."
        />
        <div className={estilos.accionVolver}>
          <button className="boton boton-primario" onClick={() => navigate('/catalogo')}>
            <Icon icon="mdi:bookshelf" /> Ir al catálogo
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className={`contenedor ${estilos.pagina}`}>
      <h1 className={estilos.titulo}>Resumen del pedido</h1>

      <div className={estilos.layout}>
        {/* Lista de items */}
        <Card variante="normal" className={estilos.listaCard}>
          <h2 className={estilos.subtitulo}>Artículos</h2>
          <ul className={estilos.items}>
            {items.map((item) => (
              <li key={item.id} className={estilos.item}>
                <div className={estilos.infoItem}>
                  <p className={estilos.tituloItem}>{item.libro?.titulo || 'Libro'}</p>
                  <p className={estilos.autorItem}>{item.libro?.autor}</p>
                </div>
                <div className={estilos.cantidadItem}>
                  <span className={estilos.etiquetaCantidad}>x{item.cantidad}</span>
                  <span className={estilos.subtotalItem}>
                    {formatearPrecio(parseFloat(item.precio_unitario || item.libro?.precio || 0) * item.cantidad)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Resumen total */}
        <Card variante="elevada" className={estilos.resumenCard}>
          <h2 className={estilos.subtitulo}>Resumen</h2>

          <div className={estilos.lineaResumen}>
            <span>Subtotal</span>
            <span>{formatearPrecio(totalPrecio)}</span>
          </div>
          <div className={estilos.lineaResumen}>
            <span>Gastos de envío</span>
            <span className={estilos.gratis}>Gratis</span>
          </div>
          <div className={`${estilos.lineaResumen} ${estilos.total}`}>
            <strong>Total</strong>
            <strong>{formatearPrecio(totalPrecio)}</strong>
          </div>

          <button
            className="boton boton-primario boton-lg"
            style={{ width: '100%', marginTop: 'var(--espacio-lg)' }}
            onClick={confirmarCompra}
            disabled={loading}
          >
            <Icon icon="mdi:check-circle" />
            {loading ? 'Procesando...' : 'Confirmar pedido'}
          </button>

          <button
            className="boton boton-secundario"
            style={{ width: '100%', marginTop: 'var(--espacio-sm)' }}
            onClick={() => navigate('/catalogo')}
            disabled={loading}
          >
            Seguir comprando
          </button>
        </Card>
      </div>
    </main>
  )
}

export default Checkout
