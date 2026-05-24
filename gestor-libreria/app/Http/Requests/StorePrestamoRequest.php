<?php

namespace App\Http\Requests;

use App\Models\Prestamo;
use Illuminate\Foundation\Http\FormRequest;

class StorePrestamoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Prestamo::class);
    }

    public function rules(): array
    {
        return [
            'user_id'                 => 'required|exists:users,id',
            'libro_id'                => 'required|exists:libros,id',
            'fecha_prestamo'          => 'required|date',
            'fecha_limite_devolucion' => 'required|date|after:fecha_prestamo',
            'fecha_devolucion'        => 'nullable|date|after:fecha_prestamo',
            'estado'                  => 'required|string|max:50',
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required'                 => 'El usuario es obligatorio.',
            'user_id.exists'                   => 'El usuario seleccionado no es válido.',
            'libro_id.required'                => 'El libro es obligatorio.',
            'libro_id.exists'                  => 'El libro seleccionado no es válido.',
            'fecha_prestamo.required'          => 'La fecha de préstamo es obligatoria.',
            'fecha_prestamo.date'              => 'La fecha de préstamo debe ser una fecha válida.',
            'fecha_limite_devolucion.required' => 'La fecha límite de devolución es obligatoria.',
            'fecha_limite_devolucion.date'     => 'La fecha límite de devolución debe ser una fecha válida.',
            'fecha_limite_devolucion.after'    => 'La fecha límite de devolución debe ser posterior a la fecha de préstamo.',
            'fecha_devolucion.date'            => 'La fecha de devolución debe ser una fecha válida.',
            'fecha_devolucion.after'           => 'La fecha de devolución debe ser posterior a la fecha de préstamo.',
            'estado.required'                  => 'El estado es obligatorio.',
            'estado.string'                    => 'El estado debe ser texto.',
            'estado.max'                       => 'El estado no puede tener más de :max caracteres.',
        ];
    }
}
