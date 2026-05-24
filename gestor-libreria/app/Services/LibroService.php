<?php

namespace App\Services;

use App\Models\Libro;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class LibroService
{
    public function alta(array $data): Libro
    {
        return DB::transaction(function () use ($data) {
            $generos = $data['generos'] ?? [];
            unset($data['generos']);

            $libro = Libro::create($data);

            if (!empty($generos)) {
                $libro->generos()->sync($generos);
            }

            return $libro->load('generos');
        });
    }

    public function actualizar(Libro $libro, array $data): Libro
    {
        return DB::transaction(function () use ($libro, $data) {
            $generos = array_key_exists('generos', $data) ? $data['generos'] : null;
            unset($data['generos']);

            $libro->update($data);

            if ($generos !== null) {
                $libro->generos()->sync($generos);
            }

            return $libro->refresh()->load('generos');
        });
    }

    public function eliminar(Libro $libro): bool
    {
        return DB::transaction(function () use ($libro) {
            return (bool) $libro->delete();
        });
    }

    public function getLibros(?int $generoId = null): Collection
    {
        return $this->buildCatalogoQuery([
            'genero_id' => $generoId,
        ], false)->get();
    }

    public function getCatalogo(?int $generoId = null): Collection
    {
        return $this->buildCatalogoQuery([
            'genero_id' => $generoId,
        ])->get();
    }

    public function getLibro(Libro $libro): Libro
    {
        return $libro->load('generos');
    }

    public function searchCatalogo(array $filters = [], bool $soloActivos = true): LengthAwarePaginator
    {
        return $this->buildCatalogoQuery($filters, $soloActivos)->paginate(12)->withQueryString();
    }

    public function getAutores(): Collection
    {
        return Libro::query()
            ->activos()
            ->select('autor')
            ->whereNotNull('autor')
            ->distinct()
            ->orderBy('autor')
            ->get();
    }

    public function getDestacados(int $limite = 8): Collection
    {
        return Libro::query()
            ->with('generos')
            ->activos()
            ->where('stock_venta', '>', 0)
            ->orderByDesc('stock_venta')
            ->orderBy('titulo')
            ->limit($limite)
            ->get();
    }

    public function getMasPopulares(int $limite = 8): Collection
    {
        return Libro::query()
            ->with('generos')
            ->activos()
            ->withSum('compraDetalles as total_vendidos', 'cantidad')
            ->orderByDesc('total_vendidos')
            ->orderBy('titulo')
            ->limit($limite)
            ->get();
    }

    public function getNovedades(int $limite = 8): Collection
    {
        return Libro::query()
            ->with('generos')
            ->activos()
            ->latest()
            ->limit($limite)
            ->get();
    }

    public function getDisponibles(int $limite = 8): Collection
    {
        return Libro::query()
            ->with('generos')
            ->activos()
            ->where('stock_venta', '>', 0)
            ->orderBy('titulo')
            ->limit($limite)
            ->get();
    }

    public function actualizarStock(Libro $libro, array $data): Libro
    {
        return DB::transaction(function () use ($libro, $data) {
            $libro->update([
                'stock_venta' => $data['stock_venta'],
                'stock_prestamo' => $data['stock_prestamo'],
            ]);

            return $libro->refresh()->load('generos');
        });
    }

    public function asignarGeneros(Libro $libro, array $generos): Libro
    {
        return DB::transaction(function () use ($libro, $generos) {
            $libro->generos()->sync($generos);

            return $libro->refresh()->load('generos');
        });
    }

    // Aliases para compatibilidad con el controlador web
    public function lista(): Collection
    {
        return $this->getLibros();
    }

    public function mostrar(Libro $libro): Libro
    {
        return $this->getLibro($libro);
    }

    public function crear(array $data): Libro
    {
        return $this->alta($data);
    }

    private function buildCatalogoQuery(array $filters = [], bool $soloActivos = true)
    {
        $query = Libro::query()->with('generos');

        if ($soloActivos) {
            $query->activos();
        }

        if (!empty($filters['texto'])) {
            $texto = trim($filters['texto']);

            $query->where(function ($subQuery) use ($texto) {
                $subQuery->where('titulo', 'like', '%' . $texto . '%')
                    ->orWhere('autor', 'like', '%' . $texto . '%')
                    ->orWhere('editorial', 'like', '%' . $texto . '%')
                    ->orWhere('descripcion', 'like', '%' . $texto . '%');
            });
        }

        $generoId = $filters['genero_id'] ?? null;
        $genero = $filters['genero'] ?? null;

        if ($generoId || $genero) {
            $query->whereHas('generos', function ($generosQuery) use ($generoId, $genero) {
                if ($generoId) {
                    $generosQuery->where('generos.id', $generoId);
                    return;
                }

                if (is_numeric($genero)) {
                    $generosQuery->where('generos.id', (int) $genero);
                    return;
                }

                $generosQuery->whereRaw('LOWER(generos.nombre) = ?', [mb_strtolower((string) $genero)]);
            });
        }

        if (!empty($filters['autor'])) {
            $query->where('autor', 'like', '%' . trim($filters['autor']) . '%');
        }

        if (isset($filters['precio_min'])) {
            $query->where('precio', '>=', $filters['precio_min']);
        }

        if (isset($filters['precio_max'])) {
            $query->where('precio', '<=', $filters['precio_max']);
        }

        if (($filters['orden'] ?? null) === 'precio_asc') {
            return $query->orderBy('precio');
        }

        if (($filters['orden'] ?? null) === 'precio_desc') {
            return $query->orderByDesc('precio');
        }

        if (($filters['orden'] ?? null) === 'novedades') {
            return $query->latest();
        }

        if (($filters['orden'] ?? null) === 'populares') {
            return $query->withSum('compraDetalles as total_vendidos', 'cantidad')
                ->orderByDesc('total_vendidos')
                ->orderBy('titulo');
        }

        return $query->orderBy('titulo');
    }
}