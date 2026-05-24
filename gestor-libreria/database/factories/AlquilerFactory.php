<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Libro;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class PrestamoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $fechaPrestamo = fake()->dateTimeBetween('-3 months', 'now');
        $fechaLimite = (clone $fechaPrestamo)->modify('+15 days');
        $devuelto = fake()->boolean(50);

        return [
            "user_id" => User::inRandomOrder()->first()->id,
            "libro_id" => Libro::inRandomOrder()->first()->id,
            'fecha_prestamo' => $fechaPrestamo->format('Y-m-d'),
            'fecha_limite_devolucion' => $fechaLimite->format('Y-m-d'),
            'fecha_devolucion' => $devuelto ? fake()->dateTimeBetween($fechaPrestamo, 'now')->format('Y-m-d') : null,
            "estado" => $devuelto ? 'devuelto' : fake()->randomElement(['activo', 'retrasado']),
        ];
    }
}
