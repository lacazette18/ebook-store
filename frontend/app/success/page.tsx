import { useEffect, useState } from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'Achat confirmé - E-Book Store',
}

export default function Success() {
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get('session_id')
    
    if (sessionId) {
      // Simuler une vérification (dans la vraie app, appeler l'API)
      setStatus('success')
    } else {
      setStatus('success')
    }
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0f', color: '#fff', fontFamily: 'system-ui', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '40px' }}>
        {status === 'loading' ? (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
            <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>Vérification en cours...</h1>
          </>
        ) : (
          <>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
            <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>Merci pour votre achat !</h1>
            <p style={{ color: '#888', marginBottom: '40px', fontSize: '18px' }}>
              Votre E-book est en train de vous être envoyé par email.<br/>
              Vérifiez votre boîte de réception (et spam).
            </p>
            <Link href="/" style={{ 
              padding: '15px 30px', borderRadius: '10px', 
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', 
              color: '#fff', textDecoration: 'none', fontWeight: 'bold'
            }}>
              Retour à la boutique
            </Link>
          </>
        )}
      </div>
    </main>
  )
}