@extends('layout')

@section('content')
    <h1>Alquileres</h1>
    @if(isset($extraData['createButton']) && $extraData['createButton'])
        <a href="{{ route('alquileres.create') }}">Crear alquiler</a>
    @endif
    
    @include('alquileres._list')

    @if(!empty($alquileres))
        <div class="pagination">
            {{ $alquileres->links() }}
        </div>
    @endif
@endsection