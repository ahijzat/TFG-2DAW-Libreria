<?php

namespace App\Http\Controllers;

use App\Models\Alquiler;
use App\Models\Libro;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\StoreAlquilerRequest;
use App\Http\Requests\UpdateAlquilerRequest;
use Illuminate\Support\Facades\Auth;

class AlquilerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Alquiler::class);
        $user = Auth::user();
        $alquileres = [];

        if($user->isAdmin()) {
            $alquileres = Alquiler::orderByDesc('updated_at', 'fecha_alquiler')->paginate($this->paginatesNumber);
        } else {
            $alquileres = Alquiler::where('user_id', $user->id)->orderByDesc('updated_at', 'fecha_alquiler')->paginate($this->paginatesNumber);
        }

        $extraData = [
            'createButton' => $user->isAdmin(),
            'actionButtons' => $user->isAdmin()
        ];

        return view('alquileres.index', compact('alquileres', 'extraData'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Alquiler::class);
        $libros = Libro::all();
        $users = User::all();
        return view('alquileres.create', compact('libros', 'users'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAlquilerRequest $request)
    {
        $this->authorize('create', Alquiler::class);
        $validate = $request->validated();
        Alquiler::create($validate);
        return redirect(route('alquileres.index'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Alquiler $alquiler)
    {
        $this->authorize('view', $alquiler);
        $users = User::all();
        $libros = Libro::all();
        return view('alquileres.show', compact('alquiler', 'users', 'libros'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Alquiler $alquiler)
    {
        $this->authorize('update', $alquiler);
        $libros = Libro::all();
        $users = User::all();
        return view('alquileres.edit', compact('alquiler', 'libros', 'users'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAlquilerRequest $request, Alquiler $alquiler)
    {
        $this->authorize('update', $alquiler);
        $validate = $request->validated();
        $alquiler->update($validate);
        return redirect(route('alquileres.index'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Alquiler $alquiler)
    {
        $this->authorize('delete', $alquiler);
        $alquiler->delete();
        return redirect(route('alquileres.index'));
    }
}
