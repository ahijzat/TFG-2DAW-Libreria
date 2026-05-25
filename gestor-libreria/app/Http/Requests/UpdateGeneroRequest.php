<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Genero;

class UpdateGeneroRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {

        return $this->user()->can('update', $this->route('genero'));

    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $id = $this->route('genero')?->id;

        return [
            'nombre' => "required|string|max:50|unique:generos,nombre,{$id}",
            'descripcion' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre del género es obligatorio.',
            'nombre.unique' => 'Ya existe un género con ese nombre.',
            'nombre.string' => 'El nombre debe ser texto.',
            'nombre.max' => 'El nombre no puede tener más de :max caracteres.',
            'descripcion.string' => 'La descripción debe ser texto.',
            'descripcion.max' => 'La descripción no puede tener más de :max caracteres.',
        ];
    }
}
