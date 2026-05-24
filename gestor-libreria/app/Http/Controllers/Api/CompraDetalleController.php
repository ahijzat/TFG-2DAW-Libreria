<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCompraDetalleRequest;
use App\Http\Requests\UpdateCompraDetalleRequest;
use App\Http\Resources\CompraDetalleResource;
use App\Models\Compra;
use App\Models\CompraDetalle;
use App\Services\CompraDetalleService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class CompraDetalleController extends Controller
{
    use AuthorizesRequests;

    public function index(Compra $compra, CompraDetalleService $service)
    {
        $this->authorize('view', $compra);

        return CompraDetalleResource::collection($service->getDetalles($compra));
    }

    public function show(Compra $compra, CompraDetalle $detalle, CompraDetalleService $service)
    {
        $this->authorize('view', $detalle);

        return new CompraDetalleResource($service->getDetalle($detalle));
    }

    public function store(StoreCompraDetalleRequest $request, Compra $compra, CompraDetalleService $service)
    {
        $detalle = $service->alta($compra, $request->validated());

        return (new CompraDetalleResource($detalle))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateCompraDetalleRequest $request, Compra $compra, CompraDetalle $detalle, CompraDetalleService $service)
    {
        $detalle = $service->actualizar($detalle, $request->validated());

        return new CompraDetalleResource($detalle);
    }

    public function destroy(Compra $compra, CompraDetalle $detalle, CompraDetalleService $service)
    {
        $this->authorize('delete', $detalle);

        $service->eliminar($detalle);

        return response()->json(['message' => 'Detalle eliminado']);
    }
}
