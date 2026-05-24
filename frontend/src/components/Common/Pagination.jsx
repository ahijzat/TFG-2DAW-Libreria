import estilos from '../../pages/modules/Pagination.module.css'
import { Icon } from '@iconify/react'

function Pagination({ paginaActual, totalPaginas, onCambiarPagina }) {
  if (totalPaginas <= 1) return null

  const paginas = []
  const maxVisibles = 5
  let inicio = Math.max(1, paginaActual - 2)
  let fin = Math.min(totalPaginas, inicio + maxVisibles - 1)
  if (fin - inicio < maxVisibles - 1) {
    inicio = Math.max(1, fin - maxVisibles + 1)
  }

  for (let i = inicio; i <= fin; i++) {
    paginas.push(i)
  }

  return (
    <nav className={estilos.navegacion} aria-label="Paginación">
      <button
        className={estilos.boton}
        onClick={() => onCambiarPagina(paginaActual - 1)}
        disabled={paginaActual === 1}
        aria-label="Página anterior"
      >
        <Icon icon="mdi:chevron-left" />
      </button>

      {inicio > 1 && (
        <>
          <button className={estilos.boton} onClick={() => onCambiarPagina(1)}>1</button>
          {inicio > 2 && <span className={estilos.puntos}>…</span>}
        </>
      )}

      {paginas.map((num) => (
        <button
          key={num}
          className={`${estilos.boton} ${num === paginaActual ? estilos.activo : ''}`}
          onClick={() => onCambiarPagina(num)}
          aria-current={num === paginaActual ? 'page' : undefined}
        >
          {num}
        </button>
      ))}

      {fin < totalPaginas && (
        <>
          {fin < totalPaginas - 1 && <span className={estilos.puntos}>…</span>}
          <button className={estilos.boton} onClick={() => onCambiarPagina(totalPaginas)}>
            {totalPaginas}
          </button>
        </>
      )}

      <button
        className={estilos.boton}
        onClick={() => onCambiarPagina(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
        aria-label="Página siguiente"
      >
        <Icon icon="mdi:chevron-right" />
      </button>
    </nav>
  )
}

export default Pagination
