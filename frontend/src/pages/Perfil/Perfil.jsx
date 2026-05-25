import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Icon } from '@iconify/react'
import { useAuth } from '../../contexts/AuthContext'
import useFetch from '../../hooks/useFetch'
import API from '../../services/api'
import Card from '../../components/UI/Card'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import EstadoVacio from '../../components/UI/EstadoVacio'
import BadgeEstado from '../../components/UI/BadgeEstado'
import ConfirmDialog from '../../components/UI/ConfirmDialog'
import Pagination from '../../components/Common/Pagination'
import { formatearFecha, formatearPrecio, etiquetaEstadoCompra, etiquetaEstadoPrestamo, etiquetaEstadoMulta } from '../../utils/formatters'
import estilos from '../modules/Perfil.module.css'

function Perfil() {
  const { usuario, refreshUser } = useAuth()
  const { peticion, loading } = useFetch()
  const fetchPwd = useFetch()
  const [perfil, setPerfil] = useState(null)
  const [editando, setEditando] = useState(false)
  const [formulario, setFormulario] = useState({ name: '', email: '' })
  const [erroresCampo, setErroresCampo] = useState({})

  const [cambioPwd, setCambioPwd] = useState({ current_password: '', password: '', password_confirmation: '' })
  const [erroresPwd, setErroresPwd] = useState({})
  const [mostrarPwd, setMostrarPwd] = useState(false)

  // Estado para la pestaña activa del historial
  const [pestanaActiva, setPestanaActiva] = useState('compras')

  // Paginación por pestaña
  const ITEMS_POR_PAGINA = 6
  const [paginaCompras, setPaginaCompras] = useState(1)
  const [paginaPrestamos, setPaginaPrestamos] = useState(1)
  const [paginaMultas, setPaginaMultas] = useState(1)

  // Compras
  const fetchCompras = useFetch()
  const fetchDetalles = useFetch()
  const [compras, setCompras] = useState(null)
  const [expandida, setExpandida] = useState(null)
  const [detallesCompra, setDetallesCompra] = useState({})

  // Préstamos
  const fetchPrestamos = useFetch()
  const fetchDevolver = useFetch()
  const [prestamos, setPrestamos] = useState(null)
  const [confirmarDevolucion, setConfirmarDevolucion] = useState(null)

  // Multas
  const fetchMultas = useFetch()
  const [multas, setMultas] = useState(null)

  useEffect(() => {
    const cargar = async () => {
      const { data } = await peticion(API.perfil())
      if (data) {
        const p = data.usuario || data.data || data
        setPerfil(p)
        setFormulario({ name: p.name || '', email: p.email || '' })
      }
    }
    cargar()
  }, [peticion])

  // Cargar datos al cambiar de pestaña (lazy)
  useEffect(() => {
    if (pestanaActiva === 'compras' && compras === null) {
      fetchCompras.peticion(API.compras()).then(({ data }) => {
        setCompras(data?.data || data || [])
      })
    }
    if (pestanaActiva === 'prestamos' && prestamos === null) {
      fetchPrestamos.peticion(API.prestamos()).then(({ data }) => {
        setPrestamos(data?.data || data || [])
      })
    }
    if (pestanaActiva === 'multas' && multas === null) {
      fetchMultas.peticion(API.multas()).then(({ data }) => {
        setMultas(data?.data || data || [])
      })
    }
  }, [pestanaActiva])

  const actualizarPerfil = async (e) => {
    e.preventDefault()
    setErroresCampo({})
    const { data, error } = await peticion(API.usuarioDetalle(usuario.id), {
      method: 'PUT',
      body: JSON.stringify(formulario),
    })
    if (error?.status === 422) { setErroresCampo(error.errores); return }
    if (data) {
      await refreshUser()
      toast.success('Perfil actualizado correctamente.')
      setEditando(false)
    }
  }

  const cambiarPassword = async (e) => {
    e.preventDefault()
    setErroresPwd({})
    if (cambioPwd.password !== cambioPwd.password_confirmation) {
      setErroresPwd({ password_confirmation: ['Las contraseñas no coinciden.'] })
      return
    }
    const { data, error } = await fetchPwd.peticion(API.usuarioPassword(usuario.id), {
      method: 'PUT',
      body: JSON.stringify(cambioPwd),
    })
    if (error?.status === 422) { setErroresPwd(error.errores); return }
    if (data) {
      toast.success('Contraseña cambiada correctamente.')
      setCambioPwd({ current_password: '', password: '', password_confirmation: '' })
      setMostrarPwd(false)
    }
  }

  const toggleExpandirCompra = async (id) => {
    if (expandida === id) { setExpandida(null); return }
    setExpandida(id)
    if (!detallesCompra[id]) {
      const { data } = await fetchDetalles.peticion(API.compraDetalles(id))
      if (data) setDetallesCompra((d) => ({ ...d, [id]: data.data || data || [] }))
    }
  }

  const cargarPrestamos = async () => {
    const { data } = await fetchPrestamos.peticion(API.prestamos())
    if (data) setPrestamos(data?.data || data || [])
  }

  const devolver = async () => {
    if (!confirmarDevolucion) return
    const { data } = await fetchDevolver.peticion(API.prestamoDevolver(confirmarDevolucion), { method: 'PATCH' })
    if (data) {
      toast.success('Libro devuelto correctamente.')
      setConfirmarDevolucion(null)
      cargarPrestamos()
    }
  }

  if (loading && !perfil) return <LoadingSpinner mensaje="Cargando perfil..." />
  if (!perfil) return null

  return (
    <main className={`contenedor ${estilos.pagina}`}>
      <h1 className={estilos.titulo}>Mi perfil</h1>

      <div className={estilos.layout}>
        {/* Tarjeta de avatar */}
        <Card variante="normal" className={estilos.cardAvatar}>
          <div className={estilos.avatar}>
            <Icon icon="mdi:account-circle" />
          </div>
          <p className={estilos.nombreUsuario}>{perfil.name}</p>
          <p className={estilos.emailUsuario}>{perfil.email}</p>
          {perfil.rol && (
            <span className={estilos.badgeRol}>
              <Icon icon="mdi:shield-account" /> {perfil.rol.nombre || perfil.rol.slug || ''}
            </span>
          )}
        </Card>

        {/* Formulario edición de datos */}
        <div className={estilos.formularios}>
          <Card variante="normal">
            <div className={estilos.cabeceraTarjeta}>
              <h2 className={estilos.subtitulo}>Datos personales</h2>
              <button
                className="boton boton-secundario boton-sm"
                onClick={() => setEditando(!editando)}
              >
                <Icon icon={editando ? 'mdi:close' : 'mdi:pencil'} />
                {editando ? 'Cancelar' : 'Editar'}
              </button>
            </div>

            <form onSubmit={actualizarPerfil}>
              <div className="campo-formulario">
                <label htmlFor="name">Nombre</label>
                <input
                  id="name"
                  type="text"
                  value={formulario.name}
                  onChange={(e) => setFormulario((p) => ({ ...p, name: e.target.value }))}
                  disabled={!editando}
                  className={erroresCampo.name ? 'con-error' : ''}
                />
                {erroresCampo.name && <span className="mensaje-error-campo">{erroresCampo.name[0]}</span>}
              </div>
              <div className="campo-formulario">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  id="email"
                  type="email"
                  value={formulario.email}
                  onChange={(e) => setFormulario((p) => ({ ...p, email: e.target.value }))}
                  disabled={!editando}
                  className={erroresCampo.email ? 'con-error' : ''}
                />
                {erroresCampo.email && <span className="mensaje-error-campo">{erroresCampo.email[0]}</span>}
              </div>
              {editando && (
                <button
                  type="submit"
                  className="boton boton-primario"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar cambios'}
                </button>
              )}
            </form>
          </Card>

          {/* Cambio de contraseña */}
          <Card variante="normal">
            <div className={estilos.cabeceraTarjeta}>
              <h2 className={estilos.subtitulo}>Seguridad</h2>
              <button
                className="boton boton-secundario boton-sm"
                onClick={() => setMostrarPwd(!mostrarPwd)}
              >
                <Icon icon={mostrarPwd ? 'mdi:close' : 'mdi:lock-reset'} />
                {mostrarPwd ? 'Cancelar' : 'Cambiar contraseña'}
              </button>
            </div>

            {mostrarPwd && (
              <form onSubmit={cambiarPassword}>
                <div className="campo-formulario">
                  <label htmlFor="current_password">Contraseña actual</label>
                  <input
                    id="current_password"
                    type="password"
                    value={cambioPwd.current_password}
                    onChange={(e) => setCambioPwd((p) => ({ ...p, current_password: e.target.value }))}
                    autoComplete="current-password"
                    className={erroresPwd.current_password ? 'con-error' : ''}
                  />
                  {erroresPwd.current_password && <span className="mensaje-error-campo">{erroresPwd.current_password[0]}</span>}
                </div>
                <div className="campo-formulario">
                  <label htmlFor="new_password">Nueva contraseña</label>
                  <input
                    id="new_password"
                    type="password"
                    value={cambioPwd.password}
                    onChange={(e) => setCambioPwd((p) => ({ ...p, password: e.target.value }))}
                    autoComplete="new-password"
                    className={erroresPwd.password ? 'con-error' : ''}
                  />
                  {erroresPwd.password && <span className="mensaje-error-campo">{erroresPwd.password[0]}</span>}
                </div>
                <div className="campo-formulario">
                  <label htmlFor="pwd_confirm">Confirmar nueva contraseña</label>
                  <input
                    id="pwd_confirm"
                    type="password"
                    value={cambioPwd.password_confirmation}
                    onChange={(e) => setCambioPwd((p) => ({ ...p, password_confirmation: e.target.value }))}
                    autoComplete="new-password"
                    className={erroresPwd.password_confirmation ? 'con-error' : ''}
                  />
                  {erroresPwd.password_confirmation && <span className="mensaje-error-campo">{erroresPwd.password_confirmation[0]}</span>}
                </div>
                <button
                  type="submit"
                  className="boton boton-primario"
                  disabled={fetchPwd.loading}
                >
                  {fetchPwd.loading ? 'Cambiando...' : 'Cambiar contraseña'}
                </button>
              </form>
            )}
          </Card>

          {/* Historial: compras, préstamos y multas */}
          <Card variante="normal" className={estilos.cardHistorial}>
            <h2 className={estilos.subtitulo}>Mi actividad</h2>

            {/* Pestañas */}
            <div className={estilos.pestanas} role="tablist">
              <button
                role="tab"
                aria-selected={pestanaActiva === 'compras'}
                className={`${estilos.pestana} ${pestanaActiva === 'compras' ? estilos.pestanaActiva : ''}`}
                onClick={() => { setPestanaActiva('compras'); setPaginaCompras(1) }}
              >
                <Icon icon="mdi:shopping-outline" /> Compras
              </button>
              <button
                role="tab"
                aria-selected={pestanaActiva === 'prestamos'}
                className={`${estilos.pestana} ${pestanaActiva === 'prestamos' ? estilos.pestanaActiva : ''}`}
                onClick={() => { setPestanaActiva('prestamos'); setPaginaPrestamos(1) }}
              >
                <Icon icon="mdi:book-clock-outline" /> Préstamos
              </button>
              <button
                role="tab"
                aria-selected={pestanaActiva === 'multas'}
                className={`${estilos.pestana} ${pestanaActiva === 'multas' ? estilos.pestanaActiva : ''}`}
                onClick={() => { setPestanaActiva('multas'); setPaginaMultas(1) }}
              >
                <Icon icon="mdi:alert-circle-outline" /> Multas
              </button>
            </div>

            {/* Panel: Compras */}
            {pestanaActiva === 'compras' && (
              <div role="tabpanel" className={estilos.panelPestana}>
                {fetchCompras.loading ? (
                  <LoadingSpinner tamaño="sm" />
                ) : compras === null ? null : compras.length === 0 ? (
                  <EstadoVacio
                    icono="mdi:shopping-outline"
                    titulo="Aún no has realizado compras"
                    descripcion="Explora el catálogo y realiza tu primer pedido."
                  />
                ) : (
                  <div className={estilos.listaHistorial}>
                    {compras.slice((paginaCompras - 1) * ITEMS_POR_PAGINA, paginaCompras * ITEMS_POR_PAGINA).map((compra) => (
                      <div key={compra.id} className={estilos.itemHistorial}>
                        <div className={estilos.filaItem}>
                          <div className={estilos.infoItem}>
                            <span className={estilos.idItem}>Pedido #{compra.id}</span>
                            <span className={estilos.fechaItem}>
                              <Icon icon="mdi:calendar" /> {formatearFecha(compra.created_at)}
                            </span>
                          </div>
                          <div className={estilos.accionesItem}>
                            <BadgeEstado
                              estado={compra.estado}
                              etiqueta={etiquetaEstadoCompra(compra.estado)}
                            />
                            <span className={estilos.importeItem}>{formatearPrecio(compra.total)}</span>
                            <button
                              className="boton boton-secundario boton-sm"
                              onClick={() => toggleExpandirCompra(compra.id)}
                            >
                              <Icon icon={expandida === compra.id ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
                              {expandida === compra.id ? 'Ocultar' : 'Ver detalles'}
                            </button>
                          </div>
                        </div>

                        {expandida === compra.id && (
                          <div className={estilos.detallesCompra}>
                            {fetchDetalles.loading ? (
                              <LoadingSpinner tamaño="sm" />
                            ) : (
                              <ul className={estilos.listaDetallesCompra}>
                                {(detallesCompra[compra.id] || []).map((d) => (
                                  <li key={d.id} className={estilos.lineaDetalle}>
                                    <Link to={`/libros/${d.libro_id}`} className={estilos.tituloDetalle}>
                                      {d.libro?.titulo || `Libro #${d.libro_id}`}
                                    </Link>
                                    <span className={estilos.cantidadDetalle}>x{d.cantidad}</span>
                                    <span className={estilos.precioDetalle}>{formatearPrecio(d.precio_unitario)}</span>
                                    <span className={estilos.subtotalDetalle}>{formatearPrecio(parseFloat(d.precio_unitario) * d.cantidad)}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {compras && compras.length > ITEMS_POR_PAGINA && (
                  <Pagination
                    paginaActual={paginaCompras}
                    totalPaginas={Math.ceil(compras.length / ITEMS_POR_PAGINA)}
                    onCambiarPagina={setPaginaCompras}
                  />
                )}
              </div>
            )}

            {/* Panel: Préstamos */}
            {pestanaActiva === 'prestamos' && (
              <div role="tabpanel" className={estilos.panelPestana}>
                {fetchPrestamos.loading ? (
                  <LoadingSpinner tamaño="sm" />
                ) : prestamos === null ? null : prestamos.length === 0 ? (
                  <EstadoVacio
                    icono="mdi:book-clock-outline"
                    titulo="No tienes préstamos activos"
                    descripcion="Los préstamos los gestiona el administrador de la biblioteca."
                  />
                ) : (
                  <div className={estilos.listaHistorial}>
                    {prestamos.slice((paginaPrestamos - 1) * ITEMS_POR_PAGINA, paginaPrestamos * ITEMS_POR_PAGINA).map((prestamo) => (
                      <div key={prestamo.id} className={estilos.itemHistorial}>
                        <div className={estilos.filaItem}>
                          <div className={estilos.infoItem}>
                            <Link to={`/libros/${prestamo.libro_id}`} className={estilos.tituloLibroPrestamo}>
                              {prestamo.libro?.titulo || `Libro #${prestamo.libro_id}`}
                            </Link>
                            {prestamo.libro?.autor && (
                              <span className={estilos.autorLibroPrestamo}>{prestamo.libro.autor}</span>
                            )}
                          </div>
                          <div className={estilos.accionesItem}>
                            <BadgeEstado
                              estado={prestamo.estado}
                              etiqueta={etiquetaEstadoPrestamo(prestamo.estado)}
                            />
                            {prestamo.estado === 'activo' && (
                              <button
                                className="boton boton-secundario boton-sm"
                                onClick={() => setConfirmarDevolucion(prestamo.id)}
                              >
                                <Icon icon="mdi:book-arrow-left" /> Devolver
                              </button>
                            )}
                          </div>
                        </div>
                        <div className={estilos.fechasPrestamo}>
                          <span><Icon icon="mdi:calendar-start" /> Prestado: {formatearFecha(prestamo.fecha_prestamo)}</span>
                          {prestamo.fecha_devolucion_prevista && (
                            <span><Icon icon="mdi:calendar-end" /> Devolución prevista: {formatearFecha(prestamo.fecha_devolucion_prevista)}</span>
                          )}
                          {prestamo.fecha_devolucion_real && (
                            <span><Icon icon="mdi:calendar-check" /> Devuelto: {formatearFecha(prestamo.fecha_devolucion_real)}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {prestamos && prestamos.length > ITEMS_POR_PAGINA && (
                  <Pagination
                    paginaActual={paginaPrestamos}
                    totalPaginas={Math.ceil(prestamos.length / ITEMS_POR_PAGINA)}
                    onCambiarPagina={setPaginaPrestamos}
                  />
                )}

                <ConfirmDialog
                  abierto={confirmarDevolucion !== null}
                  titulo="Confirmar devolución"
                  mensaje="¿Confirmas que vas a devolver este libro?"
                  onConfirmar={devolver}
                  onCancelar={() => setConfirmarDevolucion(null)}
                  cargando={fetchDevolver.loading}
                />
              </div>
            )}

            {/* Panel: Multas */}
            {pestanaActiva === 'multas' && (
              <div role="tabpanel" className={estilos.panelPestana}>
                {fetchMultas.loading ? (
                  <LoadingSpinner tamaño="sm" />
                ) : multas === null ? null : multas.length === 0 ? (
                  <EstadoVacio
                    icono="mdi:check-circle-outline"
                    titulo="No tienes multas pendientes"
                    descripcion="¡Devuelve siempre a tiempo para evitar recargos!"
                  />
                ) : (
                  <div className={estilos.listaHistorial}>
                    {multas.slice((paginaMultas - 1) * ITEMS_POR_PAGINA, paginaMultas * ITEMS_POR_PAGINA).map((multa) => (
                      <div key={multa.id} className={estilos.itemHistorial}>
                        <div className={estilos.filaItem}>
                          <div className={estilos.infoItem}>
                            <p className={estilos.descripcionMulta}>{multa.descripcion || `Multa #${multa.id}`}</p>
                            {multa.prestamo && (
                              <p className={estilos.referenciaMulta}>
                                <Icon icon="mdi:book-clock-outline" />
                                Préstamo #{multa.prestamo_id}{multa.prestamo?.libro?.titulo ? ` — ${multa.prestamo.libro.titulo}` : ''}
                              </p>
                            )}
                            <p className={estilos.fechaItem}>
                              <Icon icon="mdi:calendar" /> {formatearFecha(multa.created_at)}
                            </p>
                          </div>
                          <div className={estilos.accionesItem}>
                            <p className={estilos.importeItem}>{formatearPrecio(multa.importe)}</p>
                            <BadgeEstado
                              estado={multa.estado}
                              etiqueta={etiquetaEstadoMulta(multa.estado)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {multas && multas.length > ITEMS_POR_PAGINA && (
                  <Pagination
                    paginaActual={paginaMultas}
                    totalPaginas={Math.ceil(multas.length / ITEMS_POR_PAGINA)}
                    onCambiarPagina={setPaginaMultas}
                  />
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </main>
  )
}

export default Perfil

