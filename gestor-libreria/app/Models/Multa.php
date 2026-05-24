<?php

namespace App\Models;

use Database\Factories\MultaFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Multa extends Model
{
    use HasFactory;

    protected $table = 'multas';

    protected $fillable = [
        'prestamo_id',
        'user_id',
        'dias_retraso',
        'importe',
        'estado',
    ];

    public function prestamo()
    {
        return $this->belongsTo(Prestamo::class, 'prestamo_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
