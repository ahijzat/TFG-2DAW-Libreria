<?php

namespace App\Http\Policies;

use App\Models\CompraDetalle;
use App\Models\User;

class CompraDetallePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, CompraDetalle $compraDetalle): bool
    {
        return $user->isAdmin() || $user->id === $compraDetalle->compra->user_id;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, CompraDetalle $compraDetalle): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, CompraDetalle $compraDetalle): bool
    {
        return $user->isAdmin();
    }

    public function restore(User $user, CompraDetalle $compraDetalle): bool
    {
        return $user->isAdmin();
    }

    public function forceDelete(User $user, CompraDetalle $compraDetalle): bool
    {
        return $user->isAdmin();
    }
}
