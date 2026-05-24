import estilos from '../modules/Pagina.module.css'

function Terminos() {
  return (
    <main className={`contenedor ${estilos.pagina}`}>
      <h1 className={estilos.titulo}>Términos y condiciones</h1>
      <p className={estilos.actualizado}>Última actualización: mayo de 2026</p>

      <section className={estilos.seccion}>
        <h2 className={estilos.subtitulo}>1. Aceptación de los términos</h2>
        <p>
          Al acceder y utilizar Biblium, el usuario acepta estar sujeto a los presentes términos y condiciones.
          Si no está de acuerdo con alguno de ellos, le rogamos que no haga uso de nuestros servicios.
        </p>
      </section>

      <section className={estilos.seccion}>
        <h2 className={estilos.subtitulo}>2. Descripción del servicio</h2>
        <p>
          Biblium es una plataforma de librería en línea que permite la compra y el préstamo de libros
          a usuarios registrados. La disponibilidad de los títulos puede variar sin previo aviso.
        </p>
      </section>

      <section className={estilos.seccion}>
        <h2 className={estilos.subtitulo}>3. Registro y cuenta de usuario</h2>
        <p>
          Para acceder a la compra y al servicio de préstamos es necesario crear una cuenta. El usuario
          es responsable de mantener la confidencialidad de sus credenciales y de todas las actividades
          realizadas bajo su cuenta.
        </p>
      </section>

      <section className={estilos.seccion}>
        <h2 className={estilos.subtitulo}>4. Compras</h2>
        <p>
          Los precios mostrados incluyen los impuestos aplicables. Una vez confirmada la compra, el importe
          se cargará en el método de pago seleccionado. No se admiten devoluciones de libros digitales salvo
          error técnico imputable a Biblium.
        </p>
      </section>

      <section className={estilos.seccion}>
        <h2 className={estilos.subtitulo}>5. Servicio de préstamos</h2>
        <p>
          Los préstamos tienen un plazo máximo establecido en cada título. La devolución fuera de plazo
          generará una multa cuyo importe se indicará en el momento del préstamo. El usuario se compromete
          a devolver el título en el estado en que lo recibió.
        </p>
      </section>

      <section className={estilos.seccion}>
        <h2 className={estilos.subtitulo}>6. Propiedad intelectual</h2>
        <p>
          Todos los contenidos de Biblium (textos, imágenes, logotipos y software) son propiedad de Biblium
          o de sus respectivos titulares y están protegidos por la legislación de propiedad intelectual vigente.
          Queda prohibida su reproducción sin autorización expresa.
        </p>
      </section>

      <section className={estilos.seccion}>
        <h2 className={estilos.subtitulo}>7. Limitación de responsabilidad</h2>
        <p>
          Biblium no se responsabiliza de los daños derivados del uso incorrecto de la plataforma, de
          interrupciones del servicio por causas ajenas a su control ni de la pérdida de datos del usuario
          causada por terceros.
        </p>
      </section>

      <section className={estilos.seccion}>
        <h2 className={estilos.subtitulo}>8. Modificaciones</h2>
        <p>
          Biblium se reserva el derecho de modificar estos términos en cualquier momento. Los cambios
          serán notificados a los usuarios registrados por correo electrónico con un preaviso de 15 días.
        </p>
      </section>

      <section className={estilos.seccion}>
        <h2 className={estilos.subtitulo}>9. Ley aplicable</h2>
        <p>
          Estos términos se rigen por la legislación española. Cualquier controversia se someterá a los
          juzgados y tribunales del domicilio del usuario, salvo que la ley establezca otro fuero.
        </p>
      </section>
    </main>
  )
}

export default Terminos
