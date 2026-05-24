@extends('layout')

@section('content')
    <h1>Editar Alquiler</h1>
    <form action="{{ route('alquileres.update', $alquiler) }}" method="POST">
        @csrf
        @method('PUT')

        <label>Usuario</label>
        <select name="user_id">
            <option value="">-- Selecciona una opcion --</option>
            @foreach ($users as $user)
                <option value="{{ $user->id }}" @selected(old('user_id', $alquiler->user->id) == $user->id)>{{ $user->name }}</option>
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
                <option value="{{ $libro->id }}" @selected(old('libro_id', $alquiler->libro->id) == $libro->id)>{{ $libro->titulo }}</option>
            @endforeach
        </select>

        @error('libro_id')
            <div class="error">{{ $message }}</div>
        @enderror

        <br/><br/>

        <label>Fecha de Alquiler</label>
        <input type="date" name="fecha_alquiler" value="{{ $alquiler->fecha_alquiler }}"/>

        @error('fecha_alquiler')
            <div class="error">{{ $message }}</div>
        @enderror

        <br/><br/>

        <label>Fecha de Devolución</label>
        <input type="date" name="fecha_devolucion" value="{{ $alquiler->fecha_devolucion }}"/>

        @error('fecha_devolucion')
            <div class="error">{{ $message }}</div>
        @enderror

        <br/><br/>

        <label>Multa</label>
        <input type="number" name="multa" value="{{ $alquiler->multa }}"/>

        @error('multa')
            <div class="error">{{ $message }}</div>
        @enderror

        <br/><br/>

        <label>Estado</label>
        <input type="text" name="estado" value="{{ $alquiler->estado }}"/>

        @error('estado')
            <div class="error">{{ $message }}</div>
        @enderror

        <br/><br/>

        <button type="submit">Enviar</button>

        <br/><br/>

    </form>

    <a href="{{ route('alquileres.index') }}">Volver</a>
@endsection