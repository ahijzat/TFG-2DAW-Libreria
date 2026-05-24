import { useId } from 'react'
import { Icon } from '@iconify/react'
import estilos from '../../pages/modules/SearchInput.module.css'

function SearchInput({ valor, onChange, placeholder = 'Buscar...', onLimpiar }) {
  const id = useId()

  return (
    <div className={estilos.contenedor} role="search">
      <label htmlFor={id} className="oculto-visualmente">
        {placeholder}
      </label>
      <Icon icon="mdi:magnify" className={estilos.iconoBuscar} aria-hidden="true" />
      <input
        id={id}
        type="search"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={estilos.input}
        autoComplete="off"
      />
      {valor && (
        <button className={estilos.botonLimpiar} onClick={onLimpiar} aria-label="Limpiar búsqueda">
          <Icon icon="mdi:close-circle" />
        </button>
      )}
    </div>
  )
}

export default SearchInput
