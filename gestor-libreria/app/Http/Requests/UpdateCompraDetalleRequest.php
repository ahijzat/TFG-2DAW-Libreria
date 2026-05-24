<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCompraDetalleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('detalle'));
    }

    public function rules(): array
    {
        return [
            'libro_id'        => 'sometimes|exists:libros,id',
            'cantidad'        => 'sometimes|integer|min:1',
            'precio_unitario' => 'sometimes|numeric|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'libro_id.exists'          => 'El libro seleccionado no es válido.',
            'cantidad.integer'         => 'La cantidad debe ser un número entero.',
            'cantidad.min'             => 'La cantidad debe ser al menos 1.',
            'precio_unitario.numeric'  => 'El precio unitario debe ser un número.',
            'precio_unitario.min'      => 'El precio unitario no puede ser negativo.',
        ];
    }
}
