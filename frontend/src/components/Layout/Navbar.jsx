import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { useAuth } from '../../contexts/AuthContext'
import { useCarrito } from '../../contexts/CarritoContext'
import MiniCarrito from '../Common/MiniCarrito'
import { useState } from 'react'
import estilos from '../../pages/modules/Navbar.module.css'

function Navbar() {
  const { usuario, esAdmin, logout } = useAuth()
  const { totalItems } = useCarrito()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const navigate = useNavigate()

  const cerrarMenus = () => {
    setMenuAbierto(false)
    setCarritoAbierto(false)
  }

  const manejarLogout = async () => {
    cerrarMenus()
    await logout()
  }

  return (
    <header className={estilos.cabecera}>
      <nav className={`contenedor ${estilos.navegacion}`} aria-label="Navegación principal">
        {/* Logo */}
        <Link to="/" className={estilos.logo} onClick={cerrarMenus}>
          <Icon icon="mdi:book-open-page-variant" className={estilos.logoIcono} />
          <span>Biblium</span>
        </Link>

        {/* Navegación central */}
        <ul className={`${estilos.enlaces} ${menuAbierto ? estilos.menuVisible : ''}`}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => `${estilos.enlace} ${isActive ? estilos.activo : ''}`}
              end
              onClick={cerrarMenus}
            >
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/catalogo"
              className={({ isActive }) => `${estilos.enlace} ${isActive ? estilos.activo : ''}`}
              onClick={cerrarMenus}
            >
              Catálogo
            </NavLink>
          </li>
          {esAdmin && (
            <li className={estilos.grupoAdmin}>
              <span className={estilos.enlaceAdmin}>
                Admin <Icon icon="mdi:chevron-down" />
              </span>
              <ul className={estilos.submenu}>
                <li><Link to="/admin/libros" onClick={cerrarMenus}>Libros</Link></li>
                <li><Link to="/admin/generos" onClick={cerrarMenus}>Géneros</Link></li>
                <li><Link to="/admin/usuarios" onClick={cerrarMenus}>Usuarios</Link></li>
                <li><Link to="/admin/compras" onClick={cerrarMenus}>Compras</Link></li>
                <li><Link to="/admin/prestamos" onClick={cerrarMenus}>Préstamos</Link></li>
                <li><Link to="/admin/multas" onClick={cerrarMenus}>Multas</Link></li>
              </ul>
            </li>
          )}
        </ul>

        {/* Acciones de la derecha */}
        <div className={estilos.acciones}>
          {/* Carrito */}
          {usuario && (
            <button
              className={estilos.botonIcono}
              onClick={() => setCarritoAbierto(!carritoAbierto)}
              aria-label="Ver carrito"
            >
              <Icon icon="mdi:cart-outline" />
              {totalItems > 0 && (
                <span className={estilos.badgeCarrito}>{totalItems}</span>
              )}
            </button>
          )}

          {/* Usuario */}
          {usuario ? (
            <div className={estilos.menuUsuario}>
              <button
                className={estilos.botonUsuario}
                onClick={() => setMenuAbierto(!menuAbierto)}
                aria-expanded={menuAbierto}
                aria-label="Menú de usuario"
              >
                <Icon icon="mdi:account-circle" />
                <span className={estilos.nombreUsuario}>{usuario.name?.split(' ')[0]}</span>
                <Icon icon="mdi:chevron-down" />
              </button>
              {menuAbierto && (
                <ul className={estilos.desplegable}>
                  <li>
                    <Link to="/perfil" onClick={cerrarMenus}>
                      <Icon icon="mdi:account" /> Mi perfil
                    </Link>
                  </li>
                  <li className={estilos.separador} />
                  <li>
                    <button onClick={manejarLogout} className={estilos.botonCerrarSesion}>
                      <Icon icon="mdi:logout" /> Cerrar sesión
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div className={estilos.accionesAuth}>
              <Link
                to="/login"
                className={`boton boton-sm ${estilos.botonAuth} ${estilos.botonEntrar}`}
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className={`boton boton-sm ${estilos.botonAuth} ${estilos.botonEntrar}`}
              >
                Registrarse
              </Link>
            </div>
          )}

          {/* Hamburguesa móvil */}
          <button
            className={estilos.hamburguesa}
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label="Abrir menú"
          >
            <Icon icon={menuAbierto ? 'mdi:close' : 'mdi:menu'} />
          </button>
        </div>
      </nav>

      {/* Mini carrito desplegable */}
      {carritoAbierto && (
        <MiniCarrito onCerrar={() => setCarritoAbierto(false)} onIrCheckout={() => { setCarritoAbierto(false); navigate('/checkout') }} />
      )}
    </header>
  )
}

export default Navbar
