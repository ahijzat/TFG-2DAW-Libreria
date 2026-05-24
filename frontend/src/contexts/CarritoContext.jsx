import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'react-toastify'
import API from '../services/api'
import useFetch from '../hooks/useFetch'
import { useAuth } from './AuthContext'

const CarritoContext = createContext(null)

const CLAVE_GUEST = 'carrito_invitado'
const CLAVE_CACHE = 'carrito_auth_cache'

function leerStorage(clave) {
  try {
    const datos = localStorage.getItem(clave)
    return datos ? JSON.parse(datos) : []
  } catch {
    return []
  }
}

function guardarStorage(clave, datos) {
  try {
    localStorage.setItem(clave, JSON.stringify(datos))
  } catch { }
}

function limpiarStorage(clave) {
  try {
    localStorage.removeItem(clave)
  } catch { }
}

function idTemporal() {
  return `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function extraerDetalles(data) {
  return data?.data?.detalles ?? data?.detalles ?? []
}

export function CarritoProvider({ children }) {
  const { token } = useAuth()
  const { peticion } = useFetch()

  const [items, setItems] = useState(() =>
    token ? leerStorage(CLAVE_CACHE) : leerStorage(CLAVE_GUEST)
  )
  const [cargandoCarrito, setCargandoCarrito] = useState(false)

  const itemsRef = useRef(items)
  useEffect(() => { itemsRef.current = items }, [items])

  const tokenPrevioRef = useRef(token)

  const sincronizarItems = useCallback((nuevosItems, esAuth) => {
    setItems(nuevosItems)
    guardarStorage(esAuth ? CLAVE_CACHE : CLAVE_GUEST, nuevosItems)
  }, [])

  const cargarCarritoServidor = useCallback(async () => {
    if (!token) return
    setCargandoCarrito(true)
    const { data } = await peticion(API.carrito())
    if (data) {
      const detalles = extraerDetalles(data)
      sincronizarItems(detalles, true)
    }
    setCargandoCarrito(false)
  }, [token, peticion, sincronizarItems])

  const fusionarCarritoAlLogin = useCallback(async () => {
    setCargandoCarrito(true)

    const { data: dataServidor } = await peticion(API.carrito())
    const itemsServidor = extraerDetalles(dataServidor)
    const libroIdsServidor = new Set(itemsServidor.map((i) => i.libro_id ?? i.libro?.id))

    const itemsGuest = leerStorage(CLAVE_GUEST)

    if (itemsGuest.length > 0) {
      const promesas = itemsGuest
        .filter((item) => {
          const libroId = item.libro_id ?? item.libro?.id
          return libroId && !libroIdsServidor.has(libroId)
        })
        .map((item) =>
          peticion(API.carrito(), {
            method: 'POST',
            body: JSON.stringify({
              libro_id: item.libro_id ?? item.libro?.id,
              cantidad: item.cantidad,
            }),
          })
        )
      await Promise.allSettled(promesas)
      limpiarStorage(CLAVE_GUEST)
    }

    const { data: dataFinal } = await peticion(API.carrito())
    const itemsFinales = extraerDetalles(dataFinal)
    sincronizarItems(itemsFinales, true)

    setCargandoCarrito(false)
  }, [peticion, sincronizarItems])

  useEffect(() => {
    const tokenAnterior = tokenPrevioRef.current
    tokenPrevioRef.current = token

    if (token && !tokenAnterior) {
      fusionarCarritoAlLogin()
    } else if (!token && tokenAnterior) {
      const actuales = itemsRef.current
      if (actuales.length > 0) {
        const itemsParaGuardar = actuales.map((item) => ({
          id: idTemporal(),
          libro_id: item.libro_id ?? item.libro?.id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario ?? item.libro?.precio,
          subtotal: parseFloat(item.precio_unitario ?? item.libro?.precio ?? 0) * item.cantidad,
          libro: item.libro ?? null,
        }))
        guardarStorage(CLAVE_GUEST, itemsParaGuardar)
      }
      limpiarStorage(CLAVE_CACHE)
      setItems(leerStorage(CLAVE_GUEST))
    } else if (token) {
      cargarCarritoServidor()
    } else {
      setItems(leerStorage(CLAVE_GUEST))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const agregarAlCarrito = useCallback(
    async (libroId, cantidad = 1, datosLibro = null) => {
      if (!token) {
        const actuales = itemsRef.current
        const existente = actuales.find((i) => (i.libro_id ?? i.libro?.id) === libroId)
        let nuevosItems
        if (existente) {
          nuevosItems = actuales.map((i) =>
            (i.libro_id ?? i.libro?.id) === libroId
              ? {
                  ...i,
                  cantidad: i.cantidad + cantidad,
                  subtotal: parseFloat(i.precio_unitario ?? 0) * (i.cantidad + cantidad),
                }
              : i
          )
        } else {
          const precioUnitario = parseFloat(datosLibro?.precio ?? 0)
          nuevosItems = [
            ...actuales,
            {
              id: idTemporal(),
              libro_id: libroId,
              cantidad,
              precio_unitario: precioUnitario,
              subtotal: precioUnitario * cantidad,
              libro: datosLibro ?? { id: libroId },
            },
          ]
        }
        sincronizarItems(nuevosItems, false)
        toast.success('Libro añadido al carrito.')
        return { data: {}, error: null }
      }

      const { data, error } = await peticion(API.carrito(), {
        method: 'POST',
        body: JSON.stringify({ libro_id: libroId, cantidad }),
      })
      if (data) {
        const detalles = extraerDetalles(data)
        if (detalles.length > 0) sincronizarItems(detalles, true)
        else await cargarCarritoServidor()
        toast.success('Libro añadido al carrito.')
      } else if (error?.status !== 422) {
        toast.error('No se pudo añadir el libro al carrito.')
      }
      return { data, error }
    },
    [token, peticion, sincronizarItems, cargarCarritoServidor]
  )

  const actualizarCantidad = useCallback(
    async (detalleId, cantidad) => {
      if (cantidad < 1) return { data: null, error: null }

      const actuales = itemsRef.current

      if (!token) {
        const nuevosItems = actuales.map((item) =>
          item.id === detalleId
            ? {
                ...item,
                cantidad,
                subtotal: parseFloat(item.precio_unitario ?? 0) * cantidad,
              }
            : item
        )
        sincronizarItems(nuevosItems, false)
        return { data: {}, error: null }
      }

      const itemsOptimistas = actuales.map((item) =>
        item.id === detalleId
          ? {
              ...item,
              cantidad,
              subtotal: parseFloat(item.precio_unitario ?? item.libro?.precio ?? 0) * cantidad,
            }
          : item
      )
      sincronizarItems(itemsOptimistas, true)

      const { data, error } = await peticion(API.carritoDetalle(detalleId), {
        method: 'PATCH',
        body: JSON.stringify({ cantidad }),
      })

      if (error) {
        sincronizarItems(actuales, true)
        toast.error('No se pudo actualizar la cantidad.')
      } else if (data) {
        const detalles = extraerDetalles(data)
        if (detalles.length > 0) sincronizarItems(detalles, true)
      }

      return { data, error }
    },
    [token, peticion, sincronizarItems]
  )

  const eliminarItem = useCallback(
    async (detalleId) => {
      const actuales = itemsRef.current

      if (!token) {
        const nuevosItems = actuales.filter((item) => item.id !== detalleId)
        sincronizarItems(nuevosItems, false)
        toast.info('Libro eliminado del carrito.')
        return { data: {}, error: null }
      }

      const itemsOptimistas = actuales.filter((item) => item.id !== detalleId)
      sincronizarItems(itemsOptimistas, true)

      const { data, error } = await peticion(API.carritoDetalle(detalleId), {
        method: 'DELETE',
      })

      if (error) {
        sincronizarItems(actuales, true)
        toast.error('No se pudo eliminar el libro del carrito.')
      } else {
        const detalles = extraerDetalles(data)
        if (detalles.length > 0) sincronizarItems(detalles, true)
        toast.info('Libro eliminado del carrito.')
      }

      return { data, error }
    },
    [token, peticion, sincronizarItems]
  )

  const vaciarCarrito = useCallback(async () => {
    if (!token) {
      sincronizarItems([], false)
      return { data: {}, error: null }
    }

    const actuales = itemsRef.current
    sincronizarItems([], true)

    const { data, error } = await peticion(API.carritoVaciar(), { method: 'POST' })

    if (error) {
      sincronizarItems(actuales, true)
      toast.error('No se pudo vaciar el carrito.')
    }

    return { data, error }
  }, [token, peticion, sincronizarItems])

  const totalItems = items.reduce((acc, item) => acc + (item.cantidad || 0), 0)
  const totalPrecio = items.reduce(
    (acc, item) =>
      acc + (item.cantidad || 0) * parseFloat(item.precio_unitario ?? item.libro?.precio ?? 0),
    0
  )

  return (
    <CarritoContext.Provider
      value={{
        items,
        cargandoCarrito,
        totalItems,
        totalPrecio,
        cargarCarrito: cargarCarritoServidor,
        agregarAlCarrito,
        actualizarCantidad,
        eliminarItem,
        vaciarCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  )
}

export function useCarrito() {
  const ctx = useContext(CarritoContext)
  if (!ctx) throw new Error('useCarrito debe usarse dentro de CarritoProvider')
  return ctx
}

export default CarritoContext
