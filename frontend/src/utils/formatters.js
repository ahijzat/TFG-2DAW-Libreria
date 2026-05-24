import dayjs from 'dayjs'
import 'dayjs/locale/es'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('es')

/**
 * Formatea una fecha a formato legible en español.
 * @param {string|Date} fecha
 * @returns {string} — ej. "24 de mayo de 2026"
 */
export function formatearFecha(fecha) {
  if (!fecha) return '—'
  return dayjs(fecha).format('D [de] MMMM [de] YYYY')
}

/**
 * Formatea una fecha corta.
 * @param {string|Date} fecha
 * @returns {string} — ej. "24/05/2026"
 */
export function formatearFechaCorta(fecha) {
  if (!fecha) return '—'
  return dayjs(fecha).format('DD/MM/YYYY')
}

/**
 * Tiempo relativo desde ahora.
 * @param {string|Date} fecha
 * @returns {string} — ej. "hace 3 días"
 */
export function tiempoDesde(fecha) {
  if (!fecha) return '—'
  return dayjs(fecha).fromNow()
}

/**
 * Formatea un precio en euros.
 * @param {number|string} precio
 * @returns {string} — ej. "12,99 €"
 */
export function formatearPrecio(precio) {
  const num = parseFloat(precio)
  if (isNaN(num)) return '—'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(num)
}

/**
 * Trunca un texto a un número máximo de caracteres.
 * @param {string} texto
 * @param {number} max
 * @returns {string}
 */
export function truncarTexto(texto, max = 120) {
  if (!texto) return ''
  if (texto.length <= max) return texto
  return texto.slice(0, max).trimEnd() + '…'
}

/**
 * Etiqueta legible para el estado de un préstamo.
 */
export function etiquetaEstadoPrestamo(estado) {
  const mapa = {
    activo: 'Activo',
    devuelto: 'Devuelto',
    vencido: 'Vencido',
    pendiente: 'Pendiente',
  }
  return mapa[estado] || estado || '—'
}

/**
 * Etiqueta legible para el estado de una compra.
 */
export function etiquetaEstadoCompra(estado) {
  const mapa = {
    pendiente: 'Pendiente',
    pagado: 'Pagado',
    pagada: 'Pagada',
    enviado: 'Enviado',
    entregado: 'Entregado',
    cancelada: 'Cancelada',
    cancelado: 'Cancelado',
    completado: 'Completado',
  }
  return mapa[estado] || estado || '—'
}

/**
 * Etiqueta legible para el estado de una multa.
 */
export function etiquetaEstadoMulta(estado) {
  const mapa = {
    pendiente: 'Pendiente',
    pagada: 'Pagada',
    cancelada: 'Cancelada',
  }
  return mapa[estado] || estado || '—'
}

/**
 * Calcula el color de variante para un estado.
 * Devuelve una clave: 'exito' | 'advertencia' | 'error' | 'info' | 'neutro'
 */
export function varianteEstado(estado) {
  const exito = ['devuelto', 'pagado', 'entregado', 'completado', 'pagada']
  const advertencia = ['activo', 'pendiente', 'enviado']
  const error = ['vencido', 'cancelado']

  if (exito.includes(estado)) return 'exito'
  if (advertencia.includes(estado)) return 'advertencia'
  if (error.includes(estado)) return 'error'
  return 'neutro'
}
