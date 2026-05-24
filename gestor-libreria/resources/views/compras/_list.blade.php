@if(!empty($compras))
    <ul>
        @foreach($compras as $compra)
            <li>
                {{ $compra->user->name }} -
                {{ $compra->libro->titulo }} -
                {{ $compra->fecha_compra }} -
                <a href="{{ route('compras.show', $compra) }}">Ver</a>
                @if(isset($extraData['actionButtons']) && $extraData['actionButtons'])
                    - <a href="{{ route('compras.edit', $compra) }}">Editar</a> -
                    <form action="{{ route('compras.destroy', $compra) }}" method="POST" style="display: inline;">
                        @csrf
                        @method('DELETE')
                        <button>Eliminar</button>
                    </form>
                @endif
            </li>
        @endforeach
    </ul>
@else
    <p>No hay compras</p>
@endif