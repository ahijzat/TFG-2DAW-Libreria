<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CompraResource;
use App\Http\Resources\MultaResource;
use App\Http\Resources\PrestamoResource;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;

class PerfilController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user()->load([
            'rol',
            'compras.detalles.libro',
            'prestamos.libro',
            'multas.prestamo',
        ]);

        return response()->json([
            'usuario' => (new UserResource($user))->resolve($request),
            'resumen' => [
                'compras' => $user->compras->count(),
                'prestamos' => $user->prestamos->count(),
                'multas' => $user->multas->count(),
                'multas_pendientes' => $user->multas->where('estado', 'pendiente')->count(),
            ],
            'compras' => CompraResource::collection($user->compras)->resolve($request),
            'prestamos' => PrestamoResource::collection($user->prestamos)->resolve($request),
            'multas' => MultaResource::collection($user->multas)->resolve($request),
        ]);
    }
}