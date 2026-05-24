@if(!empty($alquileres))
    <ul>
        @foreach($alquileres as $alquiler)
            <li>
                {{ $alquiler->user->name }} -
                {{ $alquiler->libro->titulo }} -
                {{ $alquiler->fecha_alquiler }} -
                {{ $alquiler->fecha_devolucion }} -
                {{ $alquiler->multa }} -
                {{ $alquiler->estado }} -
                <a href="{{ route('alquileres.show', $alquiler) }}">Ver</a>
                @if(isset($extraData['actionButtons']) && $extraData['actionButtons'])
                    - <a href="{{ route('alquileres.edit', $alquiler) }}">Editar</a> -
                    <form action="{{ route('alquileres.destroy', $alquiler) }}" method="POST" style="display: inline;">
                        @csrf
                        @method('DELETE')
                        <button>Eliminar</button>
                    </form>
                @endif
            </li>
        @endforeach
    </ul>
@else
    <p>No hay alquileres</p>
@endif