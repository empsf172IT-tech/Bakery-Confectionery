/* ==========================================================================
   Maison Sucre — marketplace catalogue (shared by Home & Marketplace)
   ========================================================================== */
window.MS_DATA = (function () {
  'use strict';

  const bakeries = [
    {
      id: 'celeste',
      name: 'Atelier Céleste',
      baker: 'Élodie Marchand',
      role: 'Head Pâtissière & Founder',
      portrait: 'images/baker_woman.jpg',
      initials: 'AC',
      specialty: 'Sugar-flower couture cakes & entremets',
      rating: 4.96, reviews: 1284, years: 14,
      zone: 'Marylebone · Mayfair · Fitzrovia',
      signature: 'Rose & Lychee Celestine',
      signatureImg: 'images/rose_cake.jpg',
      bio: 'Trained at Ferrandi Paris, Élodie hand-sculpts every petal in her Marylebone atelier.'
    },
    {
      id: 'hearth',
      name: 'Hearth & Crumb',
      baker: 'Tobias Wren',
      role: 'Master Baker',
      portrait: 'https://images.unsplash.com/photo-1581007871115-f14bc016e0a4?auto=format&fit=crop&w=400&q=80',
      initials: 'HC',
      specialty: 'Wild-yeast viennoiserie & laminated pastry',
      rating: 4.91, reviews: 2310, years: 19,
      zone: 'Shoreditch · Hackney · Islington',
      signature: 'Brown Butter Almond Croissant',
      signatureImg: 'images/croissants.jpg',
      bio: 'A 72-hour lamination process and a wood-fired deck oven older than the bakery itself.'
    },
    {
      id: 'noor',
      name: 'Cacao Noor',
      baker: 'Anaya Rao',
      role: 'Chocolatier',
      portrait: 'images/chocolatier_woman.jpg',
      initials: 'CN',
      specialty: 'Single-origin bonbons & ganache tortes',
      rating: 4.94, reviews: 968, years: 9,
      zone: 'Notting Hill · Kensington · Chelsea',
      signature: 'Kerala Spice Bonbon Collection',
      signatureImg: 'images/bonbons.jpg',
      bio: 'Bean-to-bar chocolate tempered by hand on Carrara marble, inspired by South Indian spice.'
    },
    {
      id: 'ruban',
      name: 'Petit Ruban',
      baker: 'Camille Okafor',
      role: 'Macaron Specialist',
      portrait: 'images/baker_woman.jpg',
      initials: 'PR',
      specialty: 'Parisian macarons & celebration cupcakes',
      rating: 4.89, reviews: 1542, years: 7,
      zone: 'Clapham · Battersea · Fulham',
      signature: 'Maison Macaron Coffret',
      signatureImg: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80',
      bio: ''
    },
    {
      id: 'amelie',
      name: 'Amélie Pâtisserie',
      baker: 'Amélie Laurent',
      role: 'Pâtissière',
      portrait: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80',
      initials: 'AP',
      specialty: 'Chantilly cakes & curated goûter boxes',
      rating: 4.93, reviews: 1108, years: 11,
      zone: 'Chelsea · South Kensington',
      signature: 'Strawberry Chantilly Cake',
      signatureImg: 'images/berry_birthday_cake.jpg',
      bio: ''
    }
  ];

  const products = [
    { id: 'p1', name: 'Rose & Lychee Celestine', bakery: 'celeste', img: 'images/rose_cake.jpg',
      category: 'birthday', occasions: ['birthday', 'anniversary', 'celebration'], dietary: ['nut-free'],
      price: 68, rating: 4.97, reviews: 412, delivery: 'next-day', badge: 'Signature', highlight: 'signature',
      desc: 'Three tiers of lychee chiffon layered with rose Swiss meringue and raspberry gel, finished with hand-sculpted sugar ranunculus.',
      serves: 'Serves 12–14', lead: '24h notice' },
    { id: 'p2', name: 'Ivory Pampas Four-Tier', bakery: 'celeste', img: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80',
      category: 'wedding', occasions: ['wedding', 'anniversary'], dietary: [],
      price: 640, rating: 4.98, reviews: 96, delivery: 'scheduled', badge: 'Wedding Atelier', highlight: 'celebration',
      desc: 'Textured ivory buttercream over vanilla-bean and elderflower sponge, styled with garden roses and dried pampas.',
      serves: 'Serves 120', lead: '14 days notice' },
    { id: 'p3', name: 'Brown Butter Almond Croissants', bakery: 'hearth', img: 'images/croissants.jpg',
      category: 'pastries', occasions: ['gifting', 'corporate'], dietary: [],
      price: 24, rating: 4.92, reviews: 1208, delivery: 'same-day', badge: 'Bestseller', highlight: 'pastries',
      desc: 'Box of six twice-baked croissants with brown-butter frangipane and toasted Valencia almonds.',
      serves: 'Box of 6', lead: 'Order by 2 PM' },
    { id: 'p4', name: 'Kerala Spice Bonbon Collection', bakery: 'noor', img: 'images/bonbons.jpg',
      category: 'chocolates', occasions: ['gifting', 'anniversary'], dietary: ['gluten-free'],
      price: 42, rating: 4.95, reviews: 530, delivery: 'same-day', badge: 'Limited', highlight: 'gifts',
      desc: 'Sixteen hand-painted bonbons — cardamom praline, black pepper caramel, jaggery ganache and more.',
      serves: '16 pieces', lead: 'Order by 3 PM' },
    { id: 'p5', name: 'Morello Cherry Ganache Torte', bakery: 'noor', img: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80',
      category: 'birthday', occasions: ['birthday', 'celebration'], dietary: ['nut-free'],
      price: 58, rating: 4.93, reviews: 688, delivery: 'next-day', badge: null, highlight: 'signature',
      desc: '70% Ecuadorian chocolate sponge, kirsch-soaked Morello cherries and a glossy ganache drip with gold leaf.',
      serves: 'Serves 10–12', lead: '24h notice' },
    { id: 'p6', name: 'Vanilla Bean & Raspberry Cupcakes', bakery: 'ruban', img: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80',
      category: 'cupcakes', occasions: ['birthday', 'corporate'], dietary: ['eggless'],
      price: 32, rating: 4.88, reviews: 344, delivery: 'same-day', badge: 'Eggless', highlight: 'celebration',
      desc: 'Eight Madagascan vanilla cupcakes with whipped bean buttercream, fresh raspberries and edible violas.',
      serves: 'Box of 8', lead: 'Order by 1 PM' },
    { id: 'p7', name: 'Maison Macaron Coffret', bakery: 'ruban', img: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80',
      category: 'dessert-boxes', occasions: ['gifting', 'wedding'], dietary: ['gluten-free'],
      price: 46, rating: 4.96, reviews: 902, delivery: 'same-day', badge: 'Gift Edit', highlight: 'gifts',
      desc: 'Twenty-four macarons in a linen-wrapped coffret: salted caramel, rose, apricot, pistachio and fig.',
      serves: '24 pieces', lead: 'Order by 3 PM' },
    { id: 'p8', name: 'Grand Goûter Dessert Box', bakery: 'amelie', img: 'images/dessert_box.jpg',
      category: 'dessert-boxes', occasions: ['corporate', 'gifting', 'celebration'], dietary: [],
      price: 54, rating: 4.94, reviews: 276, delivery: 'next-day', badge: null, highlight: 'celebration',
      desc: 'Éclairs, financiers, choux and mini tarts — an afternoon tea in a box for four to six guests.',
      serves: '12 pieces', lead: '24h notice' },
    { id: 'p9', name: 'Autumn Fig & Poached Pear Tart', bakery: 'hearth', img: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80',
      category: 'seasonal', occasions: ['celebration', 'gifting'], dietary: [],
      price: 38, rating: 4.90, reviews: 158, delivery: 'next-day', badge: 'Autumn Edit', highlight: 'seasonal',
      desc: 'Red-wine poached Comice pears and Turkish figs over almond crème, finished with Bronte pistachio.',
      serves: 'Serves 8', lead: '24h notice' },
    { id: 'p10', name: 'Strawberry Chantilly Cake', bakery: 'amelie', img: 'images/berry_birthday_cake.jpg',
      category: 'birthday', occasions: ['birthday', 'celebration'], dietary: ['eggless'],
      price: 62, rating: 4.95, reviews: 734, delivery: 'same-day', badge: 'Same-day', highlight: 'celebration',
      desc: 'Feather-light genoise with mascarpone Chantilly, Kent strawberries and raspberries, gold candles included.',
      serves: 'Serves 10–12', lead: 'Order by 12 PM' },
    { id: 'p11', name: 'Petit Déjeuner Viennoiserie Box', bakery: 'hearth', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', pos: '20% 60%',
      category: 'pastries', occasions: ['corporate', 'celebration'], dietary: ['vegan'],
      price: 36, rating: 4.87, reviews: 421, delivery: 'same-day', badge: 'Vegan', highlight: 'pastries',
      desc: 'Plant-based croissants, pain au chocolat and cardamom knots laminated with cultured oat butter.',
      serves: 'Box of 9', lead: 'Order by 2 PM' },
    { id: 'p12', name: 'Gilded Praline Selection', bakery: 'noor', img: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80', pos: '80% 70%',
      category: 'seasonal', occasions: ['gifting', 'anniversary'], dietary: ['gluten-free', 'eggless'],
      price: 29, rating: 4.91, reviews: 212, delivery: 'next-day', badge: 'Seasonal', highlight: 'seasonal',
      desc: 'Nine gilded pralines in autumn flavours — toasted chestnut, spiced pear and smoked hazelnut.',
      serves: '9 pieces', lead: '24h notice' }
  ];

  const categories = [
    { id: 'all', label: 'All Creations' },
    { id: 'birthday', label: 'Birthday Cakes' },
    { id: 'wedding', label: 'Wedding Cakes' },
    { id: 'pastries', label: 'Pastries' },
    { id: 'cupcakes', label: 'Cupcakes' },
    { id: 'chocolates', label: 'Chocolates' },
    { id: 'dessert-boxes', label: 'Dessert Boxes' },
    { id: 'seasonal', label: 'Seasonal Specials' }
  ];

  const deliveryLabel = { 'same-day': 'Same-day delivery', 'next-day': 'Next-day delivery', scheduled: 'Scheduled delivery' };
  const bakeryById = (id) => bakeries.find((b) => b.id === id);

  return { bakeries, products, categories, deliveryLabel, bakeryById };
})();
