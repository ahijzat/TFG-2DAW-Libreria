<?php

namespace App\Services;

use App\Models\Genero;
use Illuminate\Database\Eloquent\Collection;

class GeneroService
{
    public function alta(array $data): Genero
    {
        return Genero::create($data);
    }

    public function actualizar(Genero $genero, array $data): Genero
    {
        $genero->update($data);

        return $genero->refresh();
    }

    public function eliminar(Genero $genero): bool
    {
        return (bool) $genero->delete();
    }

    public function getGeneros(): Collection
    {
        return Genero::orderBy('nombre')->get();
    }

    public function getGenero(Genero $genero): Genero
    {
        return $genero->load('libros');
    }
}
