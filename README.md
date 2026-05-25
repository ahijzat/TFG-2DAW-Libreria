# TFG Gestor Libreria — TFG DAW 2

> Plataforma web para la gestion de una libreria con tienda online, prestamos, multas, carrito y panel de administracion.

---

## Índice

1. [Vista rápida](#-vista-rápida)
2. [Instalación](#-instalación)
	- [Docker Compose](#docker-compose)
	- [Frontend](#frontend)
	- [Backend](#backend)
3. [Vídeo-manual](#-vídeo-manual)
4. [Documentación técnica](#-documentación-técnica)
	- [Arquitectura general](#arquitectura-general)
	- [Frontend](#frontend-1)
	- [Backend](#backend-1)
	- [Base de datos](#base-de-datos)
	- [API REST](#api-rest)
	- [Despliegue](#despliegue)
5. [Bitácora](#-bitácora)
6. [Bibliografía](#-bibliografía)
7. [Autor](#autor)

---

## 🔗 Vista rápida

| Recurso | Enlace |
|---|---|
| **Aplicación en producción** | [Aplicación](https://tfg-2-daw-libreria.vercel.app) |
| **Prototipado de alta fidelidad (Figma)** | [Figma](https://www.figma.com/design/WtixS9zyxeyYDeegNaMPrW/TFG-libreria?node-id=2003-2&t=fKmmQ5Tmkr0oZ77G-1) |
| **Esquema entidad-relación** | [Wiki — Entidad-Relación](https://github.com/ahijzat/TFG-2DAW-Libreria/wiki/EntidadRelacion) |
| **Documentación técnica** | [Wiki — Documentación Técnica](https://github.com/ahijzat/TFG-2DAW-Libreria/wiki/Documentaci%C3%B3nTecnica) |
| **Repositorio** | [github.com/ahijzat/TFG-2DAW-Libreria](https://github.com/ahijzat/TFG-2DAW-Libreria) |
| **Vídeo del proyecto** | [Video del proyecto](https://youtu.be/wA66uJjso2A) |

---

## 🛠 Instalación

### Requisitos previos

| Herramienta | Versión recomendada |
|---|---|
| Node.js | 18 o superior |
| npm | 9 o superior |
| PHP | 8.2 |
| Composer | 2 |
| MySQL | 8 |
| Docker | Última estable |
| Docker Compose | Última estable |

---

### Docker Compose

La forma más rápida de levantar el proyecto completo es usando Docker Compose desde la raíz del repositorio.

#### 1. Crear variables de entorno para Docker

Crea un archivo `.env` en la raíz del proyecto con un contenido similar a este:

```env
REACT_PORT=5173
BACKEND_PORT=8000
DB_PORT=3306
PMA_PORT=8080

DB_DATABASE=gestor_libreria
DB_USER=usuario1234
DB_PASSWORD=pAss1234?
DB_ROOT_PASSWORD=root1234
```

#### 2. Levantar contenedores

```bash
docker compose up --build
```

#### 3. Detener contenedores

```bash
docker compose stop
```

#### 4. Servicios disponibles

- Frontend: `http://localhost:5173`
- Backend Laravel: `http://localhost:8000`
- API: `http://localhost:8000/api`
- phpMyAdmin: `http://localhost:8080`

---

### Frontend

El frontend es una SPA con React y Vite. Se encuentra en `frontend`.

```bash
# 1. Entrar al directorio
cd frontend

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de variables de entorno
cp .env.example .env

# 4. Arrancar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

Para generar el build de producción:

```bash
npm run build
```

Variables de entorno del frontend:

```env
VITE_API_URL=http://localhost:8000/api
```

---

### Backend

El backend es una API REST con Laravel. Se encuentra en `gestor-libreria`.

```bash
# 1. Entrar al directorio
cd gestor-libreria

# 2. Instalar dependencias PHP
composer install

# 3. Crear el archivo de entorno
cp .env.example .env

# 4. Generar la clave de aplicación
php artisan key:generate

# 5. Ejecutar migraciones
php artisan migrate

# 6. Arrancar el servidor de desarrollo
php artisan serve
```

La API estará disponible en `http://localhost:8000/api`.

Configuración base del backend:

```env
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gestor_libreria
DB_USERNAME=usuario1234
DB_PASSWORD=pAss1234?
```

---

## 🎬 Vídeo-manual

Pendiente de añadir enlace.

---

## 📐 Documentación técnica

### Arquitectura general

TFG Gestor Libreria es una aplicación desacoplada compuesta por una capa cliente en React, una API REST en Laravel y una base de datos MySQL. En desarrollo, todo el entorno puede ejecutarse mediante Docker Compose.

```text
┌─────────────────────────────────────────────────────┐
│                CLIENTE (Navegador)                 │
│                                                     │
│         React SPA (Vite + React Router)            │
└───────────────────┬─────────────────────────────────┘
                    │ HTTP / JSON
┌───────────────────▼─────────────────────────────────┐
│               API REST (Laravel)                    │
│                                                     │
│  Autenticación: Laravel Sanctum                     │
│  Lógica de negocio: Services + Controllers          │
└───────────────────┬─────────────────────────────────┘
                    │ Eloquent ORM
┌───────────────────▼─────────────────────────────────┐
│              Base de datos (MySQL 8)                │
└─────────────────────────────────────────────────────┘
```

El proyecto incluye además un contenedor de phpMyAdmin para la gestión visual de la base de datos durante el desarrollo.

---

### Frontend

#### Stack

| Tecnología | Versión | Rol |
|---|---|---|
| React | 18 | Interfaz y renderizado |
| Vite | 5 | Bundler y servidor de desarrollo |
| React Router DOM | 6 | Enrutado SPA |
| React Toastify | 10 | Notificaciones |
| Day.js | 1 | Fechas y formato |
| CSS Modules | — | Estilos modulares |

#### Estructura de carpetas

```text
frontend/src/
├── App.jsx
├── main.jsx
├── index.css
├── services/
│   └── api.js
├── hooks/
│   └── useFetch.js
├── contexts/
│   ├── AuthContext.jsx
│   └── CarritoContext.jsx
├── routes/
│   └── ProtectedRoute.jsx
├── utils/
│   └── formatters.js
├── components/
│   ├── UI/
│   ├── Layout/
│   ├── Common/
│   └── Forms/
└── pages/
    ├── Admin/
    ├── Auth/
    ├── Carrito/
    ├── Catalogo/
    ├── Compras/
    ├── Inicio/
    ├── Legal/
    ├── Multas/
    ├── Perfil/
    ├── Prestamos/
    ├── Shared/
    └── modules/
```

#### Características principales del frontend

- Autenticación persistida mediante contexto global.
- Gestión de carrito mediante `CarritoContext`.
- Consumo centralizado de endpoints a través de `services/api.js`.
- Rutas protegidas con control de acceso.
- Separación entre componentes reutilizables, formularios y páginas completas.

---

### Backend

#### Stack

| Tecnología | Versión | Rol |
|---|---|---|
| PHP | 8.2 | Lenguaje |
| Laravel | 12 | Framework backend |
| Laravel Sanctum | 4 | Autenticación por token |
| Eloquent ORM | — | Acceso a base de datos |
| MySQL | 8 | Persistencia |
| Docker | — | Contenerización |

#### Estructura de carpetas

```text
gestor-libreria/
├── app/
│   ├── Enums/
│   ├── Http/
│   │   ├── Controllers/
│   │   ├── Middleware/
│   │   ├── Policies/
│   │   ├── Requests/
│   │   └── Resources/
│   ├── Models/
│   ├── Providers/
│   └── Services/
├── bootstrap/
├── config/
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/
├── public/
├── resources/
├── routes/
│   ├── api.php
│   └── web.php
└── tests/
```

#### Características principales del backend

- API REST para autenticación, catálogo, carrito, compras, préstamos y multas.
- Gestión de usuarios y roles mediante Laravel Sanctum.
- Servicios dedicados para encapsular la lógica de negocio.
- Organización por controladores, requests, policies y resources.
- Soporte para operaciones administrativas sobre libros, géneros, usuarios y seguimiento de préstamos.

Los roles definidos actualmente son:

| Rol | Descripción |
|---|---|
| `admin` | Acceso a gestión y operaciones administrativas |
| `user` | Usuario cliente de la plataforma |

---

### Base de datos

#### Entidades principales

| Tabla / Entidad | Descripción |
|---|---|
| `users` | Usuarios registrados |
| `rols` / `roles` | Roles del sistema |
| `libros` | Catálogo de libros |
| `generos` | Géneros literarios |
| `carritos` | Carritos activos por usuario |
| `carrito_detalles` | Líneas del carrito |
| `compras` | Cabecera de compras |
| `compra_detalles` | Detalle de libros comprados |
| `prestamos` | Préstamos activos e históricos |
| `multas` | Multas vinculadas a préstamos o usuarios |

#### Relaciones de dominio

- Un usuario tiene un rol.
- Un usuario puede tener carrito, compras, préstamos y multas.
- Un libro puede pertenecer a uno o varios géneros.
- Una compra contiene múltiples detalles.
- Un carrito contiene múltiples líneas de detalle.
- Los préstamos pueden derivar en multas cuando se supera la fecha de devolución.

---

### API REST

Base URL local: `http://localhost:8000/api`

#### Públicas

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/login` | Iniciar sesión |
| POST | `/register` | Registrar usuario |
| GET | `/inicio` | Datos para la página de inicio |
| GET | `/libros` | Listado de libros |
| GET | `/libros/{libro}` | Detalle de un libro |
| GET | `/autores` | Listado de autores |
| GET | `/generos` | Listado de géneros |
| GET | `/catalogo/libros` | Catálogo público |

#### Autenticadas

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/me` | Datos del usuario autenticado |
| POST | `/logout` | Cerrar sesión |
| GET | `/perfil` | Ver perfil |
| POST | `/checkout` | Procesar compra |
| GET | `/carrito` | Ver carrito |
| POST | `/carrito` | Añadir al carrito |
| PATCH | `/carrito/{detalle}` | Actualizar línea del carrito |
| DELETE | `/carrito/{detalle}` | Eliminar línea del carrito |
| POST | `/carrito/vaciar` | Vaciar carrito |
| GET | `/compras` | Historial de compras |
| GET | `/prestamos` | Historial de préstamos |
| PATCH | `/prestamos/{prestamo}/devolver` | Marcar devolución |
| GET | `/multas` | Listado de multas |

#### Administración

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/usuarios` | Listar usuarios |
| PUT | `/usuarios/{user}` | Editar usuario |
| PUT | `/usuarios/{user}/password` | Cambiar contraseña |
| PUT | `/usuarios/{user}/rol` | Cambiar rol |
| GET/POST/PUT/DELETE | `/admin/libros` | Gestión de libros |
| PATCH | `/admin/libros/{libro}/stock` | Actualizar stock |
| PATCH | `/admin/libros/{libro}/generos` | Asignar géneros |
| GET/POST/PUT/DELETE | `/admin/generos` | Gestión de géneros |
| GET | `/admin/compras` | Consultar compras |
| GET/POST | `/admin/prestamos` | Gestión de préstamos |
| PATCH | `/admin/prestamos/{prestamo}/devolucion` | Registrar devolución |
| GET | `/admin/multas` | Consultar multas |
| PATCH | `/admin/multas/{multa}/pagar` | Marcar multa como pagada |

---

### Despliegue

Actualmente el proyecto está preparado para desarrollo local con Docker Compose.

| Capa | Estado |
|---|---|
| Frontend | Pendiente de añadir enlace de despliegue |
| Backend | Pendiente de añadir enlace de despliegue |
| Base de datos | MySQL 8 en Docker para entorno local |
| Administración DB | phpMyAdmin en Docker |

Variables a completar cuando despliegues el proyecto en producción:

**Frontend**

```env
VITE_API_URL=https://tu-backend/api
```

**Backend**

```env
APP_ENV=production
APP_KEY=pendiente
APP_URL=https://tu-backend
DB_HOST=pendiente
DB_DATABASE=pendiente
DB_USERNAME=pendiente
DB_PASSWORD=pendiente
```

---

## 📋 Bitácora

| Fase | Actividades |
|---|---|
| Análisis | Definición del problema, alcance del TFG y requisitos funcionales |
| Diseño | Diseño de vistas, flujo de navegación y prototipado en Figma |
| Backend | Modelado de datos, desarrollo de API REST y autenticación |
| Frontend | Construcción de SPA, catálogo, carrito, perfil y panel admin |
| Integración | Conexión frontend-backend, validaciones y pruebas funcionales |
| Despliegue | Dockerización, configuración de entorno y documentación final |

---

## 📚 Bibliografía

### Documentación oficial

- **React** — [react.dev](https://react.dev/)
- **Vite** — [vitejs.dev](https://vitejs.dev/)
- **React Router DOM** — [reactrouter.com](https://reactrouter.com/)
- **Laravel** — [laravel.com/docs](https://laravel.com/docs)
- **Laravel Sanctum** — [laravel.com/docs/sanctum](https://laravel.com/docs/sanctum)
- **Eloquent ORM** — [laravel.com/docs/eloquent](https://laravel.com/docs/eloquent)
- **MySQL** — [dev.mysql.com/doc](https://dev.mysql.com/doc/)
- **Docker** — [docs.docker.com](https://docs.docker.com/)

### Recursos adicionales

- **PHP Manual** — [php.net/docs.php](https://www.php.net/docs.php)
- **Day.js** — [day.js.org](https://day.js.org/)
- **React Toastify** — [fkhadra.github.io/react-toastify](https://fkhadra.github.io/react-toastify/introduction)
- **phpMyAdmin** — [phpmyadmin.net](https://www.phpmyadmin.net/)
- **Figma** — [figma.com](https://www.figma.com/)

---

## Autor

**Angel Hijano Zato**  
Desarrollo de Aplicaciones Web — DAW 2
