@extends('layout')

@section('content')
    <h1>Ver Libro</h1>

    <label>Titulo</label>
    <input type="text" name="titulo" value="{{ $libro->titulo }}" disabled/>

    <br/><br/>

    <label>Autor</label>
    <input type="text" name="autor" value="{{ $libro->autor }}" disabled/>

    <label>ISBN</label>
    <input type="text" name="isbn" value="{{ $libro->isbn }}" disabled/>

    <label>Año de publicacion</label>
    <input type="text" name="anio_publicacion" value="{{ $libro->anio_publicacion }}" disabled/>

    <label>Editorial</label>
    <input type="text" name="editorial" value="{{ $libro->editorial }}" disabled/>

    <label>Genero</label>
    <select name="genero_id" disabled>
        <option value="">-- Selecciona una opcion --</option>
        @foreach ($generos as $genero)
            <option value="{{ $genero->id }}" @selected($libro->genero_id == $genero->id)>{{ $genero->nombre }}</option>
        @endforeach
    </select>

    <br/><br/>

    <a href="{{ route('libros.index') }}">Volver</a>
@endsection