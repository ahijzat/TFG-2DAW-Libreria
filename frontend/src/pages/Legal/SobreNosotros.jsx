import { Icon } from '@iconify/react'
import estilos from '../modules/Pagina.module.css'

const VALORES = [
  { icono: 'mdi:book-heart', titulo: 'Pasión por la lectura', descripcion: 'Creemos que cada libro abre una ventana al mundo. Nuestra selección está curada con cariño por lectores para lectores.' },
  { icono: 'mdi:hand-heart', titulo: 'Servicio cercano', descripcion: 'Atendemos cada consulta de forma personal. Para nosotros no hay cliente anónimo, solo lectores con historia.' },
  { icono: 'mdi:leaf', titulo: 'Compromiso sostenible', descripcion: 'Fomentamos el préstamo y la reutilización de libros para reducir el impacto ambiental de la industria editorial.' },
]

function SobreNosotros() {
  return (
    <main className={`contenedor ${estilos.pagina}`}>
      <h1 className={estilos.titulo}>Sobre nosotros</h1>

      <section className={estilos.seccionHero}>
        <p className={estilos.lead}>
          Biblium nació con una idea sencilla: que los mejores libros lleguen a quien los quiere leer,
          sin complicaciones y con el placer de siempre.
        </p>
      </section>

      <section className={estilos.seccion}>
        <h2 className={estilos.subtitulo}>Nuestra historia</h2>
        <p>
          Fundada en 2026, Biblium empezó como un pequeño proyecto de librería local que pronto vio
          en la tecnología una oportunidad para llegar a más lectores. Hoy combinamos la calidez de
          una librería de barrio con la comodidad de comprar y tomar prestados libros desde casa.
        </p>
        <p>
          En estos años hemos construido un catálogo de más de 5 000 títulos entre novela, ensayo,
          poesía y cómic, y hemos prestado más de 20 000 libros a lectores de toda España.
        </p>
      </section>

      <section className={estilos.seccion}>
        <h2 className={estilos.subtitulo}>Lo que nos mueve</h2>
        <div className={estilos.gridValores}>
          {VALORES.map((v) => (
            <div key={v.titulo} className={estilos.tarjetaValor}>
              <Icon icon={v.icono} className={estilos.iconoValor} />
              <h3 className={estilos.tituloValor}>{v.titulo}</h3>
              <p className={estilos.textoValor}>{v.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={estilos.seccion}>
        <h2 className={estilos.subtitulo}>Contacto</h2>
        <p>
          ¿Tienes alguna pregunta, sugerencia o simplemente quieres recomendarnos un libro?
          Escríbenos a <a href="mailto:hola@biblium.es">hola@biblium.es</a> y te responderemos
          en menos de 24 horas.
        </p>
      </section>
    </main>
  )
}

export default SobreNosotros
