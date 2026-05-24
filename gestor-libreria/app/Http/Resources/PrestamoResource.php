<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrestamoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                      => $this->id,
            'user_id'                 => $this->user_id,
            'libro_id'                => $this->libro_id,
            'fecha_prestamo'          => $this->fecha_prestamo,
            'fecha_limite_devolucion' => $this->fecha_limite_devolucion,
            'fecha_devolucion'        => $this->fecha_devolucion,
            'estado'                  => $this->estado,
            'user'                    => $this->whenLoaded('user', fn() => [
                'id'    => $this->user->id,
                'name'  => $this->user->name,
                'email' => $this->user->email,
            ]),
            'libro'                   => $this->whenLoaded('libro', fn() => [
                'id'     => $this->libro->id,
                'titulo' => $this->libro->titulo,
                'autor'  => $this->libro->autor,
            ]),
            'multas'                  => $this->whenLoaded('multas', fn() => $this->multas->map(fn($m) => [
                'id'           => $m->id,
                'dias_retraso' => $m->dias_retraso,
                'importe'      => $m->importe,
                'estado'       => $m->estado,
            ])),
            'created_at'              => $this->created_at,
            'updated_at'              => $this->updated_at,
        ];
    }
}
