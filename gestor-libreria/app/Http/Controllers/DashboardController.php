<?php

namespace App\Http\Controllers;

use App\Models\Libro;
use App\Models\Genero;
use App\Models\User;
use App\Models\Alquiler;
use App\Models\Compra;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index() {
        $user = Auth::user();
    
        $users = [];
        $libros = [];
        $generos = [];
        $alquileres = [];
        $compras = [];

        if ($user->isAdmin()) {
            $users = User::all();
            $libros = Libro::all();
            $generos = Genero::all();
            $alquileres = Alquiler::all();
            $compras = Compra::all();
        } else {
            $libros = Libro::all();
            $generos = Genero::all();
            $alquileres = Alquiler::where('user_id', $user->id)->get();
            $compras = Compra::where('user_id', $user->id)->get();
        }

        $extraData = [
            'actionButtons' => $user->isAdmin()
        ];

        return view('dashboard.index', compact('libros', 'users', 'generos', 'alquileres', 'compras', 'extraData'));
    }
}