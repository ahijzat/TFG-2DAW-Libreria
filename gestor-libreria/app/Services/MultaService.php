<?php

namespace App\Services;

use App\Models\Multa;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class MultaService
{
    public const IMPORTE_POR_DIA = 0.50;

    public function alta(array $data): Multa
    {
        return DB::transaction(function () use ($data) {
            return Multa::create($data);
        });
    }

    public function generarPorRetraso(int $prestamoId, int $userId, int $diasRetraso): Multa
    {
        return $this->alta([
            'prestamo_id'  => $prestamoId,
            'user_id'      => $userId,
            'dias_retraso' => $diasRetraso,
            'importe'      => $diasRetraso * self::IMPORTE_POR_DIA,
            'estado'       => 'pendiente',
        ]);
    }

    public function actualizar(Multa $multa, array $data): Multa
    {
        return DB::transaction(function () use ($multa, $data) {
            $multa->update($data);

            return $multa->refresh()->load(['prestamo', 'user']);
        });
    }

    public function eliminar(Multa $multa): bool
    {
        return DB::transaction(function () use ($multa) {
            return (bool) $multa->delete();
        });
    }

    public function getMultas(?int $userId = null): Collection
    {
        $query = Multa::with(['user', 'prestamo'])->orderByDesc('created_at');

        if ($userId) {
            $query->where('user_id', $userId);
        }

        return $query->get();
    }

    public function getMulta(Multa $multa): Multa
    {
        return $multa->load(['prestamo', 'user']);
    }

    public function marcarPagada(Multa $multa): Multa
    {
        return DB::transaction(function () use ($multa) {
            $multa->update(['estado' => 'pagada']);

            return $multa->refresh()->load(['prestamo', 'user']);
        });
    }
}
