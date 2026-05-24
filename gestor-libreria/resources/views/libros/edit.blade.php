@extends('layout')

@section('content')
    <h1>Editar Libro</h1>
    <form action="{{ route('libros.update', $libro) }}" method="POST">
        @csrf
        @method('PUT')

        <label>Titulo</label>
        <input type="text" name="titulo" value="{{ $libro->titulo }}"/>

        @error('titulo')
            <div class="error">{{ $message }}</div>
        @enderror

        <br/><br/>

        <label>Autor</label>
        <input type="text" name="autor" value="{{ $libro->autor }}"/>

        @error('autor')
            <div class="error">{{ $message }}</div>
        @enderror

        <br/><br/>

        <label>ISBN</label>
        <input type="text" name="isbn" value="{{ $libro->isbn }}"/>

        @error('isbn')
            <div class="error">{{ $message }}</div>
        @enderror

        <br/><br/>

        <label>Año de publicación</label>
        <input type="text" name="anio_publicacion" value="{{ $libro->anio_publicacion }}"/>

        @error('anio_publicacion')
            <div class="error">{{ $message }}</div>
        @enderror

        <br/><br/>

        <label>Editorial</label>
        <input type="text" name="editorial" value="{{ $libro->editorial }}"/>

        @error('editorial')
            <div class="error">{{ $message }}</div>
        @enderror

        <br/><br/>

        <label>Genero</label>
        <select name="genero_id">
            <option value="">-- Selecciona una opcion --</option>
            @foreach ($generos as $genero)
                <option value="{{ $genero->id }}" @selected(old('genero_id', $libro->genero->id) == $genero->id)>{{ $genero->nombre }}</option>
            @endforeach
        </select>

        @error('genero_id')
            <div class="error">{{ $message }}</div>
        @enderror

        <br/><br/>

        <button type="submit">Enviar</button>

        <br/><br/>

    </form>

    <a href="{{ route('libros.index') }}">Volver</a>
@endsection