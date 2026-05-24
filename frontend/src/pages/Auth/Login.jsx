import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Icon } from '@iconify/react'
import { useAuth } from '../../contexts/AuthContext'
import useFetch from '../../hooks/useFetch'
import API from '../../services/api'
import estilos from '../modules/Auth.module.css'

function Login() {
  const [formulario, setFormulario] = useState({ email: '', password: '' })
  const [erroresCampo, setErroresCampo] = useState({})
  const { login } = useAuth()
  const { peticion, loading } = useFetch()
  const navigate = useNavigate()
  const location = useLocation()

  const destino = location.state?.desde?.pathname || '/'

  const actualizar = (e) => {
    setFormulario((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErroresCampo((prev) => ({ ...prev, [e.target.name]: null }))
  }

  const enviar = async (e) => {
    e.preventDefault()
    setErroresCampo({})

    const { data, error } = await peticion(API.login(), {
      method: 'POST',
      body: JSON.stringify(formulario),
    })

    if (error?.status === 422) {
      setErroresCampo(error.errores)
      return
    }

    if (error) return

    if (data) {
      const token = data.token || data.access_token || data.data?.token
      const usuario = data.user || data.usuario || data.data?.user || data.data
      login(token, usuario)
      toast.success('¡Bienvenido de nuevo!')
      navigate(destino, { replace: true })
    }
  }

  return (
    <main className={estilos.pagina}>
      <div className={estilos.tarjeta}>
        <div className={estilos.encabezado}>
          <Icon icon="mdi:book-open-page-variant" className={estilos.logoIcono} />
          <h1 className={estilos.titulo}>Bienvenido</h1>
          <p className={estilos.subtitulo}>Accede a tu cuenta de la librería</p>
        </div>

        <form onSubmit={enviar} noValidate>
          <div className="campo-formulario">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formulario.email}
              onChange={actualizar}
              placeholder="tu@email.com"
              autoComplete="email"
              className={erroresCampo.email ? 'con-error' : ''}
              required
            />
            {erroresCampo.email && (
              <span className="mensaje-error-campo">{erroresCampo.email[0]}</span>
            )}
          </div>

          <div className="campo-formulario">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formulario.password}
              onChange={actualizar}
              placeholder="Tu contraseña"
              autoComplete="current-password"
              className={erroresCampo.password ? 'con-error' : ''}
              required
            />
            {erroresCampo.password && (
              <span className="mensaje-error-campo">{erroresCampo.password[0]}</span>
            )}
          </div>

          <button
            type="submit"
            className="boton boton-primario"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className={estilos.enlaceAuth}>
          ¿Aún no tienes cuenta?{' '}
          <Link to="/register">Regístrate gratis</Link>
        </p>
      </div>
    </main>
  )
}

export default Login
