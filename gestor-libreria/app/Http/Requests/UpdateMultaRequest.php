<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMultaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('multa'));
    }

    public function rules(): array
    {
        return [
            'dias_retraso' => 'sometimes|integer|min:1',
            'importe'      => 'sometimes|numeric|min:0',
            'estado'       => 'sometimes|in:pendiente,pagada',
        ];
    }

    public function messages(): array
    {
        return [
            'dias_retraso.integer' => 'Los días de retraso deben ser un número entero.',
            'dias_retraso.min'     => 'Los días de retraso deben ser al menos 1.',
            'importe.numeric'      => 'El importe debe ser un número.',
            'importe.min'          => 'El importe no puede ser negativo.',
            'estado.in'            => 'El estado debe ser pendiente o pagada.',
        ];
    }
}
