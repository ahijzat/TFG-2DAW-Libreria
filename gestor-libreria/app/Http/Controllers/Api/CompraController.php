<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCompraRequest;
use App\Http\Requests\UpdateCompraEstadoRequest;
use App\Http\Requests\UpdateCompraRequest;
use App\Http\Resources\CompraResource;
use App\Models\Compra;
use App\Services\CompraService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class CompraController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request, CompraService $service)
    {
        $this->authorize('viewAny', Compra::class);

        $userId = $request->user()->isAdmin() ? null : $request->user()->id;
        $estado = $request->query('estado');
        $estadosValidos = ['pendiente', 'pagada', 'cancelada'];

        if (!in_array($estado, $estadosValidos, true)) {
            $estado = null;
        }

        return CompraResource::collection($service->getCompras($userId, $estado));
    }

    public function show(Compra $compra, CompraService $service)
    {
        $this->authorize('view', $compra);

        return new CompraResource($service->getCompra($compra));
    }

    public function store(StoreCompraRequest $request, CompraService $service)
    {
        $compra = $service->alta($request->validated());

        return (new CompraResource($compra))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateCompraRequest $request, Compra $compra, CompraService $service)
    {
        $compra = $service->actualizar($compra, $request->validated());

        return new CompraResource($compra);
    }

    public function destroy(Compra $compra, CompraService $service)
    {
        $this->authorize('delete', $compra);

        $service->eliminar($compra);

        return response()->json(['message' => 'Compra eliminada']);
    }

    public function cambiarEstado(UpdateCompraEstadoRequest $request, Compra $compra, CompraService $service)
    {
        $compra = $service->cambiarEstado($compra, $request->validated()['estado']);

        return new CompraResource($compra);
    }
}
