import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Icon } from '@iconify/react'
import { useAuth } from '../../contexts/AuthContext'
import useFetch from '../../hooks/useFetch'
import API from '../../services/api'
import estilos from '../modules/Auth.module.css'

function Register() {
  const [formulario, setFormulario] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [erroresCampo, setErroresCampo] = useState({})
  const { login } = useAuth()
  const { peticion, loading } = useFetch()
  const navigate = useNavigate()

  const actualizar = (e) => {
    setFormulario((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErroresCampo((prev) => ({ ...prev, [e.target.name]: null }))
  }

  const enviar = async (e) => {
    e.preventDefault()
    setErroresCampo({})

    if (formulario.password !== formulario.password_confirmation) {
      setErroresCampo({ password_confirmation: ['Las contraseñas no coinciden.'] })
      return
    }

    const { data, error } = await peticion(API.register(), {
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
      if (token) {
        login(token, usuario)
        toast.success('¡Cuenta creada! Bienvenido a la librería.')
        navigate('/', { replace: true })
      } else {
        toast.success('¡Cuenta creada! Ahora puedes iniciar sesión.')
        navigate('/login')
      }
    }
  }

  return (
    <main className={estilos.pagina}>
      <div className={estilos.tarjeta}>
        <div className={estilos.encabezado}>
          <Icon icon="mdi:book-open-page-variant" className={estilos.logoIcono} />
          <h1 className={estilos.titulo}>Crea tu cuenta</h1>
          <p className={estilos.subtitulo}>Únete y descubre miles de libros</p>
        </div>

        <form onSubmit={enviar} noValidate>
          <div className="campo-formulario">
            <label htmlFor="name">Nombre completo</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formulario.name}
              onChange={actualizar}
              placeholder="Tu nombre"
              autoComplete="name"
              className={erroresCampo.name ? 'con-error' : ''}
              required
            />
            {erroresCampo.name && (
              <span className="mensaje-error-campo">{erroresCampo.name[0]}</span>
            )}
          </div>

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
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              className={erroresCampo.password ? 'con-error' : ''}
              required
            />
            {erroresCampo.password && (
              <span className="mensaje-error-campo">{erroresCampo.password[0]}</span>
            )}
          </div>

          <div className="campo-formulario">
            <label htmlFor="password_confirmation">Confirmar contraseña</label>
            <input
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              value={formulario.password_confirmation}
              onChange={actualizar}
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
              className={erroresCampo.password_confirmation ? 'con-error' : ''}
              required
            />
            {erroresCampo.password_confirmation && (
              <span className="mensaje-error-campo">{erroresCampo.password_confirmation[0]}</span>
            )}
          </div>

          <button
            type="submit"
            className="boton boton-primario"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>

        <p className={estilos.enlaceAuth}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </main>
  )
}

export default Register
