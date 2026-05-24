<?php

namespace App\Models;

use Database\Factories\PrestamoFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Prestamo extends Model
{
    use HasFactory;

    protected $table = 'prestamos';

    protected $fillable = [
        'user_id',
        'libro_id',
        'fecha_prestamo',
        'fecha_limite_devolucion',
        'fecha_devolucion',
        'estado',
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function libro() {
        return $this->belongsTo(Libro::class, 'libro_id');
    }

    public function multas() {
        return $this->hasMany(Multa::class, 'prestamo_id');
    }
}