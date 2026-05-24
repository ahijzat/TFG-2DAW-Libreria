import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { toast } from 'react-toastify'
import useFetch from '../../hooks/useFetch'
import API from '../../services/api'
import Card from '../../components/UI/Card'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import EstadoVacio from '../../components/UI/EstadoVacio'
import BadgeEstado from '../../components/UI/BadgeEstado'
import ConfirmDialog from '../../components/UI/ConfirmDialog'
import { formatearFecha, etiquetaEstadoPrestamo } from '../../utils/formatters'
import estilos from '../modules/Prestamos.module.css'

function ListadoPrestamos() {
  const { peticion, loading } = useFetch()
  const fetchDevolver = useFetch()
  const [prestamos, setPrestamos] = useState([])
  const [confirmar, setConfirmar] = useState(null)

  const cargar = async () => {
    const { data } = await peticion(API.prestamos())
    if (data) setPrestamos(data.data || data || [])
  }

  useEffect(() => { cargar() }, [peticion])

  const devolver = async () => {
    if (!confirmar) return
    const { data } = await fetchDevolver.peticion(API.prestamoDevolver(confirmar), { method: 'POST' })
    if (data) {
      toast.success('Libro devuelto correctamente.')
      setConfirmar(null)
      cargar()
    }
  }

  if (loading) return <LoadingSpinner mensaje="Cargando préstamos..." />

  return (
    <main className={`contenedor ${estilos.pagina}`}>
      <h1 className={estilos.titulo}>Mis préstamos</h1>

      {prestamos.length === 0 ? (
        <EstadoVacio
          icono="mdi:book-clock-outline"
          titulo="No tienes préstamos activos"
          descripcion="Solicita un préstamo desde la ficha de un libro."
        />
      ) : (
        <div className={estilos.lista}>
          {prestamos.map((prestamo) => (
            <Card variante="normal" key={prestamo.id} className={estilos.tarjeta}>
              <div className={estilos.cabecera}>
                <div className={estilos.infoLibro}>
                  <Link to={`/libros/${prestamo.libro_id}`} className={estilos.tituloLibro}>
                    {prestamo.libro?.titulo || `Libro #${prestamo.libro_id}`}
                  </Link>
                  <p className={estilos.autorLibro}>{prestamo.libro?.autor}</p>
                </div>
                <div className={estilos.acciones}>
                  <BadgeEstado
                    estado={prestamo.estado}
                    etiqueta={etiquetaEstadoPrestamo(prestamo.estado)}
                  />
                  {prestamo.estado === 'activo' && (
                    <button
                      className="boton boton-secundario boton-sm"
                      onClick={() => setConfirmar(prestamo.id)}
                    >
                      <Icon icon="mdi:book-arrow-left" /> Devolver
                    </button>
                  )}
                </div>
              </div>

              <div className={estilos.fechas}>
                <span>
                  <Icon icon="mdi:calendar-start" />
                  Prestado: {formatearFecha(prestamo.fecha_prestamo)}
                </span>
                {prestamo.fecha_devolucion_prevista && (
                  <span>
                    <Icon icon="mdi:calendar-end" />
                    Devolución prevista: {formatearFecha(prestamo.fecha_devolucion_prevista)}
                  </span>
                )}
                {prestamo.fecha_devolucion_real && (
                  <span>
                    <Icon icon="mdi:calendar-check" />
                    Devuelto: {formatearFecha(prestamo.fecha_devolucion_real)}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        abierto={confirmar !== null}
        titulo="Confirmar devolución"
        mensaje="¿Confirmas que vas a devolver este libro?"
        onConfirmar={devolver}
        onCancelar={() => setConfirmar(null)}
        cargando={fetchDevolver.loading}
      />
    </main>
  )
}

export default ListadoPrestamos
