@extends('layout')

@section('content')
    <h1>Ver Genero</h1>

    <label>Nombre</label>
    <input type="text" name="nombre" value="{{ $genero->nombre }}" disabled/>

    <br/><br/>

    <label>Descripción</label>
    <input type="text" name="descripcion" value="{{ $genero->descripcion }}" disabled/>

    <label>Edad Recomendada</label>
    <input type="text" name="edad_recomendada" value="{{ $genero->edad_recomendada }}" disabled/>

    <br/><br/>

    <a href="{{ route('generos.index') }}">Volver</a>
@endsection