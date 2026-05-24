import estilos from '../../pages/modules/Card.module.css'

/**
 * Card reutilizable.
 * Variantes: 'normal' (defecto), 'elevada', 'plana', 'destacada'
 */
function Card({ children, variante = 'normal', className = '', onClick, role, ...props }) {
  const clases = [
    estilos.tarjeta,
    estilos[`variante-${variante}`],
    onClick ? estilos.interactiva : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={clases}
      onClick={onClick}
      role={role || (onClick ? 'button' : undefined)}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
