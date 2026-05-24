# Librería Frontend

Frontend React para la aplicación de gestión de librería. Aplicación de venta online de libros con servicio de préstamos físicos para administradores.

## Tecnologías

- **React 18** + **Vite** (JavaScript, sin TypeScript)
- **react-router-dom v6** — enrutamiento SPA
- **react-toastify** — notificaciones
- **@iconify/react** — iconos
- **dayjs** — formateo de fechas con locale español
- **CSS Modules** — estilos en español (`contenedor`, `tarjeta`, etc.)

## Estructura

```
src/
├── App.jsx              # Router principal + providers
├── main.jsx             # Punto de entrada
├── index.css            # Variables CSS globales (design system)
├── services/
│   └── api.js           # Todos los endpoints del backend
├── hooks/
│   └── useFetch.js      # Hook para llamadas a la API (fetch + auth)
├── contexts/
│   ├── AuthContext.jsx  # Estado global de autenticación
│   └── CarritoContext.jsx # Estado global del carrito
├── routes/
│   └── ProtectedRoute.jsx # Guardia de rutas
├── utils/
│   └── formatters.js    # Formateo de fechas, precios, estados
├── components/
│   ├── UI/              # LoadingSpinner, Card, BadgeEstado, EstadoVacio, ConfirmDialog
│   ├── Layout/          # Navbar, Footer
│   ├── Common/          # MiniCarrito, Pagination, SearchInput
│   └── Forms/           # LibroForm, GeneroForm, PrestamoForm
└── pages/
    ├── modules/         # Todos los CSS Modules
    ├── Shared/          # Loading, ConnectionError
    ├── Auth/            # Login, Register
    ├── Inicio/          # Página de inicio con hero y libros destacados
    ├── Catalogo/        # Listado con filtros y detalle de libro
    ├── Carrito/         # Checkout
    ├── Compras/         # Historial de compras del usuario
    ├── Prestamos/       # Préstamos del usuario con devolución
    ├── Multas/          # Multas del usuario
    ├── Perfil/          # Edición de perfil y contraseña
    └── Admin/           # Gestión admin: Libros, Géneros, Usuarios, Compras, Préstamos, Multas
```

## Variables de entorno

Crea un fichero `.env` en la raíz del proyecto (ya incluido `.env.example`):

```env
VITE_API_URL=http://localhost:8000/api
```

## Instalación y arranque

```bash
npm install
npm run dev
```

La app se sirve en **http://localhost:5173**.

## Docker

Para usar con Docker Compose junto al backend Laravel, ver `../docker-compose.yml`.

## Paleta de colores

| Token | Valor | Uso |
|---|---|---|
| `--color-primario` | `#6b4f3a` | Botones, enlaces, badges |
| `--color-primario-oscuro` | `#4e3828` | Títulos, header |
| `--color-fondo` | `#fdf6ee` | Fondo general (crema) |
| `--color-fondo-alterno` | `#f5ece0` | Secciones alternadas |

## Autenticación

- Sanctum bearer token almacenado en `localStorage` como `token_libreria`
- El hook `useFetch` gestiona automáticamente el token en cada petición
- Sesión expirada: evento `sesion:expirada` → `AuthContext` limpia el estado y redirige a `/login`
- Sin conexión: evento `conexion:fallida` → `App.jsx` muestra pantalla de error de conexión
