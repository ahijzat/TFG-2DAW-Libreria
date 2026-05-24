<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class CompraFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "user_id" => User::inRandomOrder()->first()->id,
            'fecha_compra' => fake()->dateTimeBetween('-1 year', 'now'),
            'total' => fake()->randomFloat(2, 10, 200),
            'estado' => fake()->randomElement(['pendiente', 'pagada', 'cancelada']),
        ];
    }
}
