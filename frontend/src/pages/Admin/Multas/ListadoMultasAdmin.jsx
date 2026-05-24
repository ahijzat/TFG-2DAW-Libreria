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
import { formatearFecha, formatearPrecio, etiquetaEstadoMulta } from '../../../utils/formatters'
import estilos from '../../modules/Admin.module.css'

function obtenerNombreUsuario(registro) {
  return registro.user?.name || registro.user?.email || registro.usuario?.name || registro.usuario?.email || `#${registro.user_id || registro.usuario_id}`
}

function ListadoMultasAdmin() {
  const { peticion, loading } = useFetch()
  const fetchMutacion = useFetch()
  const [multas, setMultas] = useState([])
  const [meta, setMeta] = useState(null)
  const [pagina, setPagina] = useState(1)
  const [pagarId, setPagarId] = useState(null)

  const cargar = useCallback(async () => {
    const params = new URLSearchParams({ page: pagina })
    const { data } = await peticion(`${API.admin.multas()}?${params}`)
    if (data) {
      setMultas(data.data || data || [])
      setMeta(data.meta || null)
    }
  }, [pagina, peticion])

  useEffect(() => { cargar() }, [cargar])

  const confirmarPago = async () => {
    if (!pagarId) return
    const { data } = await fetchMutacion.peticion(API.admin.multaPagar(pagarId), { method: 'PATCH' })
    if (data) {
      toast.success('Multa marcada como pagada.')
      setPagarId(null)
      cargar()
    }
  }

  return (
    <main className={`contenedor ${estilos.pagina}`}>
      <div className={estilos.cabecera}>
        <h1 className={estilos.titulo}>Gestión de multas</h1>
      </div>

      {loading ? (
        <LoadingSpinner mensaje="Cargando multas..." />
      ) : multas.length === 0 ? (
        <EstadoVacio titulo="Sin multas" descripcion="No hay multas registradas." />
      ) : (
        <>
          <div className={estilos.gridTransacciones}>
            {multas.map((m) => (
              <Card variante="normal" key={m.id} className={`${estilos.tarjetaTransaccion} ${m.estado === 'pendiente' ? estilos.multaPendiente : ''}`}>
                <div className={estilos.cabeceraTransaccion}>
                  <div className={estilos.idTransaccion}>
                    <Icon icon="mdi:alert-circle-outline" className={estilos.iconoTransaccion} />
                    <span>Multa #{m.id}</span>
                  </div>
                  <BadgeEstado estado={m.estado} etiqueta={etiquetaEstadoMulta(m.estado)} />
                </div>
                <div className={estilos.cuerpoTransaccion}>
                  <div className={estilos.filaTransaccion}>
                    <Icon icon="mdi:account-outline" className={estilos.iconoFila} />
                    <span>{obtenerNombreUsuario(m)}</span>
                  </div>
                  <div className={estilos.filaTransaccion}>
                    <Icon icon="mdi:book-clock-outline" className={estilos.iconoFila} />
                    <span>Préstamo #{m.prestamo_id}</span>
                  </div>
                  <div className={estilos.filaTransaccion}>
                    <Icon icon="mdi:calendar-outline" className={estilos.iconoFila} />
                    <span>{formatearFecha(m.created_at)}</span>
                  </div>
                  <div className={estilos.importeMulta}>
                    {formatearPrecio(m.importe)}
                  </div>
                </div>
                {m.estado === 'pendiente' && (
                  <div className={estilos.pieTransaccion}>
                    <button
                      className="boton boton-exito boton-sm"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => setPagarId(m.id)}
                    >
                      <Icon icon="mdi:cash-check" /> Marcar como pagada
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

      <ConfirmDialog
        abierto={pagarId !== null}
        titulo="Marcar como pagada"
        mensaje={`¿Marcar la multa #${pagarId} como pagada?`}
        onConfirmar={confirmarPago}
        onCancelar={() => setPagarId(null)}
        cargando={fetchMutacion.loading}
      />
    </main>
  )
}

export default ListadoMultasAdmin
