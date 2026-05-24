<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class LibroFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "titulo" => fake()->sentence(3),
            "autor" => fake()->name(),
            "editorial" => fake()->company(),
            "fecha_publicacion" => fake()->date(),
            "isbn" => fake()->unique()->numerify('####################'),
            "descripcion" => fake()->paragraph(),
            "precio" => fake()->randomFloat(2, 5, 50),
            "stock_venta" => fake()->numberBetween(0, 100),
            "stock_prestamo" => fake()->numberBetween(0, 20),
            "imagen" => null,
            "activo" => true,
        ];
    }
}
