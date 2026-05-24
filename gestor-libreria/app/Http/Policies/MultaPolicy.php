<?php

namespace App\Http\Policies;

use App\Models\Multa;
use App\Models\User;

class MultaPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Multa $multa): bool
    {
        return $user->isAdmin() || $user->id === $multa->user_id;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Multa $multa): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Multa $multa): bool
    {
        return $user->isAdmin();
    }

    public function restore(User $user, Multa $multa): bool
    {
        return $user->isAdmin();
    }

    public function forceDelete(User $user, Multa $multa): bool
    {
        return $user->isAdmin();
    }
}
