<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SyncLibroGenerosRequest;
use App\Http\Requests\StoreLibroRequest;
use App\Http\Requests\UpdateLibroStockRequest;
use App\Http\Requests\UpdateLibroRequest;
use App\Http\Resources\LibroResource;
use App\Models\Libro;
use App\Services\LibroService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class LibroController extends Controller
{
    use AuthorizesRequests;

    public function catalogo(Request $request, LibroService $service)
    {
        $libros = $service->searchCatalogo($this->getCatalogoFilters($request));

        return LibroResource::collection($libros);
    }

    public function index(Request $request, LibroService $service)
    {
        $soloActivos = !$request->user()?->isAdmin();

        if (!$soloActivos) {
            $this->authorize('viewAny', Libro::class);
        }

        $libros = $service->searchCatalogo($this->getCatalogoFilters($request), $soloActivos);

        return LibroResource::collection($libros);
    }


    public function show(Request $request, Libro $libro, LibroService $service)
    {
        if ($request->user()?->isAdmin()) {
            $this->authorize('view', $libro);
        } elseif (!$libro->activo) {
            abort(404);
        }

        return new LibroResource($service->getLibro($libro));
    }

    public function store(StoreLibroRequest $request, LibroService $service)
    {
        $libro = $service->alta($request->validated());

        return (new LibroResource($libro))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateLibroRequest $request, Libro $libro, LibroService $service)
    {
        $libro = $service->actualizar($libro, $request->validated());

        return new LibroResource($libro);
    }

    public function destroy(Libro $libro, LibroService $service)
    {
        $this->authorize('delete', $libro);

        $service->eliminar($libro);

        return response()->json(['message' => 'Libro eliminado']);
    }

    public function autores(LibroService $service)
    {
        return response()->json([
            'data' => $service->getAutores()->pluck('autor')->values(),
        ]);
    }

    public function actualizarStock(UpdateLibroStockRequest $request, Libro $libro, LibroService $service)
    {
        $libro = $service->actualizarStock($libro, $request->validated());

        return new LibroResource($libro);
    }

    public function asignarGeneros(SyncLibroGenerosRequest $request, Libro $libro, LibroService $service)
    {
        $libro = $service->asignarGeneros($libro, $request->validated()['generos']);

        return new LibroResource($libro);
    }

    private function getCatalogoFilters(Request $request): array
    {
        return $request->validate([
            'texto' => ['nullable', 'string', 'max:255'],
            'genero' => ['nullable', 'string', 'max:100'],
            'genero_id' => ['nullable', 'integer', 'exists:generos,id'],
            'autor' => ['nullable', 'string', 'max:100'],
            'precio_min' => ['nullable', 'numeric', 'min:0'],
            'precio_max' => ['nullable', 'numeric', 'min:0'],
            'orden' => ['nullable', 'in:titulo,precio_asc,precio_desc,novedades,populares'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);
    }
}
