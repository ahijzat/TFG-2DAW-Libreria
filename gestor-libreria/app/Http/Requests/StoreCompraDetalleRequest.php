<?php

namespace App\Http\Requests;

use App\Models\CompraDetalle;
use Illuminate\Foundation\Http\FormRequest;

class StoreCompraDetalleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', CompraDetalle::class);
    }

    public function rules(): array
    {
        return [
            'libro_id'        => 'required|exists:libros,id',
            'cantidad'        => 'required|integer|min:1',
            'precio_unitario' => 'required|numeric|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'libro_id.required'        => 'El libro es obligatorio.',
            'libro_id.exists'          => 'El libro seleccionado no es válido.',
            'cantidad.required'        => 'La cantidad es obligatoria.',
            'cantidad.integer'         => 'La cantidad debe ser un número entero.',
            'cantidad.min'             => 'La cantidad debe ser al menos 1.',
            'precio_unitario.required' => 'El precio unitario es obligatorio.',
            'precio_unitario.numeric'  => 'El precio unitario debe ser un número.',
            'precio_unitario.min'      => 'El precio unitario no puede ser negativo.',
        ];
    }
}
