import { useState } from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'E-Book Store - Nos Guides Pratiques',
  description: 'Téléchargez nos guides pour maîtriser votre métier',
}

export default function Home() {
  const [loading, setLoading] = useState(null)
  
  const ebooks = [
    {
      id: 'marketing-digital',
      title: 'Marketing Digital',
      description: 'Guide complet pour réussir en ligne',
      price: 19,
      priceCents: 1900,
      chapters: 7,
      icon: '📈'
    },
    {
      id: 'productivite',
      title: 'Productivité',
      description: 'Gagnez du temps chaque jour',
      price: 15,
      priceCents: 1500,
      chapters: 5,
      icon: '⚡'
    },
    {
      id: 'crypto-debutant',
      title: 'Crypto pour Débutant',
      description: 'Comprenez les crypto sans jargon',
      price: 29,
      priceCents: 2900,
      chapters: 8,
      icon: '₿'
    }
  ]

  async function handleBuy(ebookId) {
    setLoading(ebookId)
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ebookId,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: window.location.origin
        })
      })
      
      const data = await res.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Erreur: ' + data.error)
        setLoading(null)
      }
    } catch (error) {
      alert('Erreur de connexion')
      setLoading(null)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0f', color: '#fff', fontFamily: 'system-ui' }}>
      {/* Header */}
      <header style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>📚 E-Book Store</h1>
        <Link href="/dashboard" style={{ color: '#888', textDecoration: 'none' }}>Admin</Link>
      </header>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2 style={{ fontSize: '48px', marginBottom: '20px', background: 'linear-gradient(135deg, #fff, #888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Maîtrisez votre métier
        </h2>
        <p style={{ fontSize: '20px', color: '#888', maxWidth: '600px', margin: '0 auto 40px' }}>
          Des guides pratiques écrits par des experts. Application immédiate.
        </p>
      </section>

      {/* E-books Grid */}
      <section style={{ padding: '0 40px 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        {ebooks.map((ebook) => (
          <div key={ebook.id} style={{ background: '#111', borderRadius: '20px', padding: '30px', border: '1px solid #222' }}>
            <div style={{ 
              width: '60px', height: '60px', borderRadius: '15px', 
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              marginBottom: '20px', fontSize: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {ebook.icon}
            </div>
            
            <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>{ebook.title}</h3>
            <p style={{ color: '#888', marginBottom: '20px' }}>{ebook.description}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '32px', fontWeight: 'bold' }}>${ebook.price}</span>
              <span style={{ color: '#666' }}>{ebook.chapters} chapitres</span>
            </div>
            
            <button 
              onClick={() => handleBuy(ebook.id)}
              disabled={loading === ebook.id}
              style={{ 
                width: '100%', padding: '15px', borderRadius: '10px', 
                background: loading === ebook.id ? '#333' : 'linear-gradient(90deg, #6366f1, #8b5cf6)', 
                color: '#fff', border: 'none', fontSize: '16px', fontWeight: 'bold',
                cursor: loading === ebook.id ? 'not-allowed' : 'pointer',
                opacity: loading === ebook.id ? 0.5 : 1
              }}
            >
              {loading === ebook.id ? 'Chargement...' : 'Acheter maintenant →'}
            </button>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '40px', borderTop: '1px solid #222', color: '#666' }}>
        <p>© 2026 E-Book Store • <a href="#" style={{ color: '#666' }}>Mentions légales</a></p>
      </footer>
    </main>
  )
}