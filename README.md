# TFG Gestor Libreria

Aplicacion web que integra una libreria online con un sistema de biblioteca y prestamos.

## Documentacion

Accede a la documentacion tecnica y funcional del proyecto desde la Wiki del repositorio.

- [Home](https://github.com/ahijzat/TFG-2DAW-Libreria/wiki)
- [1. Presentacion del Proyecto](https://github.com/ahijzat/TFG-2DAW-Libreria/wiki)
- [2. Funcionalidades](https://github.com/ahijzat/TFG-2DAW-Libreria/wiki)
- [3. Arquitectura](https://github.com/ahijzat/TFG-2DAW-Libreria/wiki)
- [4. Modelo Entidad-Relacion](https://github.com/ahijzat/TFG-2DAW-Libreria/wiki/EntidadRelacion)
- [5. Documentacion Tecnica](https://github.com/ahijzat/TFG-2DAW-Libreria/wiki/Documentaci%C3%B3nTecnica)

## Sobre el proyecto

TFG Gestor Libreria es una aplicacion desarrollada como Trabajo de Fin de Grado (TFG) con el objetivo de unificar en una sola plataforma la compra de libros y la gestion de prestamos bibliotecarios.

La idea principal es ofrecer un entorno donde los usuarios puedan:

- Consultar el catalogo disponible de libros.
- Comprar libros desde la web mediante una cuenta de usuario.
- Gestionar prestamos fisicos y controlar la fecha limite de devolucion.
- Consultar el historial de compras, prestamos y multas.
- Facilitar al personal administrador la gestion integral de libros, usuarios y sanciones.

## Funcionalidades

### Roles

- **Admin**: puede acceder a todas las vistas, gestionar libros, generos, usuarios, compras, prestamos y multas.
- **Cliente**: puede registrarse, iniciar sesion, comprar libros, consultar sus prestamos y revisar las multas pendientes.

### Vistas principales

- Home
- Busquedas y catalogo
- Login y registro
- Perfil de usuario
- Carrito y compras
- Prestamos y multas
- Panel de administracion

## Arquitectura

El proyecto esta dividido en dos partes principales, con un enfoque practico y mantenible.

### Frontend

El lado del cliente esta construido como una SPA orientada a una experiencia clara y rapida para el usuario.

- React 18
- Vite
- React Router DOM
- React Toastify
- Day.js
- CSS Modules

### Backend

El servidor esta desarrollado con una arquitectura basada en Laravel para exponer la API y gestionar la logica de negocio.

- Laravel
- Eloquent ORM
- MySQL
- PHPMyAdmin
- Docker

## Ejecucion y desarrollo

El proyecto puede levantarse en desarrollo mediante Docker Compose.

### Levantar el proyecto

```bash
docker compose up --build
```

### Detener los contenedores

```bash
docker compose stop
```

## Autor

**Angel Hijano Zato**  
Desarrollador y creador del TFG.
