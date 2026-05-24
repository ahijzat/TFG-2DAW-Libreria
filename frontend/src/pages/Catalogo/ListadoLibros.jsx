import { useEffect, useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Icon } from '@iconify/react'
import useFetch from '../../hooks/useFetch'
import API from '../../services/api'
import Card from '../../components/UI/Card'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import EstadoVacio from '../../components/UI/EstadoVacio'
import Pagination from '../../components/Common/Pagination'
import SearchInput from '../../components/Common/SearchInput'
import { formatearPrecio, truncarTexto } from '../../utils/formatters'
import estilos from '../modules/Catalogo.module.css'

function ListadoLibros() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [libros, setLibros] = useState([])
  const [generos, setGeneros] = useState([])
  const [meta, setMeta] = useState(null)
  const [busqueda, setBusqueda] = useState(searchParams.get('busqueda') || '')
  const [generoSeleccionado, setGeneroSeleccionado] = useState(searchParams.get('genero') || '')
  const [precioMax, setPrecioMax] = useState(searchParams.get('precio_max') || '')

  const { peticion, loading } = useFetch()
  const fetchGeneros = useFetch()

  const pagina = parseInt(searchParams.get('pagina') || '1', 10)

  // Cargar géneros una sola vez
  useEffect(() => {
    fetchGeneros.peticion(API.generos()).then(({ data }) => {
      if (data) setGeneros(data.data || data || [])
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cargarLibros = useCallback(async () => {
    const params = new URLSearchParams()
    if (busqueda) params.set('texto', busqueda)
    if (generoSeleccionado) params.set('genero_id', generoSeleccionado)
    if (precioMax) params.set('precio_max', precioMax)
    params.set('page', pagina)

    const url = `${API.libroCatalogo()}?${params.toString()}`
    const { data } = await peticion(url)
    if (data) {
      setLibros(data.data || data || [])
      setMeta(data.meta || null)
    }
  }, [busqueda, generoSeleccionado, precioMax, pagina, peticion])

  useEffect(() => {
    cargarLibros()
  }, [cargarLibros])

  const actualizarParams = (clave, valor) => {
    const nuevo = new URLSearchParams(searchParams)
    if (valor) {
      nuevo.set(clave, valor)
    } else {
      nuevo.delete(clave)
    }
    nuevo.delete('pagina') // Reset página al filtrar
    setSearchParams(nuevo)
  }

  const cambiarPagina = (num) => {
    const nuevo = new URLSearchParams(searchParams)
    nuevo.set('pagina', num)
    setSearchParams(nuevo)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const limpiarFiltros = () => {
    setBusqueda('')
    setGeneroSeleccionado('')
    setPrecioMax('')
    setSearchParams({})
  }

  const hayFiltros = busqueda || generoSeleccionado || precioMax

  return (
    <main className={`contenedor ${estilos.pagina}`}>
      <div className={estilos.cabecera}>
        <h1 className={estilos.titulo}>Catálogo de libros</h1>
        <p className={estilos.subtitulo}>Encuentra tu próxima lectura favorita</p>
      </div>

      {/* Filtros */}
      <div className={estilos.panelFiltros}>
        <div className={estilos.filtroBusqueda}>
          <SearchInput
            valor={busqueda}
            onChange={(v) => {
              setBusqueda(v)
              actualizarParams('busqueda', v)
            }}
            onLimpiar={() => {
              setBusqueda('')
              actualizarParams('busqueda', '')
            }}
            placeholder="Buscar por título o autor..."
          />
        </div>

        <div className={estilos.filtrosSecundarios}>
          <select
            className={estilos.selectFiltro}
            value={generoSeleccionado}
            onChange={(e) => {
              setGeneroSeleccionado(e.target.value)
              actualizarParams('genero', e.target.value)
            }}
          >
            <option value="">Todos los géneros</option>
            {generos.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre}
              </option>
            ))}
          </select>

          <input
            type="number"
            className={estilos.inputPrecio}
            placeholder="Precio máx."
            value={precioMax}
            min={0}
            onChange={(e) => {
              setPrecioMax(e.target.value)
              actualizarParams('precio_max', e.target.value)
            }}
          />

          {hayFiltros && (
            <button className="boton boton-secundario boton-sm" onClick={limpiarFiltros}>
              <Icon icon="mdi:filter-off-outline" /> Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Resultados */}
      {loading ? (
        <LoadingSpinner mensaje="Buscando libros..." />
      ) : libros.length === 0 ? (
        <EstadoVacio
          titulo="No hay resultados"
          descripcion="Prueba a cambiar los filtros de búsqueda o explora todas las categorías."
        />
      ) : (
        <>
          {meta && (
            <p className={estilos.contadorResultados}>
              {meta.total ?? libros.length} libros encontrados
            </p>
          )}
          <div className={estilos.gridLibros}>
            {libros.map((libro) => (
              <TarjetaLibro key={libro.id} libro={libro} />
            ))}
          </div>
          {meta && (
            <Pagination
              paginaActual={meta.current_page || pagina}
              totalPaginas={meta.last_page || 1}
              onCambiarPagina={cambiarPagina}
            />
          )}
        </>
      )}
    </main>
  )
}

function TarjetaLibro({ libro }) {
  return (
    <Link to={`/libros/${libro.id}`} className={estilos.tarjetaLink}>
      <Card variante="normal" className={estilos.tarjeta}>
        <div className={estilos.portada}>
          {libro.imagen ? (
            <img src={libro.imagen} alt={libro.titulo} className={estilos.imagenPortada} />
          ) : (
            <div className={estilos.portadaPlaceholder}>
              <Icon icon="mdi:book-open-variant" />
            </div>
          )}
        </div>
        <div className={estilos.info}>
          <p className={estilos.generosTags}>
            {libro.generos?.slice(0, 2).map((g) => (
              <span key={g.id} className={estilos.generoTag}>{g.nombre}</span>
            ))}
          </p>
          <h2 className={estilos.tituloLibro}>{truncarTexto(libro.titulo, 60)}</h2>
          <p className={estilos.autorLibro}>{libro.autor}</p>
          <div className={estilos.pieTarjeta}>
            <span className={estilos.precio}>{formatearPrecio(libro.precio)}</span>
            {libro.stock_venta > 0 ? (
              <span className={estilos.enStock}>
                <Icon icon="mdi:check-circle" /> En stock
              </span>
            ) : (
              <span className={estilos.sinStock}>Sin stock</span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default ListadoLibros
