<?php

namespace Database\Factories;

use App\Models\Prestamo;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Multa>
 */
class MultaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $diasRetraso = fake()->numberBetween(1, 30);

        return [
            'prestamo_id' => Prestamo::inRandomOrder()->first()->id,
            'user_id' => User::inRandomOrder()->first()->id,
            'dias_retraso' => $diasRetraso,
            'importe' => $diasRetraso * 0.50,
            'estado' => fake()->randomElement(['pendiente', 'pagada']),
        ];
    }
}
