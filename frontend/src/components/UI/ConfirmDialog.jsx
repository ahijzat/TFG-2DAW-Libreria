import { useEffect, useRef } from 'react'
import estilos from '../../pages/modules/ConfirmDialog.module.css'

function ConfirmDialog({ abierto, titulo, mensaje, onConfirmar, onCancelar, cargando = false }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (abierto) {
      dialogRef.current?.focus()
    }
  }, [abierto])

  if (!abierto) return null

  return (
    <div className={estilos.fondo} role="dialog" aria-modal="true" aria-labelledby="dialogo-titulo">
      <div className={estilos.panel} ref={dialogRef} tabIndex={-1}>
        <h3 id="dialogo-titulo" className={estilos.titulo}>{titulo}</h3>
        {mensaje && <p className={estilos.mensaje}>{mensaje}</p>}
        <div className={estilos.acciones}>
          <button className="boton boton-secundario" onClick={onCancelar} disabled={cargando}>
            Cancelar
          </button>
          <button className="boton boton-peligro" onClick={onConfirmar} disabled={cargando}>
            {cargando ? 'Procesando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
