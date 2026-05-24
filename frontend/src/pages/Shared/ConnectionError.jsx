import { Icon } from '@iconify/react'
import estilos from '../modules/ConnectionError.module.css'

function ConnectionError({ onReintentar }) {
  return (
    <main className={estilos.contenedor} role="alert" aria-live="assertive">
      <Icon icon="mdi:wifi-off" className={estilos.icono} />
      <h2 className={estilos.titulo}>No hay conexión con el servidor</h2>
      <p className={estilos.descripcion}>
        No podemos conectar con la librería ahora mismo. Comprueba que el servidor está en marcha y
        que tu conexión funciona correctamente.
      </p>
      {onReintentar && (
        <button className="boton boton-primario" onClick={onReintentar}>
          <Icon icon="mdi:refresh" />
          Reintentar
        </button>
      )}
    </main>
  )
}

export default ConnectionError
