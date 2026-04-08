const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuration Buy Me a Coffee
const BMC_USERNAME = process.env.BMC_USERNAME || 'nathanlcz';

// Base de données simple en mémoire
const purchases = [];

const ebooks = [
  {
    id: 'marketing-digital',
    title: 'Marketing Digital',
    description: 'Guide complet pour réussir en ligne',
    price: 19,
    chapters: 7,
    content: '# Marketing Digital\n\n## Chapitre 1: Les bases\n\nDans ce guide, vous apprendrez les fundamentals du marketing digital...\n\n## Chapitre 2: Les réseaux sociaux\n\nComment utiliser Instagram, TikTok, LinkedIn...\n\n## Chapitre 3: Le SEO\n\nOptimisez votre contenu pour Google...\n\n## Chapitre 4: L\'email marketing\n\nConstruisez votre liste d\'abonnés...\n\n## Chapitre 5: La publicité\n\nDifférenciez-vous des autres...\n\n## Chapitre 6: Les Analytics\n\nMesurez vos performances...\n\n## Chapitre 7: Les erreurs à éviter\n\nNe faites pas ces mistakes...'
  },
  {
    id: 'productivite',
    title: 'Productivité',
    description: 'Gagnez du temps chaque jour',
    price: 15,
    chapters: 5,
    content: '# Productivité\n\n## Chapitre 1: Les fondamentaux\n\nTout ce que vous devez savoir...\n\n## Chapitre 2: La gestion du temps\n\ntechniques pour optimiser...\n\n## Chapitre 3: Les outils\n\nLes meilleures apps...\n\n## Chapitre 4: L\'habitude\n\nConstruisez votre routine...\n\n## Chapitre 5: Le repos\n\nPourquoi il est essentiel...'
  },
  {
    id: 'crypto-debutant',
    title: 'Crypto pour Débutant',
    description: 'Comprenez les crypto sans jargon',
    price: 29,
    chapters: 8,
    content: '# Crypto pour Débutant\n\n## Chapitre 1: C\'est quoi Bitcoin?\n\nL\'histoire de la première crypto...\n\n## Chapitre 2: Comment ça marche?\n\nLa blockchain expliquée simply...\n\n## Chapitre 3: Acheter vos premières crypto\n\nPas à pas...\n## Chapitre 4: Le wallet\n\nComment stocker vos Crypto en sécurité...\n\n## Chapitre 5: Les NFTs\n\nAu-delà des images...\n\n## Chapitre 6: Les arnaques\n\nComment les éviter...\n\n## Chapitre 7: La fiscalite\n\nCe que vous devez déclarer...\n## Chapitre 8: L\'avenir\n\nCe qui attend les crypto...'
  }
];

// GET /api/ebooks - Liste tous les E-books
app.get('/api/ebooks', (req, res) => {
  res.json(ebooks.map(e => ({ 
    id: e.id, 
    title: e.title, 
    description: e.description, 
    price: e.price,
    chapters: e.chapters 
  })));
});

// GET /api/ebooks/:id - Détails d'un E-book
app.get('/api/ebooks/:id', (req, res) => {
  const ebook = ebooks.find(e => e.id === req.params.id);
  if (!ebook) return res.status(404).json({ error: 'E-book non trouvé' });
  res.json(ebook);
});

// POST /api/create-payment - Créer un lien de paiement Buy Me a Coffee
app.post('/api/create-payment', (req, res) => {
  const { ebookId, email, discordId } = req.body;
  const ebook = ebooks.find(e => e.id === ebookId);
  
  if (!ebook) return res.status(404).json({ error: 'E-book non trouvé' });

  // Créer un ID d'achat unique
  const purchaseId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  
  // Lien Buy Me a Coffee avec montant prédéfini
  const bmcUrl = `https://buymeacoffee.com/${BMC_USERNAME}?amount=${ebook.price}&disableFeed=true&redirect_page=/m/${purchaseId}`;
  
  // Enregistrer l'intention d'achat (non confirmé pour l'instant)
  purchases.push({
    id: purchaseId,
    ebookId,
    email,
    discordId,
    amount: ebook.price,
    date: new Date(),
    status: 'pending'
  });

  res.json({ 
    purchaseId,
    url: bmcUrl,
    amount: ebook.price,
    message: `Soutenez-moi ${ebook.price}$ sur Buy Me a Coffee!`
  });
});

// POST /api/webhook - Webhook Buy Me a Coffee (simplifié)
app.post('/api/webhook', express.json(), (req, res) => {
  const { purchaseId, status } = req.body;
  
  if (status === 'completed' && purchaseId) {
    const purchase = purchases.find(p => p.id === purchaseId);
    if (purchase) {
      purchase.status = 'completed';
    }
  }

  res.json({ received: true });
});

// POST /api/verify-purchase - Vérifier un achat
app.post('/api/verify-purchase', (req, res) => {
  const { purchaseId, email } = req.body;
  const purchase = purchases.find(p => p.id === purchaseId);
  
  if (purchase && purchase.status === 'completed') {
    res.json({ verified: true, ebookId: purchase.ebookId });
  } else {
    res.json({ verified: false });
  }
});

// GET /api/download/:id - Télécharger un E-book
app.get('/api/download/:id', (req, res) => {
  const purchaseId = req.query.purchaseId;
  const purchase = purchases.find(p => p.id === purchaseId);
  
  if (!purchase || purchase.status !== 'completed') {
    // En mode démo, autoriser l'accès sans achat
    const ebook = ebooks.find(e => e.id === req.params.id);
    if (ebook) {
      return res.json({ content: ebook.content, demo: true });
    }
    return res.status(404).json({ error: 'E-book non trouvé ou achat non confirmé' });
  }
  
  const ebook = ebooks.find(e => e.id === purchase.ebookId);
  if (!ebook) return res.status(404).json({ error: 'E-book non trouvé' });
  
  res.json({ content: ebook.content });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`E-Book Store API running on port ${PORT}`));