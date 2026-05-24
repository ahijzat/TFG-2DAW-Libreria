<?php

namespace App\Models;

use Database\Factories\CarritoDetalleFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CarritoDetalle extends Model
{
    use HasFactory;

    protected $table = 'carrito_detalles';

    protected $fillable = [
        'carrito_id',
        'libro_id',
        'cantidad',
        'precio_unitario',
        'subtotal',
    ];

    public function carrito(): BelongsTo
    {
        return $this->belongsTo(Carrito::class, 'carrito_id');
    }

    public function libro(): BelongsTo
    {
        return $this->belongsTo(Libro::class, 'libro_id');
    }
}