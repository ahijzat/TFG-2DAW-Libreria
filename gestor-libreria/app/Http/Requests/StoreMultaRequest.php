<?php

namespace App\Http\Requests;

use App\Models\Multa;
use Illuminate\Foundation\Http\FormRequest;

class StoreMultaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Multa::class);
    }

    public function rules(): array
    {
        return [
            'prestamo_id'  => 'required|exists:prestamos,id',
            'user_id'      => 'required|exists:users,id',
            'dias_retraso' => 'required|integer|min:1',
            'importe'      => 'required|numeric|min:0',
            'estado'       => 'required|in:pendiente,pagada',
        ];
    }

    public function messages(): array
    {
        return [
            'prestamo_id.required'  => 'El préstamo es obligatorio.',
            'prestamo_id.exists'    => 'El préstamo seleccionado no es válido.',
            'user_id.required'      => 'El usuario es obligatorio.',
            'user_id.exists'        => 'El usuario seleccionado no es válido.',
            'dias_retraso.required' => 'Los días de retraso son obligatorios.',
            'dias_retraso.integer'  => 'Los días de retraso deben ser un número entero.',
            'dias_retraso.min'      => 'Los días de retraso deben ser al menos 1.',
            'importe.required'      => 'El importe es obligatorio.',
            'importe.numeric'       => 'El importe debe ser un número.',
            'importe.min'           => 'El importe no puede ser negativo.',
            'estado.required'       => 'El estado es obligatorio.',
            'estado.in'             => 'El estado debe ser pendiente o pagada.',
        ];
    }
}
