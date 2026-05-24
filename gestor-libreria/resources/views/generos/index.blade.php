@extends('layout')

@section('content')
    <h1>Generos</h1>
    @if(isset($extraData['createButton']) && $extraData['createButton'])
        <a href="{{ route('generos.create') }}">Crear genero</a>
    @endif
    
    @include('generos._list')

    @if(!empty($generos))
        <div class="pagination">
            {{ $generos->links() }}
        </div>
    @endif
@endsection