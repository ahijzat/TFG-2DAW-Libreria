import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { toast } from 'react-toastify'
import useFetch from '../../../hooks/useFetch'
import API from '../../../services/api'
import Card from '../../../components/UI/Card'
import LoadingSpinner from '../../../components/UI/LoadingSpinner'
import EstadoVacio from '../../../components/UI/EstadoVacio'
import ConfirmDialog from '../../../components/UI/ConfirmDialog'
import SearchInput from '../../../components/Common/SearchInput'
import Pagination from '../../../components/Common/Pagination'
import LibroForm from '../../../components/Forms/LibroForm'
import { formatearPrecio, truncarTexto } from '../../../utils/formatters'
import estilos from '../../modules/Admin.module.css'

function ListadoLibrosAdmin() {
  const { peticion, loading } = useFetch()
  const fetchMutacion = useFetch()
  const [libros, setLibros] = useState([])
  const [meta, setMeta] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(1)
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [libroEditar, setLibroEditar] = useState(null)
  const [eliminarId, setEliminarId] = useState(null)

  const cargar = useCallback(async () => {
    const params = new URLSearchParams({ page: pagina })
    if (busqueda) params.set('busqueda', busqueda)
    const { data } = await peticion(`${API.admin.libros()}?${params}`)
    if (data) {
      setLibros(data.data || data || [])
      setMeta(data.meta || null)
    }
  }, [pagina, busqueda, peticion])

  useEffect(() => { cargar() }, [cargar])

  const guardar = async (formData, id) => {
    const url = id ? API.admin.libroDetalle(id) : API.admin.libros()
    const method = id ? 'PUT' : 'POST'
    const { data, error } = await fetchMutacion.peticion(url, { method, body: JSON.stringify(formData) })
    if (error?.errores) return { errores: error.errores }
    if (data) {
      toast.success(id ? 'Libro actualizado.' : 'Libro creado.')
      setFormularioAbierto(false)
      setLibroEditar(null)
      cargar()
    }
    return {}
  }

  const confirmarEliminar = async () => {
    if (!eliminarId) return
    const { data } = await fetchMutacion.peticion(API.admin.libroDetalle(eliminarId), { method: 'DELETE' })
    if (data !== undefined) {
      toast.success('Libro eliminado.')
      setEliminarId(null)
      cargar()
    }
  }

  return (
    <main className={`contenedor ${estilos.pagina}`}>
      <div className={estilos.cabecera}>
        <h1 className={estilos.titulo}>Administrar libros</h1>
        <button
          className="boton boton-primario"
          onClick={() => { setLibroEditar(null); setFormularioAbierto(true) }}
        >
          <Icon icon="mdi:plus" /> Nuevo libro
        </button>
      </div>

      <div className={estilos.filtros}>
        <SearchInput
          valor={busqueda}
          onChange={(v) => { setBusqueda(v); setPagina(1) }}
          onLimpiar={() => { setBusqueda(''); setPagina(1) }}
          placeholder="Buscar libro..."
        />
      </div>

      {loading ? (
        <LoadingSpinner mensaje="Cargando libros..." />
      ) : libros.length === 0 ? (
        <EstadoVacio titulo="Sin libros" descripcion="No se encontraron libros con esos criterios." />
      ) : (
        <>
          <div className={estilos.gridLibrosAdmin}>
            {libros.map((libro) => (
              <Card variante="normal" key={libro.id} className={estilos.tarjetaLibroAdmin}>
                <div className={estilos.portadaAdmin}>
                  {libro.imagen ? (
                    <img src={libro.imagen} alt={libro.titulo} className={estilos.imagenPortadaAdmin} />
                  ) : (
                    <div className={estilos.portadaPlaceholder}>
                      <Icon icon="mdi:book-open-page-variant" className={estilos.iconoPortada} />
                    </div>
                  )}
                </div>

                <div className={estilos.cuerpoTarjetaLibro}>
                  <div className={estilos.infoLibroAdmin}>
                    <Link to={`/libros/${libro.id}`} className={estilos.tituloLibroAdmin}>
                      {truncarTexto(libro.titulo, 45)}
                    </Link>
                    <span className={estilos.autorLibroAdmin}>{libro.autor}</span>
                    <span className={estilos.precioLibroAdmin}>{formatearPrecio(libro.precio)}</span>
                  </div>

                  <div className={estilos.stockLibroAdmin}>
                    <span className={estilos.stockItem}>
                      <Icon icon="mdi:cart-outline" className={estilos.iconoStock} />
                      {libro.stock_venta ?? 0} en venta
                    </span>
                    <span className={estilos.stockItem}>
                      <Icon icon="mdi:book-clock-outline" className={estilos.iconoStock} />
                      {libro.stock_prestamo ?? 0} préstamo
                    </span>
                  </div>

                  <div className={estilos.accionesLibroAdmin}>
                    <button
                      className="boton boton-secundario boton-sm"
                      onClick={() => { setLibroEditar(libro); setFormularioAbierto(true) }}
                      title="Editar libro"
                    >
                      <Icon icon="mdi:pencil" /> Editar
                    </button>
                    <button
                      className="boton boton-peligro boton-sm"
                      onClick={() => setEliminarId(libro.id)}
                      title="Eliminar libro"
                    >
                      <Icon icon="mdi:delete-outline" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {meta && (
            <Pagination
              paginaActual={meta.current_page || pagina}
              totalPaginas={meta.last_page || 1}
              onCambiarPagina={(p) => { setPagina(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            />
          )}
        </>
      )}

      {formularioAbierto && (
        <LibroForm
          libro={libroEditar}
          onGuardar={guardar}
          onCerrar={() => { setFormularioAbierto(false); setLibroEditar(null) }}
          cargando={fetchMutacion.loading}
        />
      )}

      <ConfirmDialog
        abierto={eliminarId !== null}
        titulo="Eliminar libro"
        mensaje="¿Seguro que deseas eliminar este libro? Esta acción no se puede deshacer."
        onConfirmar={confirmarEliminar}
        onCancelar={() => setEliminarId(null)}
        cargando={fetchMutacion.loading}
      />
    </main>
  )
}

export default ListadoLibrosAdmin
