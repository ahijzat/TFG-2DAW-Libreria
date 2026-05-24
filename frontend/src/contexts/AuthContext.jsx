import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import API from '../services/api'

const TOKEN_KEY = 'token_libreria'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()

  const limpiarSesion = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUsuario(null)
  }, [])

  // Escuchar evento de sesión expirada lanzado por useFetch
  useEffect(() => {
    const manejarExpiracion = () => {
      limpiarSesion()
      navigate('/login', { replace: true })
    }
    window.addEventListener('sesion:expirada', manejarExpiracion)
    return () => window.removeEventListener('sesion:expirada', manejarExpiracion)
  }, [limpiarSesion, navigate])

  // Cargar usuario al inicio si hay token
  useEffect(() => {
    if (!token) {
      setCargando(false)
      return
    }

    const cargarUsuario = async () => {
      try {
        const respuesta = await fetch(API.me(), {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })

        if (respuesta.ok) {
          const datos = await respuesta.json()
          setUsuario(datos.data || datos)
        } else {
          limpiarSesion()
        }
      } catch {
        // Sin conexión — mantenemos el token pero no cargamos usuario
      } finally {
        setCargando(false)
      }
    }

    cargarUsuario()
  }, [token, limpiarSesion])

  const login = useCallback((nuevoToken, datosUsuario) => {
    localStorage.setItem(TOKEN_KEY, nuevoToken)
    setToken(nuevoToken)
    setUsuario(datosUsuario)
  }, [])

  const logout = useCallback(async () => {
    if (token) {
      try {
        await fetch(API.logout(), {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })
      } catch {
        // Ignoramos errores en logout
      }
    }
    limpiarSesion()
    toast.info('Has cerrado sesión.')
    navigate('/login')
  }, [token, limpiarSesion, navigate])

  const refreshUser = useCallback(async () => {
    if (!token) return
    try {
      const respuesta = await fetch(API.me(), {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
      if (respuesta.ok) {
        const datos = await respuesta.json()
        setUsuario(datos.data || datos)
      }
    } catch {
      // Silencioso
    }
  }, [token])

  const esAdmin = usuario?.rol?.slug === 'admin' || usuario?.rol_id === 1

  return (
    <AuthContext.Provider
      value={{ usuario, token, cargando, esAdmin, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}

export default AuthContext
