<?php

namespace Database\Seeders;

use App\Models\CompraDetalle;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CompraDetalleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CompraDetalle::factory()->count(30)->create();
    }
}
