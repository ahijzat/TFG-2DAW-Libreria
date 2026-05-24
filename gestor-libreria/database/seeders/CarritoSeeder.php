<?php

namespace Database\Seeders;

use App\Models\Carrito;
use App\Models\Libro;
use App\Models\User;
use Illuminate\Database\Seeder;

class CarritoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (!User::query()->exists() || !Libro::query()->exists()) {
            return;
        }

        $users = User::query()->take(3)->get();
        $libros = Libro::query()->take(6)->get();

        foreach ($users as $user) {
            $carrito = Carrito::factory()->create([
                'user_id' => $user->id,
                'estado' => 'activo',
            ]);

            foreach ($libros->random(min(2, $libros->count())) as $libro) {
                $cantidad = fake()->numberBetween(1, 2);

                $carrito->detalles()->create([
                    'libro_id' => $libro->id,
                    'cantidad' => $cantidad,
                    'precio_unitario' => $libro->precio,
                    'subtotal' => $cantidad * $libro->precio,
                ]);
            }
        }
    }
}