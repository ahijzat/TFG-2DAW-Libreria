<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCarritoRequest;
use App\Http\Requests\UpdateCarritoDetalleRequest;
use App\Http\Resources\CarritoResource;
use App\Models\CarritoDetalle;
use App\Services\CarritoService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class CarritoController extends Controller
{
    use AuthorizesRequests;

    public function show(Request $request, CarritoService $service)
    {
        $carrito = $service->getCarritoActivo($request->user());

        $this->authorize('view', $carrito);

        return new CarritoResource($carrito);
    }

    public function store(StoreCarritoRequest $request, CarritoService $service)
    {
        $carrito = $service->agregarLibro($request->user(), $request->validated());

        return (new CarritoResource($carrito))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateCarritoDetalleRequest $request, CarritoDetalle $detalle, CarritoService $service)
    {
        $this->authorize('update', $detalle->carrito);

        $carrito = $service->actualizarDetalle($detalle->loadMissing('libro', 'carrito'), $request->validated()['cantidad']);

        return new CarritoResource($carrito);
    }

    public function destroy(Request $request, CarritoDetalle $detalle, CarritoService $service)
    {
        $this->authorize('delete', $detalle->carrito);

        $carrito = $service->eliminarDetalle($detalle);

        return new CarritoResource($carrito);
    }

    public function vaciar(Request $request, CarritoService $service)
    {
        $carrito = $service->getCarritoActivo($request->user());

        $this->authorize('update', $carrito);

        return new CarritoResource($service->vaciar($carrito));
    }
}