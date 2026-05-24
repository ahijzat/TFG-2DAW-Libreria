<?php

namespace Database\Factories;

use App\Models\Carrito;
use App\Models\Libro;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CarritoDetalle>
 */
class CarritoDetalleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $cantidad = fake()->numberBetween(1, 3);
        $precioUnitario = fake()->randomFloat(2, 5, 50);

        return [
            'carrito_id' => Carrito::query()->inRandomOrder()->value('id') ?? Carrito::factory(),
            'libro_id' => Libro::query()->inRandomOrder()->value('id') ?? Libro::factory(),
            'cantidad' => $cantidad,
            'precio_unitario' => $precioUnitario,
            'subtotal' => $cantidad * $precioUnitario,
        ];
    }
}