<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\UpdateUserRolRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class UserController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $this->authorize('viewAny', User::class);

        return UserResource::collection(User::with('rol')->paginate(10));
    }

    public function store(RegisterRequest $request, UserService $service)
    {
        $user = $service->registrar($request->validated());

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'message' => 'Usuario creado correctamente',
            'token'   => $token,
            'data'    => new UserResource($user),
        ]);
    }

    public function show(User $user)
    {
        $this->authorize('view', $user);
        return new UserResource($user);
    }

    public function update(UpdateUserRequest $request, User $user, UserService $service)
    {
        $this->authorize('update', $user);

        $user = $service->actualizar($user, $request->validated());

        return new UserResource($user);
    }

    public function destroy(User $user)
    {
        $this->authorize('delete', $user);

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado correctamente']);
    }

    public function updatePassword(UpdatePasswordRequest $request, User $user, UserService $service)
    {
        $this->authorize('updatePassword', $user);

        $service->cambiarPassword($user, $request->validated());

        return response()->json(['message' => 'Contraseña actualizada correctamente']);
    }

    public function updateRol(UpdateUserRolRequest $request, User $user, UserService $service)
    {
        $this->authorize('updateRol', $user);

        $service->cambiarRol($user, $request->rol_id);

        return new UserResource($user);
    }
}