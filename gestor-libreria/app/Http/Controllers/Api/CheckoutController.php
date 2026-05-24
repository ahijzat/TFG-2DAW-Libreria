<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutRequest;
use App\Http\Resources\CompraResource;
use App\Services\CompraService;

class CheckoutController extends Controller
{
    public function procesarCompra(CheckoutRequest $request, CompraService $service)
    {
        $compra = $service->procesarCheckout($request->user(), $request->validated()['items'] ?? []);

        return (new CompraResource($compra))
            ->response()
            ->setStatusCode(201);
    }
}