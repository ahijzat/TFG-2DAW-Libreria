<?php

use App\Http\Controllers\AlquilerController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompraController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GeneroController;
use App\Http\Controllers\LibroController;
use App\Http\Controllers\UserController;
use App\Models\Alquiler;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
   return view('welcome');
});

// Route::get('/', function () {
//     return redirect(route('dashboard.index'));
// });

Route::get('/login', [AuthController::class, 'form'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth')->group(function () {

    Route::get('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');

    Route::resource('libros', LibroController::class);
    Route::resource('generos', GeneroController::class);
    Route::resource('compras', CompraController::class);
    Route::resource('alquileres', AlquilerController::class)->parameters(['alquileres' => 'alquiler']);


    Route::middleware('role:admin')->group(function () {
        Route::resource('users', UserController::class);
    });

});
