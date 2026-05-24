<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Libro;

class StoreLibroRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {

        return $this->user()->can('create', Libro::class);

    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'titulo'            => ['required', 'string', 'max:100'],
            'autor'             => ['required', 'string', 'max:100'],
            'editorial'         => ['required', 'string', 'max:100'],
            'fecha_publicacion' => ['required', 'date'],
            'isbn'              => ['required', 'string', 'max:20', 'unique:libros,isbn'],
            'descripcion'       => ['nullable', 'string'],
            'precio'            => ['required', 'numeric', 'min:0'],
            'stock_venta'       => ['nullable', 'integer', 'min:0'],
            'stock_prestamo'    => ['nullable', 'integer', 'min:0'],
            'imagen'            => ['nullable', 'string'],
            'activo'            => ['nullable', 'boolean'],
            'generos'           => ['nullable', 'array'],
            'generos.*'         => ['integer', 'exists:generos,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'titulo.required'            => 'El título del libro es obligatorio.',
            'titulo.max'                 => 'El título no puede tener más de :max caracteres.',
            'autor.required'             => 'El autor del libro es obligatorio.',
            'autor.max'                  => 'El autor no puede tener más de :max caracteres.',
            'editorial.required'         => 'La editorial es obligatoria.',
            'editorial.max'              => 'La editorial no puede tener más de :max caracteres.',
            'fecha_publicacion.required' => 'La fecha de publicación es obligatoria.',
            'fecha_publicacion.date'     => 'La fecha de publicación debe ser una fecha válida.',
            'isbn.required'              => 'El ISBN es obligatorio.',
            'isbn.unique'                => 'Ya existe un libro con ese ISBN.',
            'isbn.max'                   => 'El ISBN no puede tener más de :max caracteres.',
            'precio.required'            => 'El precio es obligatorio.',
            'precio.numeric'             => 'El precio debe ser un número.',
            'precio.min'                 => 'El precio no puede ser negativo.',
            'stock_venta.integer'        => 'El stock de venta debe ser un número entero.',
            'stock_prestamo.integer'     => 'El stock de préstamo debe ser un número entero.',
            'generos.array'              => 'Los géneros deben enviarse como lista.',
            'generos.*.integer'          => 'Cada género debe ser un ID válido.',
            'generos.*.exists'           => 'Uno o más géneros no existen.',
        ];
    }
}
