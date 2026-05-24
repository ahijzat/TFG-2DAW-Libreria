/**
 * api.js — Mapa de endpoints generado a partir de routes/api.php del backend.
 * Todos los endpoints están basados en las rutas reales de la API.
 *
 * Base URL: import.meta.env.VITE_API_URL (ej. http://localhost:8000/api)
 */

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// ─── Rutas públicas ──────────────────────────────────────────────────────────

export const API = {
  // Inicio
  inicio: () => `${BASE}/inicio`,

  // Autenticación
  login: () => `${BASE}/login`,
  register: () => `${BASE}/register`,
  me: () => `${BASE}/me`,
  logout: () => `${BASE}/logout`,

  // Perfil del usuario autenticado
  perfil: () => `${BASE}/perfil`,

  // Catálogo público de libros
  libros: () => `${BASE}/libros`,
  libroCatalogo: () => `${BASE}/catalogo/libros`,
  libroDetalle: (id) => `${BASE}/libros/${id}`,
  autores: () => `${BASE}/autores`,

  // Géneros (público: index; privado: store/show/update/destroy)
  generos: () => `${BASE}/generos`,
  generoDetalle: (id) => `${BASE}/generos/${id}`,

  // Carrito (requiere auth)
  carrito: () => `${BASE}/carrito`,
  carritoDetalle: (detalleId) => `${BASE}/carrito/${detalleId}`,
  carritoVaciar: () => `${BASE}/carrito/vaciar`,

  // Checkout (requiere auth)
  checkout: () => `${BASE}/checkout`,

  // Compras (requiere auth)
  compras: () => `${BASE}/compras`,
  compraDetalle: (id) => `${BASE}/compras/${id}`,
  compraDetalles: (compraId) => `${BASE}/compras/${compraId}/detalles`,
  compraDetalleItem: (compraId, detalleId) => `${BASE}/compras/${compraId}/detalles/${detalleId}`,

  // Préstamos (requiere auth)
  prestamos: () => `${BASE}/prestamos`,
  prestamoDetalle: (id) => `${BASE}/prestamos/${id}`,
  prestamoDevolver: (id) => `${BASE}/prestamos/${id}/devolver`,

  // Multas (requiere auth)
  multas: () => `${BASE}/multas`,
  multaDetalle: (id) => `${BASE}/multas/${id}`,

  // Usuarios (requiere auth — admin)
  usuarios: () => `${BASE}/usuarios`,
  usuarioDetalle: (id) => `${BASE}/usuarios/${id}`,
  usuarioPassword: (id) => `${BASE}/usuarios/${id}/password`,
  usuarioRol: (id) => `${BASE}/usuarios/${id}/rol`,

  // ─── Rutas admin (/api/admin/...) ──────────────────────────────────────────
  admin: {
    // Libros
    libros: () => `${BASE}/admin/libros`,
    libroDetalle: (id) => `${BASE}/admin/libros/${id}`,
    libroStock: (id) => `${BASE}/admin/libros/${id}/stock`,
    libroGeneros: (id) => `${BASE}/admin/libros/${id}/generos`,

    // Géneros
    generos: () => `${BASE}/admin/generos`,
    generoDetalle: (id) => `${BASE}/admin/generos/${id}`,

    // Usuarios
    usuarios: () => `${BASE}/admin/usuarios`,
    usuarioDetalle: (id) => `${BASE}/admin/usuarios/${id}`,

    // Compras
    compras: () => `${BASE}/admin/compras`,
    compraDetalle: (id) => `${BASE}/admin/compras/${id}`,


    // Préstamos
    prestamos: () => `${BASE}/admin/prestamos`,
    prestamoDetalle: (id) => `${BASE}/admin/prestamos/${id}`,
    prestamoDevolucion: (id) => `${BASE}/admin/prestamos/${id}/devolucion`,

    // Multas
    multas: () => `${BASE}/admin/multas`,
    multaDetalle: (id) => `${BASE}/admin/multas/${id}`,
    multaPagar: (id) => `${BASE}/admin/multas/${id}/pagar`,
  },
}

export default API
