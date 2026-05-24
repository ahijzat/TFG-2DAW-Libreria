import LoadingSpinner from '../../components/UI/LoadingSpinner'
import estilos from '../modules/Loading.module.css'

function Loading({ mensaje = 'Cargando...' }) {
  return (
    <main className={estilos.contenedor} role="main" aria-live="polite">
      <LoadingSpinner mensaje={mensaje} tamaño="lg" />
    </main>
  )
}

export default Loading
