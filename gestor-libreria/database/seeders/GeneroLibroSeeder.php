<?php

namespace Database\Seeders;

use App\Models\Genero;
use App\Models\Libro;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GeneroLibroSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $libroIds = Libro::pluck('id');
        $generoIds = Genero::pluck('id');

        foreach ($libroIds as $libroId) {
            $seleccionados = $generoIds->random(rand(1, min(3, $generoIds->count())));
            foreach ($seleccionados as $generoId) {
                DB::table('genero_libro')->insertOrIgnore([
                    'libro_id'   => $libroId,
                    'genero_id'  => $generoId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
