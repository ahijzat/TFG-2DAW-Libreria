@extends('layout')

@section('content')
    <h1>Compras</h1>
    @if(isset($extraData['createButton']) && $extraData['createButton'])
        <a href="{{ route('compras.create') }}">Crear compra</a>
    @endif
    
    @include('compras._list')

    @if(!empty($compras))
        <div class="pagination">
            {{ $compras->links() }}
        </div>
    @endif
@endsection