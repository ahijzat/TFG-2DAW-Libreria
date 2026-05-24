import { useState } from 'react'
import { Icon } from '@iconify/react'
import useFetch from '../../hooks/useFetch'
import API from '../../services/api'
import estilos from '../../pages/modules/Admin.module.css'

function PrestamoForm({ onGuardar, onCerrar, cargando }) {
  const [form, setForm] = useState({
    usuario_id: '',
    libro_id: '',
    fecha_devolucion_prevista: '',
  })
  const [errores, setErrores] = useState({})
  const [busquedaUsuario, setBusquedaUsuario] = useState('')
  const [usuarios, setUsuarios] = useState([])
  const [busquedaLibro, setBusquedaLibro] = useState('')
  const [libros, setLibros] = useState([])
  const fetchUsuarios = useFetch()
  const fetchLibros = useFetch()

  const buscarUsuarios = async (q) => {
    setBusquedaUsuario(q)
    if (q.length < 2) { setUsuarios([]); return }
    const { data } = await fetchUsuarios.peticion(`${API.admin.usuarios()}?busqueda=${encodeURIComponent(q)}`)
    if (data) setUsuarios(data.data || data || [])
  }

  const buscarLibros = async (q) => {
    setBusquedaLibro(q)
    if (q.length < 2) { setLibros([]); return }
    const { data } = await fetchLibros.peticion(`${API.admin.libros()}?busqueda=${encodeURIComponent(q)}`)
    if (data) setLibros(data.data || data || [])
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setErrores({})
    const resultado = await onGuardar(form)
    if (resultado?.errores) setErrores(resultado.errores)
  }

  return (
    <div className={estilos.modalOverlay} onClick={(e) => e.target === e.currentTarget && onCerrar()}>
      <div className={estilos.modalContenido}>
        <div className={estilos.modalCabecera}>
          <h2 className={estilos.modalTitulo}>Nuevo préstamo</h2>
          <button className="boton boton-secundario boton-sm" onClick={onCerrar}>
            <Icon icon="mdi:close" />
          </button>
        </div>

        <form onSubmit={manejarEnvio}>
          {/* Usuario */}
          <div className="campo-formulario">
            <label htmlFor="buscarUsuario">Usuario *</label>
            <input
              id="buscarUsuario"
              type="text"
              placeholder="Buscar usuario por nombre o email..."
              value={busquedaUsuario}
              onChange={(e) => buscarUsuarios(e.target.value)}
              className={errores.usuario_id ? 'con-error' : ''}
              autoComplete="off"
            />
            {errores.usuario_id && <span className="mensaje-error-campo">{errores.usuario_id[0]}</span>}
            {usuarios.length > 0 && (
              <ul style={{ listStyle: 'none', border: '1px solid var(--color-borde)', borderRadius: 'var(--radio-sm)', marginTop: '4px', maxHeight: '140px', overflowY: 'auto' }}>
                {usuarios.map((u) => (
                  <li key={u.id}>
                    <button
                      type="button"
                      style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: 'var(--texto-sm)' }}
                      onClick={() => {
                        setForm((p) => ({ ...p, usuario_id: u.id }))
                        setBusquedaUsuario(`${u.name} (${u.email})`)
                        setUsuarios([])
                      }}
                    >
                      {u.name} — {u.email}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {form.usuario_id && (
              <span style={{ fontSize: 'var(--texto-xs)', color: 'var(--color-exito)' }}>
                <Icon icon="mdi:check" /> Usuario seleccionado (ID: {form.usuario_id})
              </span>
            )}
          </div>

          {/* Libro */}
          <div className="campo-formulario">
            <label htmlFor="buscarLibro">Libro *</label>
            <input
              id="buscarLibro"
              type="text"
              placeholder="Buscar libro por título..."
              value={busquedaLibro}
              onChange={(e) => buscarLibros(e.target.value)}
              className={errores.libro_id ? 'con-error' : ''}
              autoComplete="off"
            />
            {errores.libro_id && <span className="mensaje-error-campo">{errores.libro_id[0]}</span>}
            {libros.length > 0 && (
              <ul style={{ listStyle: 'none', border: '1px solid var(--color-borde)', borderRadius: 'var(--radio-sm)', marginTop: '4px', maxHeight: '140px', overflowY: 'auto' }}>
                {libros.map((l) => (
                  <li key={l.id}>
                    <button
                      type="button"
                      style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: 'var(--texto-sm)' }}
                      onClick={() => {
                        setForm((p) => ({ ...p, libro_id: l.id }))
                        setBusquedaLibro(`${l.titulo} — ${l.autor}`)
                        setLibros([])
                      }}
                    >
                      {l.titulo} — {l.autor}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {form.libro_id && (
              <span style={{ fontSize: 'var(--texto-xs)', color: 'var(--color-exito)' }}>
                <Icon icon="mdi:check" /> Libro seleccionado (ID: {form.libro_id})
              </span>
            )}
          </div>

          <div className="campo-formulario">
            <label htmlFor="fecha_devolucion_prevista">Fecha prevista de devolución *</label>
            <input
              id="fecha_devolucion_prevista"
              type="date"
              value={form.fecha_devolucion_prevista}
              onChange={(e) => setForm((p) => ({ ...p, fecha_devolucion_prevista: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              className={errores.fecha_devolucion_prevista ? 'con-error' : ''}
            />
            {errores.fecha_devolucion_prevista && (
              <span className="mensaje-error-campo">{errores.fecha_devolucion_prevista[0]}</span>
            )}
          </div>

          <div className={estilos.modalAcciones}>
            <button type="button" className="boton boton-secundario" onClick={onCerrar} disabled={cargando}>
              Cancelar
            </button>
            <button type="submit" className="boton boton-primario" disabled={cargando}>
              {cargando ? 'Creando...' : 'Crear préstamo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PrestamoForm
