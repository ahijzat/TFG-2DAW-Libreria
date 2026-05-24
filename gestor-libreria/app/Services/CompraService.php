<?php

namespace App\Services;

use App\Models\Carrito;
use App\Models\Compra;
use App\Models\Libro;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CompraService
{
    public function alta(array $data): Compra
    {
        return DB::transaction(function () use ($data) {
            return Compra::create($data);
        });
    }

    /**
     * Crea una compra con sus detalles y descuenta el stock_venta de cada libro.
     */
    public function altaConDetalles(array $compraData, array $detalles): Compra
    {
        return DB::transaction(function () use ($compraData, $detalles) {
            $total = 0;

            foreach ($detalles as $detalle) {
                $total += $detalle['cantidad'] * $detalle['precio_unitario'];
            }

            $compraData['total'] = $total;
            $compra = Compra::create($compraData);

            foreach ($detalles as $detalle) {
                $detalle['compra_id'] = $compra->id;
                $detalle['subtotal']  = $detalle['cantidad'] * $detalle['precio_unitario'];
                $compra->detalles()->create($detalle);

                Libro::where('id', $detalle['libro_id'])
                    ->decrement('stock_venta', $detalle['cantidad']);
            }

            return $compra->load(['user', 'detalles.libro']);
        });
    }

    public function procesarCheckout(User $user, array $items = []): Compra
    {
        return DB::transaction(function () use ($user, $items) {
            $carrito = Carrito::query()
                ->with('detalles.libro')
                ->where('user_id', $user->id)
                ->where('estado', 'activo')
                ->first();

            if (empty($items) && $carrito) {
                $items = $carrito->detalles->map(fn ($detalle) => [
                    'libro_id' => $detalle->libro_id,
                    'cantidad' => $detalle->cantidad,
                ])->all();
            }

            if (empty($items)) {
                throw ValidationException::withMessages([
                    'items' => 'No hay libros para procesar la compra.',
                ]);
            }

            $detalles = [];
            $total = 0;

            foreach ($items as $item) {
                $libro = Libro::query()->lockForUpdate()->findOrFail($item['libro_id']);
                $cantidad = (int) $item['cantidad'];

                if (!$libro->activo) {
                    throw ValidationException::withMessages([
                        'items' => 'Uno de los libros seleccionados no está disponible.',
                    ]);
                }

                if ($libro->stock_venta < $cantidad) {
                    throw ValidationException::withMessages([
                        'items' => 'No hay stock suficiente para completar la compra.',
                    ]);
                }

                $precioUnitario = (float) $libro->precio;
                $subtotal = $cantidad * $precioUnitario;
                $total += $subtotal;

                $detalles[] = [
                    'libro_id' => $libro->id,
                    'cantidad' => $cantidad,
                    'precio_unitario' => $precioUnitario,
                    'subtotal' => $subtotal,
                ];
            }

            $compra = Compra::create([
                'user_id' => $user->id,
                'fecha_compra' => now(),
                'total' => $total,
                'estado' => 'pagada',
            ]);

            foreach ($detalles as $detalle) {
                $compra->detalles()->create($detalle);

                Libro::where('id', $detalle['libro_id'])
                    ->decrement('stock_venta', $detalle['cantidad']);
            }

            if ($carrito) {
                $carrito->detalles()->delete();
                $carrito->update(['estado' => 'cerrado']);
            }

            return $compra->load(['user', 'detalles.libro']);
        });
    }

    public function cambiarEstado(Compra $compra, string $estado): Compra
    {
        return DB::transaction(function () use ($compra, $estado) {
            $compra->update(['estado' => $estado]);

            return $compra->refresh()->load(['user', 'detalles.libro']);
        });
    }

    public function actualizar(Compra $compra, array $data): Compra
    {
        return DB::transaction(function () use ($compra, $data) {
            $compra->update($data);

            return $compra->refresh()->load('user');
        });
    }

    public function eliminar(Compra $compra): bool
    {
        return DB::transaction(function () use ($compra) {
            return (bool) $compra->delete();
        });
    }

    public function getCompras(?int $userId = null, ?string $estado = null): Collection
    {
        $query = Compra::with('user')->orderByDesc('fecha_compra');

        if ($userId) {
            $query->where('user_id', $userId);
        }

        if ($estado) {
            $query->where('estado', $estado);
        }

        return $query->get();
    }

    public function getCompra(Compra $compra): Compra
    {
        return $compra->load(['user', 'detalles.libro']);
    }
}
