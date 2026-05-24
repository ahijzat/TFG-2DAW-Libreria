<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MultaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'prestamo_id'  => $this->prestamo_id,
            'user_id'      => $this->user_id,
            'dias_retraso' => $this->dias_retraso,
            'importe'      => $this->importe,
            'estado'       => $this->estado,
            'user'         => $this->whenLoaded('user', fn() => [
                'id'    => $this->user->id,
                'name'  => $this->user->name,
                'email' => $this->user->email,
            ]),
            'prestamo'     => $this->whenLoaded('prestamo', fn() => [
                'id'                      => $this->prestamo->id,
                'libro_id'                => $this->prestamo->libro_id,
                'fecha_prestamo'          => $this->prestamo->fecha_prestamo,
                'fecha_limite_devolucion' => $this->prestamo->fecha_limite_devolucion,
                'fecha_devolucion'        => $this->prestamo->fecha_devolucion,
            ]),
            'created_at'   => $this->created_at,
            'updated_at'   => $this->updated_at,
        ];
    }
}
