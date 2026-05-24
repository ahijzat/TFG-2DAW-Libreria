import { useEffect, useState, useCallback } from 'react'
import { Icon } from '@iconify/react'
import { toast } from 'react-toastify'
import useFetch from '../../../hooks/useFetch'
import API from '../../../services/api'
import Card from '../../../components/UI/Card'
import LoadingSpinner from '../../../components/UI/LoadingSpinner'
import EstadoVacio from '../../../components/UI/EstadoVacio'
import BadgeEstado from '../../../components/UI/BadgeEstado'
import ConfirmDialog from '../../../components/UI/ConfirmDialog'
import Pagination from '../../../components/Common/Pagination'
import PrestamoForm from '../../../components/Forms/PrestamoForm'
import { formatearFecha, etiquetaEstadoPrestamo } from '../../../utils/formatters'
import estilos from '../../modules/Admin.module.css'

function obtenerNombreUsuario(registro) {
  return registro.user?.name || registro.user?.email || registro.usuario?.name || registro.usuario?.email || `#${registro.user_id || registro.usuario_id}`
}

function ListadoPrestamosAdmin() {
  const { peticion, loading } = useFetch()
  const fetchMutacion = useFetch()
  const [prestamos, setPrestamos] = useState([])
  const [meta, setMeta] = useState(null)
  const [pagina, setPagina] = useState(1)
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [devolverIds, setDevolverIds] = useState(null)

  const cargar = useCallback(async () => {
    const params = new URLSearchParams({ page: pagina })
    const { data } = await peticion(`${API.admin.prestamos()}?${params}`)
    if (data) {
      setPrestamos(data.data || data || [])
      setMeta(data.meta || null)
    }
  }, [pagina, peticion])

  useEffect(() => { cargar() }, [cargar])

  const crearPrestamo = async (formData) => {
    const { data, error } = await fetchMutacion.peticion(API.admin.prestamos(), {
      method: 'POST',
      body: JSON.stringify(formData),
    })
    if (error?.errores) return { errores: error.errores }
    if (data) {
      toast.success('Préstamo creado.')
      setFormularioAbierto(false)
      cargar()
    }
    return {}
  }

  const confirmarDevolucion = async () => {
    if (!devolverIds) return
    const { data } = await fetchMutacion.peticion(API.admin.prestamoDevolucion(devolverIds), { method: 'PUT' })
    if (data) {
      toast.success('Préstamo marcado como devuelto.')
      setDevolverIds(null)
      cargar()
    }
  }

  return (
    <main className={`contenedor ${estilos.pagina}`}>
      <div className={estilos.cabecera}>
        <h1 className={estilos.titulo}>Gestión de préstamos</h1>
        <button className="boton boton-primario" onClick={() => setFormularioAbierto(true)}>
          <Icon icon="mdi:plus" /> Nuevo préstamo
        </button>
      </div>

      {loading ? (
        <LoadingSpinner mensaje="Cargando préstamos..." />
      ) : prestamos.length === 0 ? (
        <EstadoVacio titulo="Sin préstamos" descripcion="No hay préstamos registrados." />
      ) : (
        <>
          <div className={estilos.gridTransacciones}>
            {prestamos.map((p) => (
              <Card variante="normal" key={p.id} className={estilos.tarjetaTransaccion}>
                <div className={estilos.cabeceraTransaccion}>
                  <div className={estilos.idTransaccion}>
                    <Icon icon="mdi:book-clock-outline" className={estilos.iconoTransaccion} />
                    <span>Préstamo #{p.id}</span>
                  </div>
                  <BadgeEstado estado={p.estado} etiqueta={etiquetaEstadoPrestamo(p.estado)} />
                </div>
                <div className={estilos.cuerpoTransaccion}>
                  <div className={estilos.filaTransaccion}>
                    <Icon icon="mdi:account-outline" className={estilos.iconoFila} />
                    <span>{obtenerNombreUsuario(p)}</span>
                  </div>
                  <div className={estilos.filaTransaccion}>
                    <Icon icon="mdi:book-open-variant" className={estilos.iconoFila} />
                    <span className={estilos.tituloLibroPrestamo}>{p.libro?.titulo || `Libro #${p.libro_id}`}</span>
                  </div>
                  <div className={estilos.fechasPrestamo}>
                    <span>
                      <Icon icon="mdi:calendar-start" className={estilos.iconoFila} />
                      {formatearFecha(p.fecha_prestamo)}
                    </span>
                    <span>
                      <Icon icon="mdi:calendar-end" className={estilos.iconoFila} />
                      {formatearFecha(p.fecha_devolucion_prevista)}
                    </span>
                  </div>
                </div>
                {p.estado === 'activo' && (
                  <div className={estilos.pieTransaccion}>
                    <button
                      className="boton boton-exito boton-sm"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => setDevolverIds(p.id)}
                    >
                      <Icon icon="mdi:book-arrow-left" /> Registrar devolución
                    </button>
                  </div>
                )}
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
        <PrestamoForm
          onGuardar={crearPrestamo}
          onCerrar={() => setFormularioAbierto(false)}
          cargando={fetchMutacion.loading}
        />
      )}

      <ConfirmDialog
        abierto={devolverIds !== null}
        titulo="Registrar devolución"
        mensaje="¿Confirmar la devolución de este préstamo?"
        onConfirmar={confirmarDevolucion}
        onCancelar={() => setDevolverIds(null)}
        cargando={fetchMutacion.loading}
      />
    </main>
  )
}

export default ListadoPrestamosAdmin
