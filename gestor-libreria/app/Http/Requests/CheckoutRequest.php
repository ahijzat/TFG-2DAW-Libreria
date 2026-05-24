<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'items' => ['nullable', 'array', 'min:1'],
            'items.*.libro_id' => ['required_with:items', 'integer', 'exists:libros,id'],
            'items.*.cantidad' => ['required_with:items', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'items.array' => 'Los items deben enviarse como una lista.',
            'items.min' => 'Debes incluir al menos un libro en el checkout.',
            'items.*.libro_id.required_with' => 'Cada item debe indicar el libro.',
            'items.*.libro_id.exists' => 'Uno de los libros seleccionados no es válido.',
            'items.*.cantidad.required_with' => 'Cada item debe indicar la cantidad.',
            'items.*.cantidad.integer' => 'La cantidad debe ser un número entero.',
            'items.*.cantidad.min' => 'La cantidad mínima por libro es 1.',
        ];
    }
}