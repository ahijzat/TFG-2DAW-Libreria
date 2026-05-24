<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Genero;

class StoreGeneroRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {

        return $this->user()->can('create', Genero::class);

    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:50',
            'descripcion' => 'required|string|max:255',
            'edad_recomendada' => 'required|integer|max:50',
        ];
    }

        public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre del género es obligatorio.',
            'nombre.unique' => 'Ya existe un género con ese nombre.',
            'nombre.string' => 'El nombre debe ser texto.',
            'nombre.max' => 'El nombre no puede tener más de :max caracteres.',

            'descripcion.required' => 'La descripción del género es obligatoria.',
            'descripcion.string' => 'La descripción debe ser texto.',
            'descripcion.max' => 'La descripción no puede tener más de :max caracteres.',

            'edad_recomendada.required' => 'La edad recomendada del género es obligatoria.',
            'edad_recomendada.integer' => 'La edad recomendada debe ser un número entero.',
            'edad_recomendada.max' => 'La edad recomendada no puede ser mayor de :max años.',
        ];
    }
}
