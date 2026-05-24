<?php

namespace Database\Seeders;

use App\Models\Multa;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MultaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Multa::factory()->count(10)->create();
    }
}
