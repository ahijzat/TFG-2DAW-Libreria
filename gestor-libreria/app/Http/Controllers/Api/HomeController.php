<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LibroResource;
use App\Services\LibroService;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request, LibroService $service)
    {
        return response()->json([
            'destacados' => LibroResource::collection($service->getDestacados())->resolve($request),
            'mas_populares' => LibroResource::collection($service->getMasPopulares())->resolve($request),
            'novedades' => LibroResource::collection($service->getNovedades())->resolve($request),
            'disponibles' => LibroResource::collection($service->getDisponibles())->resolve($request),
        ]);
    }
}