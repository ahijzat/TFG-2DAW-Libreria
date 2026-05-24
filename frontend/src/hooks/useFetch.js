/**
 * useFetch.js — Hook principal para consumir la API.
 *
 * Gestiona automáticamente:
 * - Token Bearer desde localStorage
 * - Errores globales: 401, 403, 422, 500
 * - Limpieza de sesión y redirección en 401
 * - Detección de fallo de conexión
 * - Estados: { data, error, loading }
 */

import { useState, useCallback, useRef } from 'react'
import { toast } from 'react-toastify'

const TOKEN_KEY = 'token_libreria'

const useFetch = () => {
  const [estado, setEstado] = useState({ data: null, error: null, loading: false })
  const controladorRef = useRef(null)

  /**
   * Ejecuta una petición fetch a la API.
   *
   * @param {string} url — URL completa del endpoint
   * @param {object} opciones — opciones de fetch (method, body, headers extra)
   * @returns {Promise<{ data, error }>}
   */
  const peticion = useCallback(async (url, opciones = {}) => {
    // Cancelar petición anterior si existía
    if (controladorRef.current) {
      controladorRef.current.abort()
    }
    controladorRef.current = new AbortController()

    setEstado({ data: null, error: null, loading: true })

    const token = localStorage.getItem(TOKEN_KEY)

    const cabeceras = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opciones.headers || {}),
    }

    try {
      const respuesta = await fetch(url, {
        ...opciones,
        headers: cabeceras,
        signal: controladorRef.current.signal,
      })

      // --- 401: sin autenticación ---
      if (respuesta.status === 401) {
        localStorage.removeItem(TOKEN_KEY)
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.')
        // Disparamos evento para que AuthContext limpie el estado
        window.dispatchEvent(new CustomEvent('sesion:expirada'))
        const resultado = { data: null, error: { status: 401, mensaje: 'No autenticado' } }
        setEstado({ ...resultado, loading: false })
        return resultado
      }

      // --- 403: sin permisos ---
      if (respuesta.status === 403) {
        toast.error('No tienes permiso para realizar esta acción.')
        const resultado = { data: null, error: { status: 403, mensaje: 'Sin permisos' } }
        setEstado({ ...resultado, loading: false })
        return resultado
      }

      // --- 422: errores de validación ---
      if (respuesta.status === 422) {
        const cuerpo = await respuesta.json()
        const resultado = {
          data: null,
          error: { status: 422, mensaje: 'Error de validación', errores: cuerpo.errors || {} },
        }
        setEstado({ ...resultado, loading: false })
        return resultado
      }

      // --- 500: error del servidor ---
      if (respuesta.status >= 500) {
        toast.error('Error interno del servidor. Inténtalo más tarde.')
        const resultado = {
          data: null,
          error: { status: respuesta.status, mensaje: 'Error del servidor' },
        }
        setEstado({ ...resultado, loading: false })
        return resultado
      }

      // --- Respuesta sin cuerpo (204 No Content, 201, etc.) ---
      if (respuesta.status === 204 || respuesta.headers.get('content-length') === '0') {
        const resultado = { data: {}, error: null }
        setEstado({ ...resultado, loading: false })
        return resultado
      }

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        const mensajeError = datos.message || 'Ha ocurrido un error inesperado.'
        toast.error(mensajeError)
        const resultado = { data: null, error: { status: respuesta.status, mensaje: mensajeError } }
        setEstado({ ...resultado, loading: false })
        return resultado
      }

      const resultado = { data: datos, error: null }
      setEstado({ ...resultado, loading: false })
      return resultado
    } catch (error) {
      if (error.name === 'AbortError') {
        // Petición cancelada intencionalmente — no hacer nada
        return { data: null, error: null }
      }

      // Fallo de conexión / red
      const resultado = {
        data: null,
        error: { status: 0, mensaje: 'No se puede conectar con el servidor.', sinConexion: true },
      }
      setEstado({ ...resultado, loading: false })
      // Disparamos evento para mostrar pantalla de ConnectionError
      window.dispatchEvent(new CustomEvent('conexion:fallida'))
      return resultado
    }
  }, [])

  const cancelar = useCallback(() => {
    if (controladorRef.current) {
      controladorRef.current.abort()
    }
  }, [])

  return {
    data: estado.data,
    error: estado.error,
    loading: estado.loading,
    peticion,
    cancelar,
  }
}

export default useFetch
