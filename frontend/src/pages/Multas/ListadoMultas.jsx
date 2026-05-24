import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import useFetch from '../../hooks/useFetch'
import API from '../../services/api'
import Card from '../../components/UI/Card'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import EstadoVacio from '../../components/UI/EstadoVacio'
import BadgeEstado from '../../components/UI/BadgeEstado'
import { formatearFecha, formatearPrecio, etiquetaEstadoMulta } from '../../utils/formatters'
import estilos from '../modules/Multas.module.css'

function ListadoMultas() {
  const { peticion, loading } = useFetch()
  const [multas, setMultas] = useState([])

  useEffect(() => {
    peticion(API.multas()).then(({ data }) => {
      if (data) setMultas(data.data || data || [])
    })
  }, [peticion])

  if (loading) return <LoadingSpinner mensaje="Cargando multas..." />

  return (
    <main className={`contenedor ${estilos.pagina}`}>
      <h1 className={estilos.titulo}>Mis multas</h1>

      {multas.length === 0 ? (
        <EstadoVacio
          icono="mdi:check-circle-outline"
          titulo="No tienes multas pendientes"
          descripcion="¡Devuelve siempre a tiempo para evitar recargos!"
        />
      ) : (
        <div className={estilos.lista}>
          {multas.map((multa) => (
            <Card variante="normal" key={multa.id} className={estilos.tarjeta}>
              <div className={estilos.cabecera}>
                <div>
                  <p className={estilos.descripcion}>{multa.descripcion || `Multa #${multa.id}`}</p>
                  {multa.prestamo && (
                    <p className={estilos.prestamoRef}>
                      <Icon icon="mdi:book-clock-outline" />
                      Préstamo #{multa.prestamo_id} —{' '}
                      {multa.prestamo?.libro?.titulo || ''}
                    </p>
                  )}
                  <p className={estilos.fecha}>
                    <Icon icon="mdi:calendar" />
                    {formatearFecha(multa.created_at)}
                  </p>
                </div>
                <div className={estilos.acciones}>
                  <p className={estilos.importe}>{formatearPrecio(multa.importe)}</p>
                  <BadgeEstado
                    estado={multa.estado}
                    etiqueta={etiquetaEstadoMulta(multa.estado)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}

export default ListadoMultas
