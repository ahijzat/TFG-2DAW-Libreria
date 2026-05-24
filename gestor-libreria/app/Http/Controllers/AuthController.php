<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\User;

class AuthController extends Controller
{
    // Muestra la vista con el formulario de login
    public function form()
    {
        return view('auth.login');
    }

    // Procesa el login del usuario
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            // Cargar el usuario con su rol para evitar problemas de lazy loading
            $user = User::with('rol')->where('email', $credentials['email'])->first();
            Auth::login($user);
            return redirect()->route('dashboard.index');
        } else {
            return back()->withErrors([
                'fail' => 'Error al intentar iniciar sesion, revise sus credenciales e intente de nuevo'
            ]);
        }
    }

    // Procesa el logout del usuario
    public function logout()
    {
        Auth::logout();

        return redirect()->route('login');
    }
}