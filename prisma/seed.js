const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const PRODUCTS = [
  { id: 1, name: "Hermès-Style Silk Scarf", price: 3499, category: "Luxury Fashion", tags: ["women","luxury","anniversary"], rating: 4.9, reviews: 312, image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&q=85", badge: "Bestseller", desc: "Hand-rolled edges, 100% pure silk. Arrives in signature gift box with ribbon.", stock: 50 },
  { id: 2, name: "Japanese Cast Iron Tea Set", price: 4299, category: "Home & Lifestyle", tags: ["parents","home","birthday"], rating: 4.8, reviews: 178, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=85", badge: "Top Rated", desc: "Authentic tetsubin design with 4 cups. Keeps tea perfectly hot for 2+ hours.", stock: 25 },
  { id: 3, name: "Sony WH-1000XM5 Headphones", price: 6999, category: "Premium Tech", tags: ["teen","music","birthday","tech"], rating: 4.9, reviews: 891, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=85", badge: "Premium", desc: "Industry-leading noise cancellation. 30hr battery. The gift they'll use every day.", stock: 12 },
  { id: 4, name: "Leather Bound Journal Set", price: 1899, category: "Stationery", tags: ["student","writing","any","creative"], rating: 4.7, reviews: 445, image: "https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?w=500&q=85", badge: null, desc: "Handstitched Italian leather cover + fountain pen. For the thinker in your life.", stock: 80 },
  { id: 5, name: "Luxury Aroma Diffuser Kit", price: 2999, category: "Wellness", tags: ["women","relaxation","birthday","wellness"], rating: 4.8, reviews: 267, image: "https://images.unsplash.com/photo-1608181831688-8a6f95a87a6a?w=500&q=85", badge: "New", desc: "Ultrasonic diffuser with 7-colour LED + 6 premium essential oils in velvet pouch.", stock: 45 },
  { id: 6, name: "Rare Orchid in Glazed Pot", price: 2199, category: "Botanicals", tags: ["anyone","home","housewarming"], rating: 4.6, reviews: 134, image: "https://images.unsplash.com/photo-1487530811015-780f3d99b6c0?w=500&q=85", badge: null, desc: "Live Phalaenopsis orchid in hand-glazed ceramic. Blooms for months.", stock: 76 },
  { id: 7, name: "Belgian Luxury Chocolate Box", price: 2499, category: "Gourmet Food", tags: ["anyone","sweet","valentine","celebration"], rating: 4.9, reviews: 623, image: "https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=500&q=85", badge: "Bestseller", desc: "32 hand-crafted pralines — truffles, ganaches & caramels. Gold ribbon packaged.", stock: 48 },
  { id: 8, name: "Swiss Automatic Watch", price: 12999, category: "Fine Accessories", tags: ["men","luxury","anniversary"], rating: 4.9, reviews: 156, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=85", badge: "Ultra Premium", desc: "Swiss movement, sapphire crystal. Mahogany presentation box included.", stock: 8 },
  { id: 9, name: "Polaroid Photo Album Kit", price: 1299, category: "Memories", tags: ["family","memories","anniversary","sentimental"], rating: 4.7, reviews: 389, image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&q=85", badge: null, desc: "Instant camera + 40 films + gold-edged scrapbook. For priceless memories.", stock: 60 },
  { id: 10, name: "Ayurvedic Wellness Hamper", price: 3799, category: "Wellness", tags: ["anyone","health","birthday"], rating: 4.7, reviews: 201, image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500&q=85", badge: null, desc: "10-piece set: copper bottle, herbal teas, cold-pressed oils & more.", stock: 35 },
  { id: 11, name: "Marble & Alabaster Chess Set", price: 5499, category: "Games & Leisure", tags: ["men","family","any"], rating: 4.8, reviews: 112, image: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=500&q=85", badge: null, desc: "Marble board with hand-carved alabaster pieces. A timeless statement piece.", stock: 15 },
  { id: 12, name: "Professional Art Studio Set", price: 4199, category: "Creative Arts", tags: ["kids","creative","birthday","art"], rating: 4.9, reviews: 334, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=85", badge: "New", desc: "120 professional-grade tools: watercolors, oils, pastels & sketch pads.", stock: 28 },
  { id: 13, name: "Kashmiri Pashmina Shawl", price: 8999, category: "Luxury Fashion", tags: ["women","luxury","wedding","anniversary"], rating: 4.9, reviews: 156, image: "https://images.unsplash.com/photo-1606107555365-1f3d6f12b8b5?w=500&q=85", badge: "Premium", desc: "Hand-woven 100% pure Pashmina wool. So-soft it passes through a ring.", stock: 18 },
  { id: 14, name: "Philips Hue Ambient Light Set", price: 5499, category: "Home & Lifestyle", tags: ["home","tech","decor","any"], rating: 4.7, reviews: 892, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=85", badge: "Top Rated", desc: "Smart ambient lighting with 16M colors. App-controlled, voice assistant ready.", stock: 42 },
  { id: 15, name: "Keychron K2 Mechanical Keyboard", price: 3299, category: "Premium Tech", tags: ["tech","work","gaming","productivity"], rating: 4.8, reviews: 567, image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=85", badge: null, desc: "Wireless mechanical keyboard with Gateron switches. Aluminum frame, RGB backlit.", stock: 35 },
  { id: 16, name: "Montblanc Style Fountain Pen", price: 4599, category: "Stationery", tags: ["executive","writing","luxury","office"], rating: 4.8, reviews: 234, image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=500&q=85", badge: "Premium", desc: "14K gold nib fountain pen with resin body. A writer's lifetime companion.", stock: 22 },
  { id: 17, name: "Tibetan Singing Bowl Set", price: 1899, category: "Wellness", tags: ["wellness","meditation","yoga","peace"], rating: 4.7, reviews: 445, image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=500&q=85", badge: null, desc: "Hand-hammered brass singing bowl with cushion & mallet. Deep resonance for meditation.", stock: 55 },
  { id: 18, name: "Japanese Bonsai Starter Kit", price: 2699, category: "Botanicals", tags: ["plants","zen","hobby","home"], rating: 4.6, reviews: 178, image: "https://images.unsplash.com/photo-1567619690754-88ef1235e4e8?w=500&q=85", badge: "New", desc: "Complete bonsai kit with 3 tree varieties, pots, soil & care guide.", stock: 38 },
  { id: 19, name: "Single Origin Coffee Collection", price: 1999, category: "Gourmet Food", tags: ["coffee","gourmet","morning","foodie"], rating: 4.8, reviews: 312, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=85", badge: null, desc: "4 premium single-origin beans from Ethiopia, Colombia, Bali & Kenya. Fresh roasted.", stock: 65 },
  { id: 20, name: "Ridge Titanium Minimalist Wallet", price: 3499, category: "Fine Accessories", tags: ["men","minimalist","edc","modern"], rating: 4.7, reviews: 892, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=85", badge: "Bestseller", desc: "RFID-blocking titanium wallet. Holds 12 cards + cash. Lifetime warranty included.", stock: 48 },
  { id: 21, name: "Custom Star Map Frame", price: 1599, category: "Memories", tags: ["anniversary","personalized","romance","custom"], rating: 4.9, reviews: 523, image: "https://images.unsplash.com/photo-1519689683798-3828fb4090bb?w=500&q=85", badge: "Top Rated", desc: "Personalized night sky map of any special date. Museum-quality frame included.", stock: 72 },
  { id: 22, name: "Theory11 Luxury Playing Cards", price: 1299, category: "Games & Leisure", tags: ["cards","magic","collection","luxury"], rating: 4.8, reviews: 667, image: "https://images.unsplash.com/photo-1534349762230-e0cadf68f7d1?w=500&q=85", badge: null, desc: "Premium foil-stamped playing cards by Theory11. Gold foil, custom art, premium stock.", stock: 88 },
  { id: 23, name: "Beginner Pottery Wheel Kit", price: 5999, category: "Creative Arts", tags: ["art","pottery","creative","hobby"], rating: 4.6, reviews: 89, image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&q=85", badge: "New", desc: "Compact electric pottery wheel with 5kg clay, tools & apron. Create at home.", stock: 15 },
  { id: 24, name: "Mulberry Silk Sleep Set", price: 2799, category: "Wellness", tags: ["women","sleep","beauty","self-care"], rating: 4.9, reviews: 445, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=85", badge: "Premium", desc: "22 Momme silk pillowcase, eye mask & scrunchie. Anti-aging, hypoallergenic.", stock: 52 },
  { id: 25, name: "Audio-Technica Turntable", price: 8999, category: "Premium Tech", tags: ["music","vinyl","audiophile","retro"], rating: 4.8, reviews: 334, image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500&q=85", badge: "Ultra Premium", desc: "Belt-drive turntable with AT-VM95E cartridge. Hi-Fi sound, built-in preamp.", stock: 12 },
  { id: 26, name: "Full-Grain Leather Belt", price: 2199, category: "Fine Accessories", tags: ["men","classic","leather","timeless"], rating: 4.7, reviews: 234, image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500&q=85", badge: null, desc: "Italian vegetable-tanned leather belt. Solid brass buckle. Ages beautifully.", stock: 40 },
  { id: 27, name: "Global Artisan Spice Box", price: 1799, category: "Gourmet Food", tags: ["cooking","spices","foodie","home"], rating: 4.6, reviews: 178, image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=85", badge: null, desc: "9 exotic spices from around the world in wooden masala dabba. Recipe guide included.", stock: 58 },
  { id: 28, name: "Golden Acrylic Paint Set", price: 3499, category: "Creative Arts", tags: ["art","painting","professional","colors"], rating: 4.8, reviews: 267, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=85", badge: "Top Rated", desc: "24 heavy-body acrylics with easel & brushes. Artist-grade pigments.", stock: 30 },
  { id: 29, name: "Lead Crystal Decanter Set", price: 6499, category: "Home & Lifestyle", tags: ["bar","whiskey","elegant","home"], rating: 4.9, reviews: 145, image: "https://images.unsplash.com/photo-1575023782549-62ca0d244b39?w=500&q=85", badge: "Premium", desc: "Hand-cut lead crystal decanter + 4 tumblers. 24% PbO. Mahogany gift box.", stock: 20 },
  { id: 30, name: "Jo Malone Fragrance Collection", price: 7499, category: "Luxury Fashion", tags: ["women","perfume","luxury","fragrance"], rating: 4.9, reviews: 567, image: "https://images.unsplash.com/photo-1541643600914-78a084683485?w=500&q=85", badge: "Ultra Premium", desc: "5 signature colognes in 9ml bottles. Luxe gift box with ribbon.", stock: 25 },
];

async function main() {
  console.log("🌱 Seeding database...");

  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    });
    console.log(`  ✓ ${product.name}`);
  }

  console.log(`\n✅ Seeded ${PRODUCTS.length} products successfully!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
