import Link from 'next/link'

export const metadata = {
  title: 'E-Book Store - Nos Guides Pratiques',
  description: 'Téléchargez nos guides pour maîtriser votre métier',
}

export default function Home() {
  const ebooks = [
    {
      id: 'marketing-digital',
      title: 'Marketing Digital',
      description: 'Guide complet pour réussir en ligne',
      price: 19,
      chapters: 7,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'productivite',
      title: 'Productivité',
      description: 'Gagnez du temps chaque jour',
      price: 15,
      chapters: 5,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'crypto-debutant',
      title: 'Crypto pour Débutant',
      description: 'Comprenez les crypto sans jargon',
      price: 29,
      chapters: 8,
      color: 'from-orange-500 to-yellow-500'
    }
  ]

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
          <div key={ebook.id} style={{ background: '#111', borderRadius: '20px', padding: '30px', border: '1px solid #222', transition: 'transform 0.2s' }}>
            <div style={{ 
              width: '60px', height: '60px', borderRadius: '15px', 
              background: `linear-gradient(135deg, var(--${ebook.color.split(' ')[0].replace('from-', '')}), var(--${ebook.color.split(' ')[1].replace('to-', '')}))`,
              marginBottom: '20px', fontSize: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              📖
            </div>
            
            <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>{ebook.title}</h3>
            <p style={{ color: '#888', marginBottom: '20px' }}>{ebook.description}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '32px', fontWeight: 'bold' }}>${ebook.price}</span>
              <span style={{ color: '#666' }}>{ebook.chapters} chapitres</span>
            </div>
            
            <a href={`/ebook/${ebook.id}`} style={{ 
              display: 'block', padding: '15px', borderRadius: '10px', 
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', 
              color: '#fff', textAlign: 'center', textDecoration: 'none', fontWeight: 'bold'
            }}>
              Voir le guide →
            </a>
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