<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGeneroRequest;
use App\Http\Requests\UpdateGeneroRequest;
use App\Http\Resources\GeneroResource;
use App\Models\Genero;
use App\Services\GeneroService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class GeneroController extends Controller
{
    use AuthorizesRequests;

    public function index(GeneroService $service)
    {
        return GeneroResource::collection($service->getGeneros());
    }

    public function show(Genero $genero, GeneroService $service)
    {
        $this->authorize('view', $genero);

        return new GeneroResource($service->getGenero($genero));
    }

    public function store(StoreGeneroRequest $request, GeneroService $service)
    {
        $genero = $service->alta($request->validated());

        return (new GeneroResource($genero))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateGeneroRequest $request, Genero $genero, GeneroService $service)
    {
        $genero = $service->actualizar($genero, $request->validated());

        return new GeneroResource($genero);
    }

    public function destroy(Genero $genero, GeneroService $service)
    {
        $this->authorize('delete', $genero);

        $service->eliminar($genero);

        return response()->json(['message' => 'Género eliminado']);
    }
}
