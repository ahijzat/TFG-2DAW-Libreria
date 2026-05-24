<?php

namespace App\Services;

use App\Models\Compra;
use App\Models\CompraDetalle;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class CompraDetalleService
{
    public function alta(Compra $compra, array $data): CompraDetalle
    {
        return DB::transaction(function () use ($compra, $data) {
            $data['compra_id'] = $compra->id;
            $data['subtotal']  = $data['cantidad'] * $data['precio_unitario'];

            return CompraDetalle::create($data);
        });
    }

    public function actualizar(CompraDetalle $detalle, array $data): CompraDetalle
    {
        return DB::transaction(function () use ($detalle, $data) {
            if (isset($data['cantidad']) || isset($data['precio_unitario'])) {
                $cantidad       = $data['cantidad']        ?? $detalle->cantidad;
                $precioUnitario = $data['precio_unitario'] ?? $detalle->precio_unitario;
                $data['subtotal'] = $cantidad * $precioUnitario;
            }

            $detalle->update($data);

            return $detalle->refresh()->load('libro');
        });
    }

    public function eliminar(CompraDetalle $detalle): bool
    {
        return DB::transaction(function () use ($detalle) {
            return (bool) $detalle->delete();
        });
    }

    public function getDetalles(Compra $compra): Collection
    {
        return $compra->detalles()->with('libro')->get();
    }

    public function getDetalle(CompraDetalle $detalle): CompraDetalle
    {
        return $detalle->load('libro');
    }
}
