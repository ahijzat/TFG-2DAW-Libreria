<?php

namespace App\Models;

use Database\Factories\GeneroFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Genero extends Model
{
    use HasFactory;

    protected $table = 'generos';

    protected $fillable = [
        'nombre',
        'descripcion',
    ];

    public function libros() {
        return $this->belongsToMany(Libro::class, 'genero_libro');
    }
}