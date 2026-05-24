import estilos from '../../pages/modules/EstadoVacio.module.css'
import { Icon } from '@iconify/react'

function EstadoVacio({ icono = 'mdi:bookshelf', titulo = 'Nada por aquí', descripcion = '' }) {
  return (
    <div className={estilos.contenedor} role="status">
      <Icon icon={icono} className={estilos.icono} />
      <p className={estilos.titulo}>{titulo}</p>
      {descripcion && <p className={estilos.descripcion}>{descripcion}</p>}
    </div>
  )
}

export default EstadoVacio
