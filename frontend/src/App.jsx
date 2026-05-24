import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider, useAuth } from './contexts/AuthContext'
import { CarritoProvider } from './contexts/CarritoContext'
import ProtectedRoute from './routes/ProtectedRoute'

import BigLayout from './components/Layout/BigLayout'

import Loading from './pages/Shared/Loading'

import Inicio from './pages/Inicio/Inicio'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import ListadoLibros from './pages/Catalogo/ListadoLibros'
import DetalleLibro from './pages/Catalogo/DetalleLibro'
import Checkout from './pages/Carrito/Checkout'
import Perfil from './pages/Perfil/Perfil'

import ListadoLibrosAdmin from './pages/Admin/Libros/ListadoLibrosAdmin'
import ListadoGenerosAdmin from './pages/Admin/Generos/ListadoGenerosAdmin'
import ListadoUsuariosAdmin from './pages/Admin/Usuarios/ListadoUsuariosAdmin'
import ListadoComprasAdmin from './pages/Admin/Compras/ListadoComprasAdmin'
import ListadoPrestamosAdmin from './pages/Admin/Prestamos/ListadoPrestamosAdmin'
import ListadoMultasAdmin from './pages/Admin/Multas/ListadoMultasAdmin'
import Terminos from './pages/Legal/Terminos'
import SobreNosotros from './pages/Legal/SobreNosotros'

// Ruta pública que redirige si ya está autenticado
function RutaPublica({ children }) {
  const { usuario, cargando } = useAuth()
  if (cargando) return <Loading />
  if (usuario) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  const { cargando } = useAuth()
  if (cargando) return <Loading />

  return (
    <Routes>
      <Route element={<BigLayout />}>
        {/* Rutas públicas */}
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<ListadoLibros />} />
        <Route path="/libros/:id" element={<DetalleLibro />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />} />

        {/* Auth (redirige si ya está logado) */}
        <Route path="/login" element={<RutaPublica><Login /></RutaPublica>} />
        <Route path="/register" element={<RutaPublica><Register /></RutaPublica>} />

        {/* Rutas protegidas de usuario */}
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/compras" element={<Navigate to="/perfil" replace />} />
        <Route path="/prestamos" element={<Navigate to="/perfil" replace />} />
        <Route path="/multas" element={<Navigate to="/perfil" replace />} />
        <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />

        {/* Rutas de administrador */}
        <Route path="/admin/libros" element={<ProtectedRoute soloAdmin><ListadoLibrosAdmin /></ProtectedRoute>} />
        <Route path="/admin/generos" element={<ProtectedRoute soloAdmin><ListadoGenerosAdmin /></ProtectedRoute>} />
        <Route path="/admin/usuarios" element={<ProtectedRoute soloAdmin><ListadoUsuariosAdmin /></ProtectedRoute>} />
        <Route path="/admin/compras" element={<ProtectedRoute soloAdmin><ListadoComprasAdmin /></ProtectedRoute>} />
        <Route path="/admin/prestamos" element={<ProtectedRoute soloAdmin><ListadoPrestamosAdmin /></ProtectedRoute>} />
        <Route path="/admin/multas" element={<ProtectedRoute soloAdmin><ListadoMultasAdmin /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CarritoProvider>
          <AppRoutes />
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="colored"
          />
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
