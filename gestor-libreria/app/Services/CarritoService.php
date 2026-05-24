<?php

namespace App\Services;

use App\Models\Carrito;
use App\Models\CarritoDetalle;
use App\Models\Libro;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CarritoService
{
    public function getCarritoActivo(User $user): Carrito
    {
        return Carrito::query()
            ->with('detalles.libro')
            ->firstOrCreate(
                [
                    'user_id' => $user->id,
                    'estado' => 'activo',
                ]
            )
            ->load('detalles.libro');
    }

    public function agregarLibro(User $user, array $data): Carrito
    {
        return DB::transaction(function () use ($user, $data) {
            $carrito = $this->getCarritoActivo($user);
            $libro = Libro::query()->findOrFail($data['libro_id']);

            $this->validarStock($libro, $data['cantidad']);

            /** @var CarritoDetalle|null $detalle */
            $detalle = $carrito->detalles()
                ->where('libro_id', $libro->id)
                ->first();

            if ($detalle) {
                $nuevaCantidad = $detalle->cantidad + $data['cantidad'];
                $this->validarStock($libro, $nuevaCantidad);

                $detalle->update([
                    'cantidad' => $nuevaCantidad,
                    'precio_unitario' => $libro->precio,
                    'subtotal' => $nuevaCantidad * $libro->precio,
                ]);
            } else {
                $carrito->detalles()->create([
                    'libro_id' => $libro->id,
                    'cantidad' => $data['cantidad'],
                    'precio_unitario' => $libro->precio,
                    'subtotal' => $data['cantidad'] * $libro->precio,
                ]);
            }

            return $this->getCarritoActivo($user);
        });
    }

    public function actualizarDetalle(CarritoDetalle $detalle, int $cantidad): Carrito
    {
        return DB::transaction(function () use ($detalle, $cantidad) {
            $this->validarStock($detalle->libro, $cantidad);

            $detalle->update([
                'cantidad' => $cantidad,
                'precio_unitario' => $detalle->libro->precio,
                'subtotal' => $cantidad * $detalle->libro->precio,
            ]);

            return $detalle->carrito->fresh(['detalles.libro']);
        });
    }

    public function eliminarDetalle(CarritoDetalle $detalle): Carrito
    {
        return DB::transaction(function () use ($detalle) {
            $carrito = $detalle->carrito;
            $detalle->delete();

            return $carrito->fresh(['detalles.libro']);
        });
    }

    public function vaciar(Carrito $carrito): Carrito
    {
        return DB::transaction(function () use ($carrito) {
            $carrito->detalles()->delete();

            return $carrito->fresh(['detalles.libro']);
        });
    }

    private function validarStock(Libro $libro, int $cantidad): void
    {
        if (!$libro->activo) {
            throw ValidationException::withMessages([
                'libro_id' => 'El libro seleccionado no está disponible.',
            ]);
        }

        if ($libro->stock_venta < $cantidad) {
            throw ValidationException::withMessages([
                'cantidad' => 'No hay suficiente stock de venta para ese libro.',
            ]);
        }
    }
}