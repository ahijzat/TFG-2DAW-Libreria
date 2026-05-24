@extends('layout')

@section('content')
    <h1>Editar Genero</h1>
    <form action="{{ route('generos.update', $genero) }}" method="POST">
        @csrf
        @method('PUT')

        <label>Nombre</label>
        <input type="text" name="nombre" value="{{ $genero->nombre }}"/>

        @error('nombre')
            <div class="error">{{ $message }}</div>
        @enderror

        <br/><br/>

        <label>Descripción</label>
        <input type="text" name="descripcion" value="{{ $genero->descripcion }}"/>

        @error('descripcion')
            <div class="error">{{ $message }}</div>
        @enderror

        <br/><br/>

        <label>Edad Recomendada</label>
        <input type="text" name="edad_recomendada" value="{{ $genero->edad_recomendada }}"/>

        @error('edad_recomendada')
            <div class="error">{{ $message }}</div>
        @enderror

        <br/><br/>

        <button type="submit">Enviar</button>

        <br/><br/>

    </form>

    <a href="{{ route('generos.index') }}">Volver</a>
@endsection