<?php

namespace App\Http\Requests;

use App\Models\Libro;
use Illuminate\Foundation\Http\FormRequest;

class SyncLibroGenerosRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('libro') ?? Libro::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'generos' => ['required', 'array'],
            'generos.*' => ['integer', 'exists:generos,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'generos.required' => 'Debes indicar los géneros del libro.',
            'generos.array' => 'Los géneros deben enviarse como lista.',
            'generos.*.integer' => 'Cada género debe ser un ID válido.',
            'generos.*.exists' => 'Uno o más géneros seleccionados no existen.',
        ];
    }
}