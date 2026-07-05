import { useEffect, useState } from 'react'


export default function App() {
  const [mensaje, setMensaje] = useState<string>('Cargando...')

  useEffect(() => {
    fetch('/api/hello')
      .then((res) => res.json())
      .then((data) => setMensaje(data.mensaje))
      .catch(() => setMensaje('No se pudo conectar con el servidor'))
  }, [])

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Fastify + Vite + React + TypeScript</h1>
      <p>
        Respuesta de la API: <strong>{mensaje}</strong>
      </p>
    </div>
  )
}
