@extends('layout')

@section('content')
    <h1>Crear Compra</h1>
    <form action="{{ route('compras.store') }}" method="POST">
        @csrf

        <label>Usuario</label>
        <select name="user_id">
            <option value="">-- Selecciona una opcion --</option>
            @foreach ($users as $user)
                <option value="{{ $user->id }}">{{ $user->name }}</option>
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
                <option value="{{ $libro->id }}">{{ $libro->titulo }}</option>
            @endforeach
        </select>

        @error('libro_id')
            <div class="error">{{ $message }}</div>
        @enderror

        <br/><br/>

        <label>Fecha de la Compra</label>
        <input type="date" name="fecha_compra" value="{{ old('fecha_compra') }}"/>

        @error('fecha_compra')
            <div class="error">{{ $message }}</div>
        @enderror

        <br/><br/>

        <button type="submit">Enviar</button>

        <br/><br/>

    </form>

    <a href="{{ route('compras.index') }}">Volver</a>
@endsection