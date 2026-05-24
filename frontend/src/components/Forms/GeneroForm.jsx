import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import estilos from '../../pages/modules/Admin.module.css'

function GeneroForm({ genero, onGuardar, onCerrar, cargando }) {
  const [form, setForm] = useState({ nombre: '' })
  const [errores, setErrores] = useState({})

  useEffect(() => {
    if (genero) setForm({ nombre: genero.nombre || '' })
  }, [genero])

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setErrores({})
    const resultado = await onGuardar(form, genero?.id)
    if (resultado?.errores) setErrores(resultado.errores)
  }

  return (
    <div className={estilos.modalOverlay} onClick={(e) => e.target === e.currentTarget && onCerrar()}>
      <div className={estilos.modalContenido} style={{ maxWidth: '420px' }}>
        <div className={estilos.modalCabecera}>
          <h2 className={estilos.modalTitulo}>{genero ? 'Editar género' : 'Nuevo género'}</h2>
          <button className="boton boton-secundario boton-sm" onClick={onCerrar}>
            <Icon icon="mdi:close" />
          </button>
        </div>

        <form onSubmit={manejarEnvio}>
          <div className="campo-formulario">
            <label htmlFor="nombre">Nombre del género *</label>
            <input
              id="nombre"
              type="text"
              value={form.nombre}
              onChange={(e) => {
                setForm({ nombre: e.target.value })
                if (errores.nombre) setErrores({})
              }}
              autoFocus
              className={errores.nombre ? 'con-error' : ''}
            />
            {errores.nombre && <span className="mensaje-error-campo">{errores.nombre[0]}</span>}
          </div>

          <div className={estilos.modalAcciones}>
            <button type="button" className="boton boton-secundario" onClick={onCerrar} disabled={cargando}>
              Cancelar
            </button>
            <button type="submit" className="boton boton-primario" disabled={cargando}>
              {cargando ? 'Guardando...' : (genero ? 'Actualizar' : 'Crear género')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GeneroForm
