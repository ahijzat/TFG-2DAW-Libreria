import { useEffect, useState, useCallback } from 'react'
import { Icon } from '@iconify/react'
import useFetch from '../../../hooks/useFetch'
import API from '../../../services/api'
import Card from '../../../components/UI/Card'
import LoadingSpinner from '../../../components/UI/LoadingSpinner'
import EstadoVacio from '../../../components/UI/EstadoVacio'
import BadgeEstado from '../../../components/UI/BadgeEstado'
import Pagination from '../../../components/Common/Pagination'
import { formatearFecha, formatearPrecio, etiquetaEstadoCompra } from '../../../utils/formatters'
import estilos from '../../modules/Admin.module.css'

const ESTADOS = ['pendiente', 'pagada', 'cancelada']

function obtenerNombreUsuario(registro) {
  return registro.user?.name || registro.user?.email || registro.usuario?.name || registro.usuario?.email || `#${registro.user_id || registro.usuario_id}`
}

function ListadoComprasAdmin() {
  const { peticion, loading } = useFetch()
  const [compras, setCompras] = useState([])
  const [meta, setMeta] = useState(null)
  const [pagina, setPagina] = useState(1)
  const [estadoFiltro, setEstadoFiltro] = useState('')

  const cargar = useCallback(async () => {
    const params = new URLSearchParams({ page: pagina })
    if (estadoFiltro) params.set('estado', estadoFiltro)
    const { data } = await peticion(`${API.admin.compras()}?${params}`)
    if (data) {
      setCompras(data.data || data || [])
      setMeta(data.meta || null)
    }
  }, [pagina, estadoFiltro, peticion])

  useEffect(() => { cargar() }, [cargar])

  return (
    <main className={`contenedor ${estilos.pagina}`}>
      <div className={estilos.cabecera}>
        <h1 className={estilos.titulo}>Gestión de compras</h1>
        <div className={estilos.filtros}>
          <span className={estilos.textoFiltro}>Filtrar compras por estado</span>
          <select
            className={estilos.selectFiltro}
            value={estadoFiltro}
            onChange={(e) => { setEstadoFiltro(e.target.value); setPagina(1) }}
          >
            <option value="">Todos los estados</option>
            {ESTADOS.map((e) => (
              <option key={e} value={e}>{etiquetaEstadoCompra(e)}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner mensaje="Cargando compras..." />
      ) : compras.length === 0 ? (
        <EstadoVacio titulo="Sin compras" descripcion="No hay compras que mostrar." />
      ) : (
        <>
          <div className={estilos.gridTransacciones}>
            {compras.map((c) => (
              <Card variante="normal" key={c.id} className={estilos.tarjetaTransaccion}>
                <div className={estilos.cabeceraTransaccion}>
                  <div className={estilos.idTransaccion}>
                    <Icon icon="mdi:shopping-outline" className={estilos.iconoTransaccion} />
                    <span>Pedido #{c.id}</span>
                  </div>
                  <BadgeEstado estado={c.estado} etiqueta={etiquetaEstadoCompra(c.estado)} />
                </div>
                <div className={estilos.cuerpoTransaccion}>
                  <div className={estilos.filaTransaccion}>
                    <Icon icon="mdi:account-outline" className={estilos.iconoFila} />
                    <span>{obtenerNombreUsuario(c)}</span>
                  </div>
                  <div className={estilos.filaTransaccion}>
                    <Icon icon="mdi:calendar-outline" className={estilos.iconoFila} />
                    <span>{formatearFecha(c.created_at)}</span>
                  </div>
                  <div className={estilos.totalTransaccion}>
                    {formatearPrecio(c.total)}
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

    </main>
  )
}

export default ListadoComprasAdmin
