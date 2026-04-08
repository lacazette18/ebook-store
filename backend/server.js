const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

const app = express();
app.use(cors());
app.use(express.json());

// Clé Stripe (à configurer dans les variables d'environnement)
const stripe = new Stripe(process.env.STRIPE_SECRET || 'sk_test_xxx');

// Base de données simple en mémoire
const ebooks = [
  {
    id: 'marketing-digital',
    title: 'Marketing Digital',
    description: 'Guide complet pour réussir en ligne',
    price: 1900, // en cents
    chapters: 7,
    content: '# Marketing Digital\n\n## Chapitre 1: Les bases\n\nDans ce guide, vous apprendrez...\n\n## Chapitre 2: Les réseaux sociaux\n\nComment utiliser Instagram, TikTok...\n\n## Chapitre 3: Le SEO\n\nOptimisez votre contenu pour Google...\n\n## Chapitre 4: L\'email marketing\n\nConstruisez votre liste d\'abonnés...\n\n## Chapitre 5: La publicité\n\nDifférenciez-vous des autres...\n\n## Chapitre 6: Les Analytics\n\nMesurez vos performances...\n\n## Chapitre 7: Les erreurs à éviter\n\nNe faites pas ces mistakes...'
  },
  {
    id: 'productivite',
    title: 'Productivité',
    description: 'Gagnez du temps chaque jour',
    price: 1500,
    chapters: 5,
    content: '# Productivité\n\n## Chapitre 1: Les fondamentaux\n\nTout ce que vous devez savoir...\n\n## Chapitre 2: La gestion du temps\n\n técnicas pour optimiser...\n\n## Chapitre 3: Les outils\n\nLes meilleures apps...\n\n\n## Chapitre 4: L\'habitude\n\nConstruisez votre routine...\n\n## Chapitre 5: Le repos\n\nPourquoi il est essentiel...'
  },
  {
    id: 'crypto-debutant',
    title: 'Crypto pour Débutant',
    description: 'Comprenez les crypto sans jargon',
    price: 2900,
    chapters: 8,
    content: '# Crypto pour Débutant\n\n## Chapitre 1: C\'est quoi Bitcoin?\n\nL\'histoire de la première crypto...\n\n\n## Chapitre 2: Comment ça marche?\n\nLa blockchain expliquée simply...\n\n\n## Chapitre 3: Acheter vos premières crypto\n\nPas à pas...\n\n## Chapitre 4: Le wallet\n\nComment stocker vos Crypto en sécurité...\n\n\n## Chapitre 5: Les NFTs\n\nAu-delà des images...\n\n\n## Chapitre 6: Les arnaques\n\nComment les éviter...\n\n\n## Chapitre 7: La fiscalite\n\nCe que vous devez déclarer...\n\n## Chapitre 8: L\'avenir\n\nCe qui attend les crypto...'
  }
];

const purchases = [];

// GET /api/ebooks - Liste tous les E-books
app.get('/api/ebooks', (req, res) => {
  res.json(ebooks.map(e => ({ 
    id: e.id, 
    title: e.title, 
    description: e.description, 
    price: e.price,
    priceFormatted: `$${(e.price / 100).toFixed(2)}`,
    chapters: e.chapters 
  })));
});

// GET /api/ebooks/:id - Détails d'un E-book
app.get('/api/ebooks/:id', (req, res) => {
  const ebook = ebooks.find(e => e.id === req.params.id);
  if (!ebook) return res.status(404).json({ error: 'E-book non trouvé' });
  res.json(ebook);
});

// POST /api/create-checkout-session - Créer une session de paiement Stripe
app.post('/api/create-checkout-session', async (req, res) => {
  const { ebookId, email, successUrl, cancelUrl } = req.body;
  const ebook = ebooks.find(e => e.id === ebookId);
  
  if (!ebook) return res.status(404).json({ error: 'E-book non trouvé' });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: ebook.title,
            description: ebook.description,
          },
          unit_amount: ebook.price,
        },
        quantity: 1,
      }],
      mode: 'payment',
      customer_email: email,
      success_url: successUrl || 'https://ebook-store.vercel.app/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancelUrl || 'https://ebook-store.vercel.app/',
      metadata: {
        ebookId: ebookId,
      },
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/webhook - Webhook Stripe pour confirmer les paiements
app.post('/api/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { ebookId, email } = session.metadata;
    
    // Enregistrer l'achat
    purchases.push({
      id: session.id,
      ebookId,
      email: session.customer_email,
      date: new Date(),
      status: 'completed'
    });
  }

  res.json({ received: true });
});

// POST /api/verify-purchase - Vérifier un achat
app.post('/api/verify-purchase', async (req, res) => {
  const { sessionId, email } = req.body;
  
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      const purchase = purchases.find(p => p.id === sessionId);
      if (!purchase) {
        purchases.push({
          id: sessionId,
          ebookId: session.metadata.ebookId,
          email: email || session.customer_email,
          date: new Date(),
          status: 'completed'
        });
      }
      res.json({ verified: true, ebookId: session.metadata.ebookId });
    } else {
      res.json({ verified: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/download/:ebookId - Télécharger après vérification (version simplifiée)
app.get('/api/download/:id', (req, res) => {
  // Pour la version complète, ajouter vérification de l'achat
  const ebook = ebooks.find(e => e.id === req.params.id);
  if (!ebook) return res.status(404).json({ error: 'E-book non trouvé' });
  res.json({ content: ebook.content });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`E-Book Store API running on port ${PORT}`));