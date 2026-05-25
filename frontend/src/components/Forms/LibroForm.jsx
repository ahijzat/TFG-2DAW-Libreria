import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import useFetch from '../../hooks/useFetch'
import API from '../../services/api'
import estilos from '../../pages/modules/Admin.module.css'

function LibroForm({ libro, onGuardar, onCerrar, cargando }) {
  const [form, setForm] = useState({
    titulo: '',
    autor: '',
    editorial: '',
    isbn: '',
    descripcion: '',
    precio: '',
    stock_venta: '',
    stock_prestamo: '',
    fecha_publicacion: '',
    imagen: '',
  })
  const [errores, setErrores] = useState({})
  const [generos, setGeneros] = useState([])
  const [generosSeleccionados, setGenerosSeleccionados] = useState([])
  const { peticion } = useFetch()

  useEffect(() => {
    if (libro) {
      setForm({
        titulo: libro.titulo || '',
        autor: libro.autor || '',
        editorial: libro.editorial || '',
        isbn: libro.isbn || '',
        descripcion: libro.descripcion || '',
        precio: libro.precio || '',
        stock_venta: libro.stock_venta ?? '',
        stock_prestamo: libro.stock_prestamo ?? '',
        fecha_publicacion: libro.fecha_publicacion || '',
        imagen: libro.imagen || '',
      })
      setGenerosSeleccionados((libro.generos || []).map((g) => g.id))
    }
  }, [libro])

  useEffect(() => {
    peticion(API.admin.generos()).then(({ data }) => {
      if (data) setGeneros(data.data || data || [])
    })
  }, [peticion])

  const cambiar = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    if (errores[e.target.name]) setErrores((p) => ({ ...p, [e.target.name]: null }))
  }

  const toggleGenero = (id) => {
    setGenerosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    )
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()
    const payload = { ...form, generos: generosSeleccionados }
    const resultado = await onGuardar(payload, libro?.id)
    if (resultado?.errores) setErrores(resultado.errores)
  }

  return (
    <div className={estilos.modalOverlay} onClick={(e) => e.target === e.currentTarget && onCerrar()}>
      <div className={estilos.modalContenido}>
        <div className={estilos.modalCabecera}>
          <h2 className={estilos.modalTitulo}>{libro ? 'Editar libro' : 'Nuevo libro'}</h2>
          <button className="boton boton-secundario boton-sm" onClick={onCerrar}>
            <Icon icon="mdi:close" />
          </button>
        </div>

        <form onSubmit={manejarEnvio}>
          <div className={estilos.gridDosColumnas}>
            <Campo label="Título *" id="titulo" name="titulo" value={form.titulo} onChange={cambiar} error={errores.titulo} />
            <Campo label="Autor *" id="autor" name="autor" value={form.autor} onChange={cambiar} error={errores.autor} />
            <Campo label="Editorial" id="editorial" name="editorial" value={form.editorial} onChange={cambiar} error={errores.editorial} />
            <Campo label="ISBN" id="isbn" name="isbn" value={form.isbn} onChange={cambiar} error={errores.isbn} />
            <Campo label="Precio (€) *" id="precio" name="precio" type="number" step="0.01" min="0" value={form.precio} onChange={cambiar} error={errores.precio} />
            <Campo label="Fecha publicación" id="fecha_publicacion" name="fecha_publicacion" type="date" value={form.fecha_publicacion} onChange={cambiar} error={errores.fecha_publicacion} />
            <Campo label="Stock venta" id="stock_venta" name="stock_venta" type="number" min="0" value={form.stock_venta} onChange={cambiar} error={errores.stock_venta} />
            <Campo label="Stock préstamo" id="stock_prestamo" name="stock_prestamo" type="number" min="0" value={form.stock_prestamo} onChange={cambiar} error={errores.stock_prestamo} />
          </div>

          <div className="campo-formulario">
            <label htmlFor="imagen">URL de portada</label>
            <input id="imagen" name="imagen" type="url" value={form.imagen} onChange={cambiar} className={errores.imagen ? 'con-error' : ''} />
            {errores.imagen && <span className="mensaje-error-campo">{errores.imagen[0]}</span>}
          </div>

          <div className="campo-formulario">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={4}
              value={form.descripcion}
              onChange={cambiar}
              className={errores.descripcion ? 'con-error' : ''}
            />
            {errores.descripcion && <span className="mensaje-error-campo">{errores.descripcion[0]}</span>}
          </div>

          {/* Géneros */}
          <div className="campo-formulario">
            <label>Géneros</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
              {generos.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  className={`boton boton-sm ${generosSeleccionados.includes(g.id) ? 'boton-primario' : 'boton-secundario'}`}
                  onClick={() => toggleGenero(g.id)}
                >
                  {g.nombre}
                </button>
              ))}
            </div>
          </div>

          <div className={estilos.modalAcciones}>
            <button type="button" className="boton boton-secundario" onClick={onCerrar} disabled={cargando}>
              Cancelar
            </button>
            <button type="submit" className="boton boton-primario" disabled={cargando}>
              {cargando ? 'Guardando...' : (libro ? 'Actualizar' : 'Crear libro')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Campo({ label, id, name, type = 'text', value, onChange, error, step, min }) {
  return (
    <div className="campo-formulario">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        step={step}
        min={min}
        className={error ? 'con-error' : ''}
      />
      {error && <span className="mensaje-error-campo">{error[0]}</span>}
    </div>
  )
}

export default LibroForm
