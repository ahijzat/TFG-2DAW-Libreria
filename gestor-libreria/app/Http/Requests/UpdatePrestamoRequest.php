<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePrestamoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('prestamo'));
    }

    public function rules(): array
    {
        return [
            'user_id'                 => 'sometimes|exists:users,id',
            'libro_id'                => 'sometimes|exists:libros,id',
            'fecha_prestamo'          => 'sometimes|date',
            'fecha_limite_devolucion' => 'sometimes|date|after:fecha_prestamo',
            'fecha_devolucion'        => 'nullable|date|after:fecha_prestamo',
            'estado'                  => 'sometimes|string|max:50',
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.exists'                   => 'El usuario seleccionado no es válido.',
            'libro_id.exists'                  => 'El libro seleccionado no es válido.',
            'fecha_prestamo.date'              => 'La fecha de préstamo debe ser una fecha válida.',
            'fecha_limite_devolucion.date'     => 'La fecha límite de devolución debe ser una fecha válida.',
            'fecha_limite_devolucion.after'    => 'La fecha límite de devolución debe ser posterior a la fecha de préstamo.',
            'fecha_devolucion.date'            => 'La fecha de devolución debe ser una fecha válida.',
            'fecha_devolucion.after'           => 'La fecha de devolución debe ser posterior a la fecha de préstamo.',
            'estado.string'                    => 'El estado debe ser texto.',
            'estado.max'                       => 'El estado no puede tener más de :max caracteres.',
        ];
    }
}
