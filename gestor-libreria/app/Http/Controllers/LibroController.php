<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Libro;
use App\Models\User;
use App\Models\Genero;
use App\Services\LibroService;
use App\Http\Requests\StoreLibroRequest;
use App\Http\Requests\UpdateLibroRequest;
use Illuminate\Support\Facades\Auth;

class LibroController extends Controller
{

    protected $libroService;

    public function __construct(LibroService $libroService)
    {
        $this->libroService = $libroService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Libro::class);

        $user = Auth::user();

        $libros = Libro::orderByDesc('updated_at')->paginate($this->paginatesNumber);

        $extraData = [
            'createButton' => $user->isAdmin(),
            'actionButtons' => $user->isAdmin()
        ];

        return view('libros.index', compact('libros', 'extraData'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Libro::class);
        $generos = Genero::all();
        return view('libros.create', compact('generos'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLibroRequest $request)
    {
        $this->authorize('create', Libro::class);
        $validate = $request->validated();

        $this->libroService->storeLibro($validate);

        return redirect(route('libros.index'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Libro $libro)
    {
        $this->authorize('view', $libro);
        $generos = Genero::all();
        return view('libros.show', compact('libro', 'generos'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Libro $libro)
    {
        $this->authorize('update', $libro);
        $generos = Genero::all();
        return view('libros.edit', compact('libro', 'generos'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLibroRequest $request, Libro $libro)
    {
        $this->authorize('update', $libro);
        $validate = $request->validated();

        $libro->update($validate);

        return redirect(route('libros.index'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Libro $libro)
    {
        $this->authorize('delete', $libro);

        $libro->delete();
        return redirect(route('libros.index'));
    }
}
