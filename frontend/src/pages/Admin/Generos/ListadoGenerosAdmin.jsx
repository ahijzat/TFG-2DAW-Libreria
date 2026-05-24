import { useEffect, useState, useCallback } from 'react'
import { Icon } from '@iconify/react'
import { toast } from 'react-toastify'
import useFetch from '../../../hooks/useFetch'
import API from '../../../services/api'
import Card from '../../../components/UI/Card'
import LoadingSpinner from '../../../components/UI/LoadingSpinner'
import EstadoVacio from '../../../components/UI/EstadoVacio'
import ConfirmDialog from '../../../components/UI/ConfirmDialog'
import GeneroForm from '../../../components/Forms/GeneroForm'
import estilos from '../../modules/Admin.module.css'

function ListadoGenerosAdmin() {
  const { peticion, loading } = useFetch()
  const fetchMutacion = useFetch()
  const [generos, setGeneros] = useState([])
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [generoEditar, setGeneroEditar] = useState(null)
  const [eliminarId, setEliminarId] = useState(null)

  const cargar = useCallback(async () => {
    const { data } = await peticion(API.admin.generos())
    if (data) setGeneros(data.data || data || [])
  }, [peticion])

  useEffect(() => { cargar() }, [cargar])

  const guardar = async (formData, id) => {
    const url = id ? API.admin.generoDetalle(id) : API.admin.generos()
    const method = id ? 'PUT' : 'POST'
    const { data, error } = await fetchMutacion.peticion(url, { method, body: JSON.stringify(formData) })
    if (error?.errores) return { errores: error.errores }
    if (data) {
      toast.success(id ? 'Género actualizado.' : 'Género creado.')
      setFormularioAbierto(false)
      setGeneroEditar(null)
      cargar()
    }
    return {}
  }

  const confirmarEliminar = async () => {
    if (!eliminarId) return
    await fetchMutacion.peticion(API.admin.generoDetalle(eliminarId), { method: 'DELETE' })
    toast.success('Género eliminado.')
    setEliminarId(null)
    cargar()
  }

  return (
    <main className={`contenedor ${estilos.pagina}`}>
      <div className={estilos.cabecera}>
        <h1 className={estilos.titulo}>Administrar géneros</h1>
        <button
          className="boton boton-primario"
          onClick={() => { setGeneroEditar(null); setFormularioAbierto(true) }}
        >
          <Icon icon="mdi:plus" /> Nuevo género
        </button>
      </div>

      {loading ? (
        <LoadingSpinner mensaje="Cargando géneros..." />
      ) : generos.length === 0 ? (
        <EstadoVacio titulo="Sin géneros" descripcion="Crea el primer género literario." />
      ) : (
        <div className={estilos.gridTarjetas}>
          {generos.map((genero) => (
            <Card variante="normal" key={genero.id} className={estilos.tarjetaGenero}>
              <div className={estilos.infoGenero}>
                <Icon icon="mdi:tag" className={estilos.iconoGenero} />
                <span className={estilos.nombreGenero}>{genero.nombre}</span>
              </div>
              <div className={estilos.accionesGenero}>
                <button
                  className="boton boton-secundario boton-sm"
                  onClick={() => { setGeneroEditar(genero); setFormularioAbierto(true) }}
                >
                  <Icon icon="mdi:pencil" />
                </button>
                <button
                  className="boton boton-peligro boton-sm"
                  onClick={() => setEliminarId(genero.id)}
                >
                  <Icon icon="mdi:delete-outline" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {formularioAbierto && (
        <GeneroForm
          genero={generoEditar}
          onGuardar={guardar}
          onCerrar={() => { setFormularioAbierto(false); setGeneroEditar(null) }}
          cargando={fetchMutacion.loading}
        />
      )}

      <ConfirmDialog
        abierto={eliminarId !== null}
        titulo="Eliminar género"
        mensaje="¿Seguro que deseas eliminar este género?"
        onConfirmar={confirmarEliminar}
        onCancelar={() => setEliminarId(null)}
        cargando={fetchMutacion.loading}
      />
    </main>
  )
}

export default ListadoGenerosAdmin
