<?php

namespace App\Http\Policies;

use App\Models\User;

class UserPolicy
{
    public function view(User $auth, User $user): bool
    {
        return $auth->isAdmin() || $auth->id === $user->id;
    }

    public function viewAny(User $auth): bool
    {
        return $auth->isAdmin();
    }

    public function update(User $auth, User $user): bool
    {
        return $auth->isAdmin() || $auth->id === $user->id;
    }

    public function delete(User $auth): bool
    {
        return $auth->isAdmin();
    }

    public function updatePassword(User $auth, User $user): bool
    {
        return $auth->isAdmin() || $auth->id === $user->id;
    }

    public function updateRol(User $auth): bool
    {
        return $auth->isAdmin();
    }
}