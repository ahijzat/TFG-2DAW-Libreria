<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarritoDetalleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'carrito_id' => $this->carrito_id,
            'libro_id' => $this->libro_id,
            'cantidad' => $this->cantidad,
            'precio_unitario' => $this->precio_unitario,
            'subtotal' => $this->subtotal,
            'libro' => $this->whenLoaded('libro', fn () => [
                'id' => $this->libro->id,
                'titulo' => $this->libro->titulo,
                'autor' => $this->libro->autor,
                'precio' => $this->libro->precio,
                'imagen' => $this->libro->imagen,
                'stock_venta' => $this->libro->stock_venta,
            ]),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}