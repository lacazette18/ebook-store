const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Base de données simple en mémoire (à remplacer par une DB pour la prod)
const ebooks = [
  {
    id: 'marketing-digital',
    title: 'Marketing Digital',
    description: 'Guide complet pour réussir en ligne',
    price: 19,
    chapters: 7,
    content: '# Marketing Digital\n\n## Chapitre 1: Les bases\n\n...'
  },
  {
    id: 'productivite',
    title: 'Productivité',
    description: 'Gagnez du temps chaque jour',
    price: 15,
    chapters: 5,
    content: '# Productivité\n\n## Chapitre 1: Les fundamentos\n\n...'
  },
  {
    id: 'crypto-debutant',
    title: 'Crypto pour Débutant',
    description: 'Comprenez les crypto sans jargon',
    price: 29,
    chapters: 8,
    content: '# Crypto pour Débutant\n\n## Chapitre 1: C\'est quoi Bitcoin?\n\n...'
  }
];

const purchases = [];

// GET /api/ebooks - Liste tous les E-books
app.get('/api/ebooks', (req, res) => {
  res.json(ebooks.map(e => ({ id: e.id, title: e.title, description: e.description, price: e.price, chapters: e.chapters })));
});

// GET /api/ebooks/:id - Détails d'un E-book
app.get('/api/ebooks/:id', (req, res) => {
  const ebook = ebooks.find(e => e.id === req.params.id);
  if (!ebook) return res.status(404).json({ error: 'E-book non trouvé' });
  res.json(ebook);
});

// POST /api/purchase - Acheter un E-book
app.post('/api/purchase', (req, res) => {
  const { ebookId, email } = req.body;
  const ebook = ebooks.find(e => e.id === ebookId);
  if (!ebook) return res.status(404).json({ error: 'E-book non trouvé' });
  
  // Créer un lien de paiement (ici: lien Gumroad ou Stripe)
  const purchaseId = Date.now().toString(36);
  purchases.push({ purchaseId, ebookId, email, date: new Date() });
  
  // Lien de paiement (à remplacer par真实的 Stripe/Gumroad)
  res.json({ 
    purchaseId, 
    url: `https://gum.co/votre-produit?email=${email}&ref=${purchaseId}`,
    ebook: ebook.title 
  });
});

// GET /api/download/:purchaseId - Télécharger après achat
app.get('/api/download/:purchaseId', (req, res) => {
  const purchase = purchases.find(p => p.purchaseId === req.params.purchaseId);
  if (!purchase) return res.status(404).json({ error: 'Achat non trouvé' });
  
  const ebook = ebooks.find(e => e.id === purchase.ebookId);
  res.json({ content: ebook.content });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`E-Book Store API running on port ${PORT}`));