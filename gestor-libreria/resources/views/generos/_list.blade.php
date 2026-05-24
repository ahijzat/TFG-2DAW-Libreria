@if(!empty($generos))
    <ul>
        @foreach($generos as $genero)
            <li>
                {{ $genero->nombre }} -
                {{ $genero->descripcion }} -
                {{ $genero->edad_recomendada }} -
                <a href="{{ route('generos.show', $genero) }}">Ver</a>
                @if(isset($extraData['actionButtons']) && $extraData['actionButtons'])
                    - <a href="{{ route('generos.edit', $genero) }}">Editar</a> -
                    <form action="{{ route('generos.destroy', $genero) }}" method="POST" style="display: inline;">
                        @csrf
                        @method('DELETE')
                        <button>Eliminar</button>
                    </form>
                @endif
            </li>
        @endforeach
    </ul>
@else
    <p>No hay generos</p>
@endif