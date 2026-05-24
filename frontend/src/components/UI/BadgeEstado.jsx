import { varianteEstado } from '../../utils/formatters'
import estilos from '../../pages/modules/BadgeEstado.module.css'

/**
 * Badge visual para estados de préstamos, compras y multas.
 */
function BadgeEstado({ estado, etiqueta }) {
  const variante = varianteEstado(estado)
  return (
    <span className={`${estilos.badge} ${estilos[variante]}`}>
      {etiqueta || estado || '—'}
    </span>
  )
}

export default BadgeEstado
