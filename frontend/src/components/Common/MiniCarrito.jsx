import { useState } from 'react'
import { Icon } from '@iconify/react'
import { useCarrito } from '../../contexts/CarritoContext'
import { formatearPrecio } from '../../utils/formatters'
import LoadingSpinner from '../UI/LoadingSpinner'
import estilos from '../../pages/modules/MiniCarrito.module.css'

function MiniCarrito({ onCerrar, onIrCheckout }) {
  const { items, cargandoCarrito, totalPrecio, actualizarCantidad, eliminarItem, vaciarCarrito } =
    useCarrito()
  const [ocupado, setOcupado] = useState(null)

  const manejarCambiarCantidad = async (item, delta) => {
    const nuevaCantidad = item.cantidad + delta
    if (ocupado === item.id) return
    setOcupado(item.id)
    if (nuevaCantidad < 1) {
      await eliminarItem(item.id)
    } else {
      await actualizarCantidad(item.id, nuevaCantidad)
    }
    setOcupado(null)
  }

  const manejarEliminar = async (detalleId) => {
    if (ocupado === detalleId) return
    setOcupado(detalleId)
    await eliminarItem(detalleId)
    setOcupado(null)
  }

  const manejarVaciar = async () => {
    if (ocupado === 'vaciar') return
    setOcupado('vaciar')
    await vaciarCarrito()
    setOcupado(null)
  }

  const subtotalItem = (item) =>
    parseFloat(item.precio_unitario ?? item.libro?.precio ?? 0) * item.cantidad

  return (
    <div className={estilos.contenedor} role="region" aria-label="Carrito de compra">
      <div className={estilos.panel}>
        <div className={estilos.encabezado}>
          <h3 className={estilos.titulo}>Tu carrito</h3>
          <button className={estilos.botonCerrar} onClick={onCerrar} aria-label="Cerrar carrito">
            <Icon icon="mdi:close" />
          </button>
        </div>

        {cargandoCarrito ? (
          <LoadingSpinner mensaje="Cargando carrito..." tamaño="sm" />
        ) : items.length === 0 ? (
          <div className={estilos.vacio}>
            <Icon icon="mdi:cart-outline" className={estilos.iconoVacio} />
            <p>Tu carrito está vacío.</p>
            <button className="boton boton-secundario boton-sm" onClick={onCerrar}>
              Ir al catálogo
            </button>
          </div>
        ) : (
          <>
            <ul className={estilos.listaItems}>
              {items.map((item) => {
                const enOperacion = ocupado === item.id
                return (
                  <li key={item.id} className={`${estilos.item} ${enOperacion ? estilos.itemOcupado : ''}`}>
                    <div className={estilos.infoLibro}>
                      <p className={estilos.tituloLibro}>
                        {item.libro?.titulo ?? item.titulo ?? 'Libro'}
                      </p>
                      <p className={estilos.precioLibro}>
                        {formatearPrecio(item.precio_unitario ?? item.libro?.precio)} c/u
                      </p>
                    </div>

                    <div className={estilos.controles}>
                      <button
                        className={estilos.botonCantidad}
                        onClick={() => manejarCambiarCantidad(item, -1)}
                        disabled={enOperacion}
                        aria-label="Reducir cantidad"
                        title={item.cantidad === 1 ? 'Eliminar del carrito' : 'Reducir cantidad'}
                      >
                        <Icon icon={item.cantidad === 1 ? 'mdi:trash-can-outline' : 'mdi:minus'} />
                      </button>
                      <span className={estilos.cantidad}>{item.cantidad}</span>
                      <button
                        className={estilos.botonCantidad}
                        onClick={() => manejarCambiarCantidad(item, +1)}
                        disabled={enOperacion}
                        aria-label="Aumentar cantidad"
                      >
                        <Icon icon="mdi:plus" />
                      </button>
                    </div>

                    <div className={estilos.subtotalItem}>
                      {formatearPrecio(subtotalItem(item))}
                    </div>

                    <button
                      className={estilos.botonEliminar}
                      onClick={() => manejarEliminar(item.id)}
                      disabled={enOperacion}
                      aria-label="Eliminar del carrito"
                    >
                      <Icon icon="mdi:trash-can-outline" />
                    </button>
                  </li>
                )
              })}
            </ul>

            <div className={estilos.resumen}>
              <div className={estilos.total}>
                <span>Total</span>
                <strong>{formatearPrecio(totalPrecio)}</strong>
              </div>
              <button
                className="boton boton-primario"
                style={{ width: '100%' }}
                onClick={onIrCheckout}
                disabled={ocupado !== null}
              >
                Finalizar compra
              </button>
              <button
                className="boton boton-texto boton-sm"
                style={{ width: '100%', marginTop: '0.25rem' }}
                onClick={manejarVaciar}
                disabled={ocupado !== null}
              >
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default MiniCarrito
