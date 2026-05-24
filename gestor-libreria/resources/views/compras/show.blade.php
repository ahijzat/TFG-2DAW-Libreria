@extends('layout')

@section('content')
    <h1>Ver Compra</h1>

    <label>Usuario</label>
    <select name="user_id" disabled>
        <option value="">-- Selecciona una opcion --</option>
        @foreach ($users as $user)
            <option value="{{ $user->id }}" @selected($compra->user_id == $user->id)>{{ $user->name }}</option>
        @endforeach
    </select>

    <br/><br/>

    <label>Libro</label>
    <select name="libro_id" disabled>
        <option value="">-- Selecciona una opcion --</option>
        @foreach ($libros as $libro)
            <option value="{{ $libro->id }}" @selected($compra->libro_id == $libro->id)>{{ $libro->titulo }}</option>
        @endforeach
    </select>

    <label>Fecha de la Compra</label>
    <input type="text" name="fecha_compra" value="{{ $compra->fecha_compra }}" disabled/>

    <br/><br/>

    <a href="{{ route('compras.index') }}">Volver</a>
@endsection