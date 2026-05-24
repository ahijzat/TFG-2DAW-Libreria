@if(!empty($libros))
    <ul>
        @foreach($libros as $libro)
            <li>
                {{ $libro->titulo }} -
                {{ $libro->autor }} -
                {{ $libro->isbn }} -
                {{ $libro->anio_publicacion }} -
                {{ $libro->editorial }} -
                {{ $libro->genero->nombre }}
                <a href="{{ route('libros.show', $libro) }}">Ver</a>
                @if(isset($extraData['actionButtons']) && $extraData['actionButtons'])
                    - <a href="{{ route('libros.edit', $libro) }}">Editar</a> -
                    <form action="{{ route('libros.destroy', $libro) }}" method="POST" style="display: inline;">
                        @csrf
                        @method('DELETE')
                        <button>Eliminar</button>
                    </form>
                @endif
            </li>
        @endforeach
    </ul>
@else
    <p>No hay libros</p>
@endif