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
