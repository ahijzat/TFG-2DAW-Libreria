<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CarritoController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\CompraController;
use App\Http\Controllers\Api\CompraDetalleController;
use App\Http\Controllers\Api\GeneroController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\LibroController;
use App\Http\Controllers\Api\MultaController;
use App\Http\Controllers\Api\PerfilController;
use App\Http\Controllers\Api\PrestamoController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [UserController::class, 'store']);
Route::get('/inicio', [HomeController::class, 'index']);
Route::get('/libros', [LibroController::class, 'index']);
Route::get('/libros/{libro}', [LibroController::class, 'show']);
Route::get('/autores', [LibroController::class, 'autores']);
Route::get('/generos', [GeneroController::class, 'index']);
Route::get('/catalogo/libros', [LibroController::class, 'catalogo']);

Route::middleware('auth:sanctum')->group(function () {

    Route::as('api.')->group(function () {

        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/perfil', [PerfilController::class, 'show']);
        Route::post('/checkout', [CheckoutController::class, 'procesarCompra']);

        Route::get('/carrito', [CarritoController::class, 'show']);
        Route::post('/carrito', [CarritoController::class, 'store']);
        Route::patch('/carrito/{detalle}', [CarritoController::class, 'update']);
        Route::delete('/carrito/{detalle}', [CarritoController::class, 'destroy']);
        Route::post('/carrito/vaciar', [CarritoController::class, 'vaciar']);

        Route::post('/libros', [LibroController::class, 'store']);
        Route::put('/libros/{libro}', [LibroController::class, 'update']);
        Route::delete('/libros/{libro}', [LibroController::class, 'destroy']);

        Route::post('/generos', [GeneroController::class, 'store']);
        Route::get('/generos/{genero}', [GeneroController::class, 'show']);
        Route::put('/generos/{genero}', [GeneroController::class, 'update']);
        Route::delete('/generos/{genero}', [GeneroController::class, 'destroy']);

        Route::get('/compras', [CompraController::class, 'index']);
        Route::post('/compras', [CompraController::class, 'store']);
        Route::get('/compras/{compra}', [CompraController::class, 'show']);
        Route::put('/compras/{compra}', [CompraController::class, 'update']);
        Route::delete('/compras/{compra}', [CompraController::class, 'destroy']);

        Route::get('/prestamos', [PrestamoController::class, 'index']);
        Route::post('/prestamos', [PrestamoController::class, 'store']);
        Route::get('/prestamos/{prestamo}', [PrestamoController::class, 'show']);
        Route::put('/prestamos/{prestamo}', [PrestamoController::class, 'update']);
        Route::delete('/prestamos/{prestamo}', [PrestamoController::class, 'destroy']);
        Route::patch('/prestamos/{prestamo}/devolver', [PrestamoController::class, 'devolver']);

        // Multas
        Route::get('/multas', [MultaController::class, 'index']);
        Route::post('/multas', [MultaController::class, 'store']);
        Route::get('/multas/{multa}', [MultaController::class, 'show']);
        Route::put('/multas/{multa}', [MultaController::class, 'update']);
        Route::delete('/multas/{multa}', [MultaController::class, 'destroy']);

        // Detalles de compra (sub-recurso)
        Route::get('/compras/{compra}/detalles', [CompraDetalleController::class, 'index']);
        Route::post('/compras/{compra}/detalles', [CompraDetalleController::class, 'store']);
        Route::get('/compras/{compra}/detalles/{detalle}', [CompraDetalleController::class, 'show']);
        Route::put('/compras/{compra}/detalles/{detalle}', [CompraDetalleController::class, 'update']);
        Route::delete('/compras/{compra}/detalles/{detalle}', [CompraDetalleController::class, 'destroy']);

        // Usuarios
        Route::get('/usuarios', [UserController::class, 'index']);
        Route::get('/usuarios/{user}', [UserController::class, 'show']);
        Route::put('/usuarios/{user}', [UserController::class, 'update']);
        Route::delete('/usuarios/{user}', [UserController::class, 'destroy']);
        Route::put('/usuarios/{user}/password', [UserController::class, 'updatePassword']);
        Route::put('/usuarios/{user}/rol', [UserController::class, 'updateRol']);

        Route::prefix('admin')->group(function () {
            Route::get('/libros', [LibroController::class, 'index']);
            Route::post('/libros', [LibroController::class, 'store']);
            Route::get('/libros/{libro}', [LibroController::class, 'show']);
            Route::put('/libros/{libro}', [LibroController::class, 'update']);
            Route::delete('/libros/{libro}', [LibroController::class, 'destroy']);
            Route::patch('/libros/{libro}/stock', [LibroController::class, 'actualizarStock']);
            Route::patch('/libros/{libro}/generos', [LibroController::class, 'asignarGeneros']);

            Route::get('/generos', [GeneroController::class, 'index']);
            Route::post('/generos', [GeneroController::class, 'store']);
            Route::get('/generos/{genero}', [GeneroController::class, 'show']);
            Route::put('/generos/{genero}', [GeneroController::class, 'update']);
            Route::delete('/generos/{genero}', [GeneroController::class, 'destroy']);

            Route::get('/usuarios', [UserController::class, 'index']);
            Route::get('/usuarios/{user}', [UserController::class, 'show']);
            Route::put('/usuarios/{user}', [UserController::class, 'update']);
            Route::delete('/usuarios/{user}', [UserController::class, 'destroy']);

            Route::get('/compras', [CompraController::class, 'index']);
            Route::get('/compras/{compra}', [CompraController::class, 'show']);

            Route::get('/prestamos', [PrestamoController::class, 'index']);
            Route::post('/prestamos', [PrestamoController::class, 'store']);
            Route::get('/prestamos/{prestamo}', [PrestamoController::class, 'show']);
            Route::patch('/prestamos/{prestamo}/devolucion', [PrestamoController::class, 'devolver']);

            Route::get('/multas', [MultaController::class, 'index']);
            Route::get('/multas/{multa}', [MultaController::class, 'show']);
            Route::patch('/multas/{multa}/pagar', [MultaController::class, 'marcarPagada']);
        });
    });

});