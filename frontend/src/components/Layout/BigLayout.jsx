import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import Navbar from './Navbar'
import Footer from './Footer'
import ConnectionError from '../../pages/Shared/ConnectionError'

function BigLayout() {
  const [sinConexion, setSinConexion] = useState(false)

  useEffect(() => {
    const manejarSinConexion = () => setSinConexion(true)
    window.addEventListener('conexion:fallida', manejarSinConexion)
    return () => window.removeEventListener('conexion:fallida', manejarSinConexion)
  }, [])

  if (sinConexion) {
    return <ConnectionError onReintentar={() => { setSinConexion(false); window.location.reload() }} />
  }

  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default BigLayout
