<?php

namespace App\Http\Policies;

use App\Models\Prestamo;
use App\Models\User;

class PrestamoPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Prestamo $prestamo): bool
    {
        return $user->isAdmin() || $user->id === $prestamo->user_id;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Prestamo $prestamo): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Prestamo $prestamo): bool
    {
        return $user->isAdmin();
    }

    public function restore(User $user, Prestamo $prestamo): bool
    {
        return $user->isAdmin();
    }

    public function forceDelete(User $user, Prestamo $prestamo): bool
    {
        return $user->isAdmin();
    }
}
