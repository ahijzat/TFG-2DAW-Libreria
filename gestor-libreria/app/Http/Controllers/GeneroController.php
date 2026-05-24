<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGeneroRequest;
use App\Http\Requests\UpdateGeneroRequest;
use App\Models\Genero;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GeneroController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Genero::class);

        $user = Auth::user();

        $generos = Genero::orderByDesc('updated_at')->paginate($this->paginatesNumber);

        $extraData = [
            'createButton' => $user->isAdmin(),
            'actionButtons' => $user->isAdmin()
        ];

        return view('generos.index', compact('generos', 'extraData'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Genero::class);
        return view('generos.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGeneroRequest $request)
    {
        $this->authorize('create', Genero::class);
        $validate = $request->validated();
        Genero::create($validate);
        return redirect(route('generos.index'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Genero $genero)
    {
        $this->authorize('view', $genero);
        return view('generos.show', compact('genero'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Genero $genero)
    {
        $this->authorize('update', $genero);
        return view('generos.edit', compact('genero'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGeneroRequest $request, Genero $genero)
    {
        $this->authorize('update', $genero);
        $validate = $request->validated();
        $genero->update($validate);
        return redirect(route('generos.index'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Genero $genero)
    {
        $this->authorize('delete', $genero);
        $genero->delete();
        return redirect(route('generos.index'));
    }
}
