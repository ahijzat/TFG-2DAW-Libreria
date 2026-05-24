@extends('layout')

@section('content')
    <h1>Ver Alquiler</h1>

    <label>Usuario</label>
    <select name="user_id" disabled>
        <option value="">-- Selecciona una opcion --</option>
        @foreach ($users as $user)
            <option value="{{ $user->id }}" @selected($alquiler->user_id == $user->id)>{{ $user->name }}</option>
        @endforeach
    </select>

    <br/><br/>

    <label>Libro</label>
    <select name="libro_id" disabled>
        <option value="">-- Selecciona una opcion --</option>
        @foreach ($libros as $libro)
            <option value="{{ $libro->id }}" @selected($alquiler->libro_id == $libro->id)>{{ $libro->titulo }}</option>
        @endforeach
    </select>

    <label>Fecha de alquiler</label>
    <input type="text" name="fecha_alquiler" value="{{ $alquiler->fecha_alquiler }}" disabled/>

    <br/><br/>

    <label>Fecha de devolución</label>
    <input type="text" name="fecha_devolucion" value="{{ $alquiler->fecha_devolucion }}" disabled/>

    <br/><br/>

    <label>Multa</label>
    <input type="text" name="multa" value="{{ $alquiler->multa }}" disabled/>

    <br/><br/>

    <label>Estado</label>
    <input type="text" name="estado" value="{{ $alquiler->estado }}" disabled/>

    <br/><br/>

    <a href="{{ route('alquileres.index') }}">Volver</a>
@endsection