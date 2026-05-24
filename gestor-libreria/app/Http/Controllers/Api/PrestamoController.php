<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePrestamoRequest;
use App\Http\Requests\UpdatePrestamoRequest;
use App\Http\Resources\PrestamoResource;
use App\Models\Prestamo;
use App\Services\MultaService;
use App\Services\PrestamoService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class PrestamoController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request, PrestamoService $service)
    {
        $this->authorize('viewAny', Prestamo::class);

        $userId = $request->user()->isAdmin() ? null : $request->user()->id;

        return PrestamoResource::collection($service->getPrestamos($userId));
    }

    public function show(Prestamo $prestamo, PrestamoService $service)
    {
        $this->authorize('view', $prestamo);

        return new PrestamoResource($service->getPrestamo($prestamo));
    }

    public function store(StorePrestamoRequest $request, PrestamoService $service)
    {
        $prestamo = $service->alta($request->validated());

        return (new PrestamoResource($prestamo))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdatePrestamoRequest $request, Prestamo $prestamo, PrestamoService $service)
    {
        $prestamo = $service->actualizar($prestamo, $request->validated());

        return new PrestamoResource($prestamo);
    }

    public function destroy(Prestamo $prestamo, PrestamoService $service)
    {
        $this->authorize('delete', $prestamo);

        $service->eliminar($prestamo);

        return response()->json(['message' => 'Préstamo eliminado']);
    }

    public function devolver(Prestamo $prestamo, PrestamoService $service, MultaService $multaService)
    {
        $this->authorize('update', $prestamo);

        $prestamo = $service->devolver($prestamo, $multaService);

        return new PrestamoResource($prestamo);
    }
}
