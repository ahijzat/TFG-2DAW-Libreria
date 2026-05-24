<?php

namespace App\Providers;

use App\Models\Libro;
use App\Models\User;
use App\Models\Genero;
use App\Models\Compra;
use App\Models\CompraDetalle;
use App\Models\Carrito;
use App\Models\Prestamo;
use App\Models\Multa;
use App\Models\Alquiler;
use App\Http\Policies\CompraPolicy;
use App\Http\Policies\CompraDetallePolicy;
use App\Http\Policies\CarritoPolicy;
use App\Http\Policies\GeneroPolicy;
use App\Http\Policies\UserPolicy;
use App\Http\Policies\LibroPolicy;
use App\Http\Policies\PrestamoPolicy;
use App\Http\Policies\MultaPolicy;
use App\Http\Policies\AlquilerPolicy;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{

    protected $policies = [
        User::class => UserPolicy::class,
        Libro::class => LibroPolicy::class,
        Genero::class => GeneroPolicy::class,
        Compra::class => CompraPolicy::class,
        CompraDetalle::class => CompraDetallePolicy::class,
        Carrito::class => CarritoPolicy::class,
        Prestamo::class => PrestamoPolicy::class,
        Multa::class => MultaPolicy::class,
        Alquiler::class => AlquilerPolicy::class,
    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Registrar las policies explícitamente
        foreach ($this->policies as $model => $policy) {
            Gate::policy($model, $policy);
        }
    }
}
