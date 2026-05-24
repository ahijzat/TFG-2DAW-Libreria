@extends('layout')

@section('content')
    <h1>Dashboard</h1>

    <h2>Bienvenido {{ Auth::user()->nombre }} </h2>

    <h3>Libros</h3>
    @include('libros._list')
    
    <h3>Generos</h3>
    @include('generos._list')

    <h3>Alquileres</h3>
    @include('alquileres._list')

    <h3>Compras</h3>
    @include('compras._list')
@endsection