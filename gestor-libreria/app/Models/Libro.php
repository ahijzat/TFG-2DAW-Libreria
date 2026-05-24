<?php

namespace App\Models;

use Database\Factories\LibroFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Libro extends Model
{
    use HasFactory;

    protected $table = 'libros';

    protected $fillable = [
        'titulo',
        'autor',
        'editorial',
        'fecha_publicacion',
        'isbn',
        'descripcion',
        'precio',
        'stock_venta',
        'stock_prestamo',
        'imagen',
        'activo',
    ];

    public function prestamos() {
        return $this->hasMany(Prestamo::class, 'libro_id');
    }

    public function compras() {
        return $this->hasMany(Compra::class, 'libro_id');
    }

    public function compraDetalles() {
        return $this->hasMany(CompraDetalle::class, 'libro_id');
    }

    public function carritoDetalles() {
        return $this->hasMany(CarritoDetalle::class, 'libro_id');
    }

    public function generos() {
        return $this->belongsToMany(Genero::class, 'genero_libro');
    }

    public function scopeActivos($query) {
        return $query->where('activo', true);
    }
}