<?php

namespace App\Services;

use App\Models\Prestamo;
use App\Models\Libro;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class PrestamoService
{
    public function alta(array $data): Prestamo
    {
        return DB::transaction(function () use ($data) {
            $prestamo = Prestamo::create($data);

            Libro::where('id', $prestamo->libro_id)->decrement('stock_prestamo');

            return $prestamo;
        });
    }

    public function actualizar(Prestamo $prestamo, array $data): Prestamo
    {
        return DB::transaction(function () use ($prestamo, $data) {
            $prestamo->update($data);

            return $prestamo->refresh()->load(['user', 'libro']);
        });
    }

    public function eliminar(Prestamo $prestamo): bool
    {
        return DB::transaction(function () use ($prestamo) {
            return (bool) $prestamo->delete();
        });
    }

    public function devolver(Prestamo $prestamo, MultaService $multaService): Prestamo
    {
        return DB::transaction(function () use ($prestamo, $multaService) {
            $fechaDevolucion = now();
            $hoy = $fechaDevolucion->toDateString();

            $prestamo->update([
                'fecha_devolucion' => $hoy,
                'estado'           => 'devuelto',
            ]);

            Libro::where('id', $prestamo->libro_id)->increment('stock_prestamo');

            if ($hoy > $prestamo->fecha_limite_devolucion) {
                $diasRetraso = Carbon::parse($prestamo->fecha_limite_devolucion)->diffInDays($fechaDevolucion);
                $multaService->generarPorRetraso($prestamo->id, $prestamo->user_id, $diasRetraso);
            }

            return $prestamo->refresh()->load(['user', 'libro', 'multas']);
        });
    }

    public function getPrestamos(?int $userId = null): Collection
    {
        $query = Prestamo::with(['user', 'libro'])->orderByDesc('fecha_prestamo');

        if ($userId) {
            $query->where('user_id', $userId);
        }

        return $query->get();
    }

    public function getPrestamo(Prestamo $prestamo): Prestamo
    {
        return $prestamo->load(['user', 'libro', 'multas']);
    }
}
