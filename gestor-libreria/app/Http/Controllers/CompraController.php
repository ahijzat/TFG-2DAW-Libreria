<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use App\Models\Libro;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\StoreCompraRequest;
use App\Http\Requests\UpdateCompraRequest;
use Illuminate\Support\Facades\Auth;

class CompraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Compra::class);
        $user = Auth::user();
        $compras = [];

        if($user->isAdmin()) {
            $compras = Compra::orderByDesc('updated_at', 'fecha_compra')->paginate($this->paginatesNumber);
        } else {
            $compras = Compra::where('user_id', $user->id)->orderByDesc('updated_at', 'fecha_compra')->paginate($this->paginatesNumber);
        }

        $extraData = [
            'createButton' => $user->isAdmin(),
            'actionButtons' => $user->isAdmin()
        ];

        return view('compras.index', compact('compras', 'extraData'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Compra::class);
        $libros = Libro::all();
        $users = User::all();
        return view('compras.create', compact('libros', 'users'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCompraRequest $request)
    {
        $this->authorize('create', Compra::class);
        $validate = $request->validated();
        Compra::create($validate);
        return redirect(route('compras.index'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Compra $compra)
    {
        $this->authorize('view', $compra);
        $users = User::all();
        $libros = Libro::all();
        return view('compras.show', compact('compra', 'users', 'libros'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Compra $compra)
    {
        $this->authorize('update', $compra);
        $libros = Libro::all();
        $users = User::all();
        return view('compras.edit', compact('compra', 'libros', 'users'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCompraRequest $request, Compra $compra)
    {
        $this->authorize('update', $compra);
        $validate = $request->validated();
        $compra->update($validate);
        return redirect(route('compras.index'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Compra $compra)
    {
        $this->authorize('delete', $compra);
        $compra->delete();
        return redirect(route('compras.index'));
    }
}
