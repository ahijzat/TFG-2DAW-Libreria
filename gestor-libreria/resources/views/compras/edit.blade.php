@extends('layout')

@section('content')
    <h1>Editar Compra</h1>
    <form action="{{ route('compras.update', $compra) }}" method="POST">
        @csrf
        @method('PUT')

        <label>Usuario</label>
        <select name="user_id">
            <option value="">-- Selecciona una opcion --</option>
            @foreach ($users as $user)
                <option value="{{ $user->id }}" @selected(old('user_id', $puntuacion->user->id) == $user->id)>{{ $user->name }}</option>
            @endforeach
        </select>

        @error('user_id')
            <div class="error">{{ $message }}</div>
        @enderror

        <br/><br/>

        <label>Libro</label>
        <select name="libro_id">
            <option value="">-- Selecciona una opcion --</option>
            @foreach ($libros as $libro)
                <option value="{{ $libro->id }}" @selected(old('libro_id', $compra->libro->id) == $libro->id)>{{ $libro->titulo }}</option>
            @endforeach
        </select>

        @error('libro_id')
            <div class="error">{{ $message }}</div>
        @enderror

        <br/><br/>

        <label>Fecha de la Compra</label>
        <input type="date" name="fecha_compra" value="{{ $compra->fecha_compra }}"/>

        @error('fecha_compra')
            <div class="error">{{ $message }}</div>
        @enderror

        <br/><br/>

        <button type="submit">Enviar</button>

        <br/><br/>

    </form>

    <a href="{{ route('compras.index') }}">Volver</a>
@endsection