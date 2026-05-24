<?php

namespace App\Http\Requests;

use App\Models\Libro;
use Illuminate\Foundation\Http\FormRequest;

class UpdateLibroStockRequest extends FormRequest
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
            'stock_venta' => ['required', 'integer', 'min:0'],
            'stock_prestamo' => ['required', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'stock_venta.required' => 'El stock de venta es obligatorio.',
            'stock_venta.integer' => 'El stock de venta debe ser un número entero.',
            'stock_venta.min' => 'El stock de venta no puede ser negativo.',
            'stock_prestamo.required' => 'El stock de préstamo es obligatorio.',
            'stock_prestamo.integer' => 'El stock de préstamo debe ser un número entero.',
            'stock_prestamo.min' => 'El stock de préstamo no puede ser negativo.',
        ];
    }
}