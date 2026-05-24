import { useEffect, useState, useCallback } from 'react'
import { Icon } from '@iconify/react'
import { toast } from 'react-toastify'
import useFetch from '../../../hooks/useFetch'
import API from '../../../services/api'
import Card from '../../../components/UI/Card'
import LoadingSpinner from '../../../components/UI/LoadingSpinner'
import EstadoVacio from '../../../components/UI/EstadoVacio'
import SearchInput from '../../../components/Common/SearchInput'
import Pagination from '../../../components/Common/Pagination'
import estilos from '../../modules/Admin.module.css'

const ROLES = [
  { value: 1, label: 'Admin', slug: 'admin' },
  { value: 2, label: 'Usuario', slug: 'usuario' },
]

function rolDeUsuario(u) {
  if (u.rol?.id) return ROLES.find((r) => r.value === u.rol.id) || ROLES[1]
  if (u.rol_id) return ROLES.find((r) => r.value === u.rol_id) || ROLES[1]
  return ROLES[1]
}

function ListadoUsuariosAdmin() {
  const { peticion, loading } = useFetch()
  const fetchMutacion = useFetch()
  const [usuarios, setUsuarios] = useState([])
  const [meta, setMeta] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(1)
  const [editandoId, setEditandoId] = useState(null)
  const [rolPendiente, setRolPendiente] = useState(null)

  const cargar = useCallback(async () => {
    const params = new URLSearchParams({ page: pagina })
    if (busqueda) params.set('busqueda', busqueda)
    const { data } = await peticion(`${API.admin.usuarios()}?${params}`)
    if (data) {
      setUsuarios(data.data || data || [])
      setMeta(data.meta || null)
    }
  }, [pagina, busqueda, peticion])

  useEffect(() => { cargar() }, [cargar])

  const abrirEdicion = (u) => {
    setEditandoId(u.id)
    setRolPendiente(rolDeUsuario(u).value)
  }

  const cancelarEdicion = () => {
    setEditandoId(null)
    setRolPendiente(null)
  }

  const confirmarCambio = async () => {
    if (!editandoId || !rolPendiente) return
    const { data } = await fetchMutacion.peticion(API.admin.usuarioDetalle(editandoId), {
      method: 'PUT',
      body: JSON.stringify({ rol_id: rolPendiente }),
    })
    if (data) {
      toast.success('Rol actualizado correctamente.')
      cancelarEdicion()
      cargar()
    }
  }

  const iniciales = (nombre) => {
    if (!nombre) return '?'
    return nombre.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
  }

  return (
    <main className={`contenedor ${estilos.pagina}`}>
      <div className={estilos.cabecera}>
        <h1 className={estilos.titulo}>Administrar usuarios</h1>
      </div>

      <div className={estilos.filtros}>
        <SearchInput
          valor={busqueda}
          onChange={(v) => { setBusqueda(v); setPagina(1) }}
          onLimpiar={() => { setBusqueda(''); setPagina(1) }}
          placeholder="Buscar por nombre o email..."
        />
      </div>

      {loading ? (
        <LoadingSpinner mensaje="Cargando usuarios..." />
      ) : usuarios.length === 0 ? (
        <EstadoVacio titulo="Sin usuarios" descripcion="No se encontraron usuarios." />
      ) : (
        <>
          <div className={estilos.gridUsuariosAdmin}>
            {usuarios.map((u) => {
              const rol = rolDeUsuario(u)
              const editando = editandoId === u.id

              return (
                <Card variante="normal" key={u.id} className={estilos.tarjetaUsuarioAdmin}>
                  <div className={estilos.avatarUsuario}>
                    <span className={estilos.inicialesAvatar}>{iniciales(u.name)}</span>
                  </div>

                  <div className={estilos.infoUsuarioAdmin}>
                    <span className={estilos.nombreUsuarioAdmin}>{u.name}</span>
                    <span className={estilos.emailUsuarioAdmin}>{u.email}</span>
                    <div className={estilos.rolUsuarioAdmin}>
                      <span className={`${estilos.badgeRol} ${estilos[`badgeRol--${rol.slug}`]}`}>
                        <Icon icon={rol.slug === 'admin' ? 'mdi:shield-account' : 'mdi:account'} />
                        {rol.label}
                      </span>
                    </div>
                  </div>

                  <div className={estilos.selectorRolAdmin}>
                    {!editando ? (
                      <button
                        className="boton boton-secundario boton-sm"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => abrirEdicion(u)}
                      >
                        <Icon icon="mdi:account-edit-outline" /> Cambiar rol
                      </button>
                    ) : (
                      <div className={estilos.panelCambioRol}>
                        <p className={estilos.labelRol}>Selecciona el nuevo rol:</p>
                        <div className={estilos.opcionesRol}>
                          {ROLES.map((r) => (
                            <label
                              key={r.value}
                              className={`${estilos.opcionRol} ${rolPendiente === r.value ? estilos.opcionRolActiva : ''}`}
                            >
                              <input
                                type="radio"
                                name={`rol-${u.id}`}
                                value={r.value}
                                checked={rolPendiente === r.value}
                                onChange={() => setRolPendiente(r.value)}
                              />
                              <Icon icon={r.slug === 'admin' ? 'mdi:shield-account' : 'mdi:account'} />
                              {r.label}
                            </label>
                          ))}
                        </div>
                        <div className={estilos.accionesConfirmacion}>
                          <button
                            className="boton boton-primario boton-sm"
                            onClick={confirmarCambio}
                            disabled={fetchMutacion.loading || rolPendiente === rol.value}
                          >
                            <Icon icon="mdi:check" /> Confirmar
                          </button>
                          <button
                            className="boton boton-secundario boton-sm"
                            onClick={cancelarEdicion}
                            disabled={fetchMutacion.loading}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )
            })}
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

export default ListadoUsuariosAdmin
