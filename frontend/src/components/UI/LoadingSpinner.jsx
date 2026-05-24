import estilos from '../../pages/modules/LoadingSpinner.module.css'

function LoadingSpinner({ mensaje = 'Cargando...', tamaño = 'md' }) {
  return (
    <div className={`${estilos.contenedor} ${estilos[`tamaño-${tamaño}`]}`} role="status" aria-label={mensaje}>
      <div className={estilos.rueda} />
      {mensaje && <p className={estilos.texto}>{mensaje}</p>}
    </div>
  )
}

export default LoadingSpinner
