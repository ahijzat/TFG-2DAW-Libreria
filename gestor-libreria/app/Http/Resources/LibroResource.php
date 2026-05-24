<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LibroResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'titulo'            => $this->titulo,
            'autor'             => $this->autor,
            'editorial'         => $this->editorial,
            'fecha_publicacion' => $this->fecha_publicacion,
            'isbn'              => $this->isbn,
            'descripcion'       => $this->descripcion,
            'precio'            => $this->precio,
            'stock_venta'       => $this->stock_venta,
            'stock_prestamo'    => $this->stock_prestamo,
            'imagen'            => $this->imagen,
            'activo'            => $this->activo,
            'generos'           => $this->whenLoaded('generos', fn() => $this->generos->map(fn($g) => [
                'id'     => $g->id,
                'nombre' => $g->nombre,
            ])),
            'created_at'        => $this->created_at,
            'updated_at'        => $this->updated_at,
        ];
    }
}
