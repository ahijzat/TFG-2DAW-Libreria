<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Enums\RolSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'rol_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function rol() {
        return $this->belongsTo(Rol::class, 'rol_id');
    }

    public function prestamos() {
        return $this->hasMany(Prestamo::class, 'user_id');
    }

    public function compras() {
        return $this->hasMany(Compra::class, 'user_id');
    }

    public function carritos() {
        return $this->hasMany(Carrito::class, 'user_id');
    }

    public function carritoActivo() {
        return $this->hasOne(Carrito::class, 'user_id')->where('estado', 'activo');
    }

    public function multas() {
        return $this->hasMany(Multa::class, 'user_id');
    }

    public function isAdmin(): bool
    {
        // Si la relación rol ya está cargada, usa el valor en memoria
        if ($this->relationLoaded('rol') && $this->rol) {
            return $this->rol->slug->value === 'admin';
        }

        // Si no está cargada, carga y verifica
        $rolAdmin = Rol::where('slug', 'admin')->first();
        return $this->rol_id === $rolAdmin?->id;
    }
}
