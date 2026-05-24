<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PagarMultaRequest;
use App\Http\Requests\StoreMultaRequest;
use App\Http\Requests\UpdateMultaRequest;
use App\Http\Resources\MultaResource;
use App\Models\Multa;
use App\Services\MultaService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class MultaController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request, MultaService $service)
    {
        $this->authorize('viewAny', Multa::class);

        $userId = $request->user()->isAdmin() ? null : $request->user()->id;

        return MultaResource::collection($service->getMultas($userId));
    }

    public function show(Multa $multa, MultaService $service)
    {
        $this->authorize('view', $multa);

        return new MultaResource($service->getMulta($multa));
    }

    public function store(StoreMultaRequest $request, MultaService $service)
    {
        $multa = $service->alta($request->validated());

        return (new MultaResource($multa))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateMultaRequest $request, Multa $multa, MultaService $service)
    {
        $multa = $service->actualizar($multa, $request->validated());

        return new MultaResource($multa);
    }

    public function destroy(Multa $multa, MultaService $service)
    {
        $this->authorize('delete', $multa);

        $service->eliminar($multa);

        return response()->json(['message' => 'Multa eliminada']);
    }

    public function marcarPagada(PagarMultaRequest $request, Multa $multa, MultaService $service)
    {
        return new MultaResource($service->marcarPagada($multa));
    }
}
