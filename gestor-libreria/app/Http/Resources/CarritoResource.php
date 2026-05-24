<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarritoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $detalles = $this->whenLoaded('detalles', fn () => $this->detalles);

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'estado' => $this->estado,
            'cantidad_lineas' => $this->whenLoaded('detalles', fn () => $this->detalles->count()),
            'cantidad_items' => $this->whenLoaded('detalles', fn () => $this->detalles->sum('cantidad')),
            'total' => $this->whenLoaded('detalles', fn () => $this->detalles->sum('subtotal')),
            'detalles' => $this->whenLoaded('detalles', fn () => CarritoDetalleResource::collection($detalles)),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}