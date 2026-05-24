@extends('layout')

@section('content')
    <h1>Libros</h1>
    @if(isset($extraData['createButton']) && $extraData['createButton'])
        <a href="{{ route('libros.create') }}">Crear libro</a>
    @endif
    
    @include('libros._list')

    @if(!empty($libros))
        <div class="pagination">
            {{ $libros->links() }}
        </div>
    @endif
@endsection