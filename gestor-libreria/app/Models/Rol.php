<?php

namespace App\Models;

use App\Enums\RolSlug;
use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    protected $table = 'roles';

    protected $fillable = [
        'name'
    ];

    protected $casts = [
        'slug' => RolSlug::class
    ];

    public function users() {
        return $this->hasMany(User::class, 'rol_id');
    }
}