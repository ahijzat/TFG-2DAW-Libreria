import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/UI/LoadingSpinner'

/**
 * Ruta protegida: redirige a /login si no hay sesión activa.
 * Si se pasa `soloAdmin`, redirige a / si el usuario no es administrador.
 */
function ProtectedRoute({ children, soloAdmin = false }) {
  const { usuario, cargando, esAdmin } = useAuth()
  const ubicacion = useLocation()

  if (cargando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <LoadingSpinner mensaje="Verificando sesión..." />
      </div>
    )
  }

  if (!usuario) {
    return <Navigate to="/login" state={{ desde: ubicacion }} replace />
  }

  if (soloAdmin && !esAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
