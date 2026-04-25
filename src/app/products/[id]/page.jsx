"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const GOLD = "#C9A84C", DARK = "#0A0804", SURFACE = "#13110C", CARD = "#1A1710", BORDER = "#2E2A1E", MUTED = "#6B6248";

// Reliable GLB model for AR - Astronaut is well-tested
const AR_MODEL_URL = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";

const AR_MODELS = {
  "Luxury Fashion": { src: AR_MODEL_URL, ios: null, color: "#C9A84C" },
  "Home & Lifestyle": { src: AR_MODEL_URL, ios: null, color: "#52b788" },
  "Premium Tech": { src: AR_MODEL_URL, ios: null, color: "#7ab8f5" },
  "Stationery": { src: AR_MODEL_URL, ios: null, color: "#e87fa8" },
  "Wellness": { src: AR_MODEL_URL, ios: null, color: "#9b91ff" },
  "Botanicals": { src: AR_MODEL_URL, ios: null, color: "#52b788" },
  "Gourmet Food": { src: AR_MODEL_URL, ios: null, color: "#e87fa8" },
  "Fine Accessories": { src: AR_MODEL_URL, ios: null, color: "#C9A84C" },
  "Memories": { src: AR_MODEL_URL, ios: null, color: "#e87fa8" },
  "Games & Leisure": { src: AR_MODEL_URL, ios: null, color: "#7ab8f5" },
  "Creative Arts": { src: AR_MODEL_URL, ios: null, color: "#9b91ff" },
  "default": { src: AR_MODEL_URL, ios: null, color: "#C9A84C" }
};

const PRODUCTS = [
  { id:1, name:"Hermès-Style Silk Scarf", price:3499, category:"Luxury Fashion", tags:["women","luxury","anniversary"], rating:4.9, reviews:312, image:"https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=90", badge:"Bestseller", desc:"Hand-rolled edges, 100% pure silk. Arrives in our signature gift box with satin ribbon. A timeless declaration of elegance — she'll drape herself in your affection every day.", stock:50, arSrc:null, longDesc:"Crafted from 100% pure, Grade A habotai silk, this scarf is a tribute to the art of luxury gifting. Each edge is hand-rolled by artisans in a 3-day process. The pattern is printed using eco-certified dyes that retain vibrancy wash after wash. Ships in our signature black gift box with gold satin ribbon and a personalized gift note card." },
  { id:2, name:"Japanese Cast Iron Tea Set", price:4299, category:"Home & Lifestyle", tags:["parents","home","birthday"], rating:4.8, reviews:178, image:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=90", badge:"Top Rated", desc:"Authentic tetsubin design with 4 cups. Keeps tea perfectly hot for 2+ hours.", stock:25, arSrc:null, longDesc:"Forged using traditional Japanese casting techniques, this tetsubin (cast iron teapot) retains heat for over 2 hours. Set includes the teapot, 4 cast iron cups, a bamboo tray, and a mini strainer. The interior is enamel-coated to prevent rust. A morning ritual elevated to an art form." },
  { id:3, name:"Sony WH-1000XM5 Headphones", price:6999, category:"Premium Tech", tags:["teen","music","birthday","tech"], rating:4.9, reviews:891, image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=90", badge:"Premium", desc:"Industry-leading noise cancellation. 30hr battery. The gift they'll use every day.", stock:12, arSrc:null, longDesc:"The Sony WH-1000XM5 features 8 microphones and two processors for the most advanced noise cancellation in headphones. Crystal-clear hands-free calling, 30-hour battery life, and multi-device pairing. Ships in a luxury gift-ready case with a ribbon bow and care card." },
  { id:4, name:"Leather Bound Journal Set", price:1899, category:"Stationery", tags:["student","writing","any","creative"], rating:4.7, reviews:445, image:"https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?w=800&q=90", badge:null, desc:"Handstitched Italian leather cover + fountain pen. For the thinker in your life.", stock:80, arSrc:null, longDesc:"The journal features a full-grain Italian leather cover, handstitched with waxed linen thread. 240 pages of acid-free, fountain pen-friendly paper. Includes a matching leather bookmark and a classic Kaweco fountain pen. For the writer, the planner, the dreamer in your life." },
  { id:5, name:"Luxury Aroma Diffuser Kit", price:2999, category:"Wellness", tags:["women","relaxation","birthday","wellness"], rating:4.8, reviews:267, image:"https://images.unsplash.com/photo-1608181831688-8a6f95a87a6a?w=800&q=90", badge:"New", desc:"Ultrasonic diffuser with 7-colour LED + 6 premium essential oils in velvet pouch.", stock:45, arSrc:null, longDesc:"Ultrasonic technology creates a fine, cool mist that fills your space with a healing fragrance. The 7-colour LED creates a spa-like ambiance. Includes 6 premium essential oils: Lavender, Eucalyptus, Bergamot, Sandalwood, Peppermint & Rose. All packed in a velvet-lined gift box." },
  { id:6, name:"Rare Orchid in Glazed Pot", price:2199, category:"Botanicals", tags:["anyone","home","housewarming"], rating:4.6, reviews:134, image:"https://images.unsplash.com/photo-1487530811015-780f3d99b6c0?w=800&q=90", badge:null, desc:"Live Phalaenopsis orchid in hand-glazed ceramic. Blooms for months.", stock:76, arSrc:null, longDesc:"A living Phalaenopsis orchid (Moth Orchid), selected at peak bloom and potted in a handcrafted, hand-glazed ceramic pot. With minimal care (water every 10 days, indirect sunlight), it will bloom for 3–6 months. A gift that literally grows with your love." },
  { id:7, name:"Belgian Luxury Chocolate Box", price:2499, category:"Gourmet Food", tags:["anyone","sweet","valentine","celebration"], rating:4.9, reviews:623, image:"https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=800&q=90", badge:"Bestseller", desc:"32 hand-crafted pralines — truffles, ganaches & caramels. Gold ribbon packaged.", stock:48, arSrc:null, longDesc:"32 hand-crafted Belgian pralines in a luxurious gold-ribbon box: 8 dark chocolate truffles, 8 milk chocolate ganaches, 8 salted caramels, and 8 fruit-flavoured bonbons. Made by a 3rd-generation Belgian chocolatier. No artificial preservatives. Best enjoyed within 30 days of delivery." },
  { id:8, name:"Swiss Automatic Watch", price:12999, category:"Fine Accessories", tags:["men","luxury","anniversary"], rating:4.9, reviews:156, image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=90", badge:"Ultra Premium", desc:"Swiss movement, sapphire crystal. Mahogany presentation box included.", stock:8, arSrc:null, longDesc:"A Swiss ETA automatic movement beats inside this timepiece at 28,800 vph, accurate to ±5 seconds/day. The dial features a domed sapphire crystal (9H hardness) resistant to scratches. 50m water resistance. Ships in a handcrafted mahogany presentation box with a certificate of authenticity." },
  { id:9, name:"Polaroid Photo Album Kit", price:1299, category:"Memories", tags:["family","memories","anniversary","sentimental"], rating:4.7, reviews:389, image:"https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=90", badge:null, desc:"Instant camera + 40 films + gold-edged scrapbook. For priceless memories.", stock:60, arSrc:null, longDesc:"The kit includes a Polaroid Now+ instant camera, 40 Polaroid i-Type film sheets, and a handcrafted gold-edged scrapbook with kraft paper pages. A gift that transforms any moment into a forever memory. Perfect for family reunions, anniversaries, and milestone celebrations." },
  { id:10, name:"Ayurvedic Wellness Hamper", price:3799, category:"Wellness", tags:["anyone","health","birthday"], rating:4.7, reviews:201, image:"https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=90", badge:null, desc:"10-piece set: copper bottle, herbal teas, cold-pressed oils & more.", stock:35, arSrc:null, longDesc:"A curated 10-piece wellness gift featuring: handcrafted copper water bottle, 3 artisan herbal teas (Tulsi, Ashwagandha, Brahmi blend), cold-pressed coconut oil, organic turmeric paste, rose water toner,  neem face pack, and a linen wellness journal. All packed in a jute hamper basket." },
  { id:11, name:"Marble & Alabaster Chess Set", price:5499, category:"Games & Leisure", tags:["men","family","any"], rating:4.8, reviews:112, image:"https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=800&q=90", badge:null, desc:"Marble board with hand-carved alabaster pieces. A timeless statement piece.", stock:15, arSrc:null, longDesc:"A full-sized chess board crafted from Italian Carrara marble, with 32 hand-carved alabaster pieces in natural white and forest green. The depth-carved squares ensure pieces never slip. Ships in a velvet-lined wooden crate. A statement art piece for any desk or living room." },
  { id:12, name:"Professional Art Studio Set", price:4199, category:"Creative Arts", tags:["kids","creative","birthday","art"], rating:4.9, reviews:334, image:"https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=90", badge:"New", desc:"120 professional-grade tools: watercolors, oils, pastels & sketch pads.", stock:28, arSrc:null, longDesc:"A comprehensive 120-piece professional art kit including: 36 watercolour pans, 24 oil pastel sticks, 24 soft pastels, 12 graphite pencils (2H–9B), 2 heavyweight sketch pads (A3 & A4), a mixing palette, 6 brushes, and a carry case. Suitable for beginners to advanced artists aged 8+." },
];

const BADGE_C = { "Bestseller":[GOLD+"22",GOLD,GOLD+"55"], "Top Rated":["#52b78822","#52b788","#52b78855"], "Premium":["#378add22","#7ab8f5","#378add55"], "Ultra Premium":["#d4537e22","#e87fa8","#d4537e55"], "New":["#9b91ff22","#b0a8ff","#7f77dd55"] };

function SkeletonBlock({ width = "100%", height = "24px", radius = "8px" }) {
  return <div style={{ width, height, borderRadius: radius, background: `linear-gradient(90deg, ${CARD} 0%, #23201a 50%, ${CARD} 100%)`, backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }}/>;
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = parseInt(params.id);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartAdded, setCartAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [showAR, setShowAR] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    // Simulate DB fetch with localStorage cart init
    setTimeout(() => {
      const p = PRODUCTS.find(x => x.id === id);
      setProduct(p || null);
      setLoading(false);
    }, 600);
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    const stored = JSON.parse(localStorage.getItem("giftai_cart") || "[]");
    const existing = stored.find(i => i.id === product.id);
    const updated = existing
      ? stored.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
      : [...stored, { ...product, qty }];
    localStorage.setItem("giftai_cart", JSON.stringify(updated));
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2000);
  };

  // Simulated multiple image angles using query params
  const images = product ? [
    product.image,
    product.image.replace("w=800", "w=800&crop=left"),
    product.image.replace("w=800", "w=800&crop=right"),
  ] : [];

  if (loading) return (
    <div style={{ fontFamily: "'Nunito',sans-serif", minHeight: "100vh", background: DARK, color: "#F0EAD6" }}>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=Nunito:wght@300;600;700;800&display=swap" rel="stylesheet"/>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px" }}>
          <SkeletonBlock height="500px" radius="16px"/>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingTop: "20px" }}>
            <SkeletonBlock height="14px" width="40%"/>
            <SkeletonBlock height="48px"/>
            <SkeletonBlock height="36px" width="30%"/>
            <SkeletonBlock height="80px"/>
            <SkeletonBlock height="52px" radius="12px"/>
          </div>
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div style={{ fontFamily: "'Nunito',sans-serif", minHeight: "100vh", background: DARK, color: "#F0EAD6", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "72px", color: MUTED, opacity: 0.3 }}>◇</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "36px", marginBottom: "12px" }}>Product not found</h1>
        <a href="/" style={{ color: GOLD, textDecoration: "none", fontWeight: 700 }}>← Back to store</a>
      </div>
    </div>
  );

  const bc = BADGE_C[product.badge] || [];

  return (
    <div style={{ fontFamily: "'Nunito',sans-serif", minHeight: "100vh", background: DARK, color: "#F0EAD6" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Nunito:wght@300;400;600;700;800;900&display=swap" rel="stylesheet"/>
      {/* model-viewer for AR */}
      <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"></script>
      
      {/* AR Animations & Mobile Responsive Styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        model-viewer {
          --poster-color: transparent;
        }
        model-viewer::part(default-ar-button) {
          display: none;
        }
        
        /* AR Launch Button */
        .ar-launch-btn {
          background: #C9A84C;
          color: #0A0804;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          position: absolute;
          bottom: 16px;
          right: 16px;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
          .product-grid-layout {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .main-image-container {
            height: 350px !important;
          }
          .thumbnail-strip {
            overflow-x: auto !important;
            flex-wrap: nowrap !important;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 8px;
          }
          .thumbnail-strip > div {
            flex-shrink: 0;
          }
          .ar-panel {
            padding: 16px !important;
          }
          .ar-panel model-viewer {
            height: 250px !important;
          }
          .nav-padding {
            padding: 0 1rem !important;
          }
          .content-padding {
            padding: 40px 1rem 60px !important;
          }
          .price-text {
            font-size: 32px !important;
          }
          .cta-buttons {
            flex-direction: column !important;
          }
          .cta-buttons a {
            justify-content: center;
          }
        }
        
        @media (max-width: 480px) {
          .main-image-container {
            height: 280px !important;
          }
          .ar-panel model-viewer {
            height: 200px !important;
          }
          .price-text {
            font-size: 28px !important;
          }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav-padding" style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}`, padding: "0 3rem", display: "flex", alignItems: "center", gap: "20px", height: "68px" }}>
        <a href="/" style={{ color: MUTED, textDecoration: "none", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>← Shop</a>
        <span style={{ color: BORDER }}>·</span>
        <span style={{ color: MUTED, fontSize: "13px" }}>{product.category}</span>
        <span style={{ color: BORDER }}>·</span>
        <span style={{ color: "#F0EAD6", fontSize: "13px", fontWeight: 600 }}>{product.name}</span>
      </nav>

      <div className="content-padding" style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 2rem 100px" }}>
        <div className="product-grid-layout" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start" }}>

          {/* IMAGE PANEL */}
          <div>
            <div className="main-image-container" style={{ borderRadius: "20px", overflow: "hidden", background: SURFACE, border: `1px solid ${BORDER}`, height: "480px", position: "relative" }}>
              <img src={images[activeImg]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
              {product.badge && <div style={{ position: "absolute", top: "16px", left: "16px", background: bc[0], border: `1px solid ${bc[2]}`, color: bc[1], fontSize: "10px", fontWeight: 800, padding: "4px 14px", borderRadius: "40px", letterSpacing: "1.2px" }}>{product.badge.toUpperCase()}</div>}
              {product.stock < 15 && <div style={{ position: "absolute", bottom: "16px", right: "16px", background: "#e24b4a22", border: "1px solid #e24b4a44", color: "#e24b4a", fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px" }}>Only {product.stock} left</div>}
            </div>
            {/* Thumbnail strip */}
            <div className="thumbnail-strip" style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
              {images.map((img, i) => (
                <div key={i} onClick={() => setActiveImg(i)} style={{ width: "80px", height: "80px", borderRadius: "10px", overflow: "hidden", cursor: "pointer", border: `2px solid ${i === activeImg ? GOLD : BORDER}`, opacity: i === activeImg ? 1 : 0.6, transition: "all 0.2s" }}>
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                </div>
              ))}
              {/* AR Button */}
              <div onClick={() => setShowAR(!showAR)} style={{ width: "80px", height: "80px", borderRadius: "10px", cursor: "pointer", border: `2px solid ${showAR ? GOLD : BORDER}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", background: showAR ? `${GOLD}12` : CARD, transition: "all 0.2s" }}>
                <span style={{ fontSize: "20px" }}>🪄</span>
                <span style={{ fontSize: "9px", color: showAR ? GOLD : MUTED, fontWeight: 700, letterSpacing: "0.5px" }}>AR VIEW</span>
              </div>
            </div>
            {/* AR Viewer Panel */}
            {showAR && (
              <div className="ar-panel" style={{ marginTop: "16px", background: CARD, border: `1px solid ${GOLD}33`, borderRadius: "16px", padding: "16px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: GOLD, fontWeight: 800, letterSpacing: "1.5px", marginBottom: "12px" }}>
                  ✦ AR PREVIEW MODE ✦
                </div>
                
                {/* 3D Viewer - Fixed for Mobile AR */}
                <div style={{ borderRadius: "12px", overflow: "hidden", background: SURFACE, position: "relative" }}>
                  <model-viewer
                    src={AR_MODEL_URL}
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    camera-controls
                    auto-rotate
                    shadow-intensity="1"
                    exposure="1"
                    style={{ width: "100%", height: "280px", background: SURFACE }}
                  >
                    <button 
                      slot="ar-button" 
                      className="ar-launch-btn"
                    >
                      📱 Launch AR
                    </button>
                  </model-viewer>
                </div>
                
                <p style={{ color: MUTED, fontSize: "12px", marginTop: "12px", lineHeight: 1.5 }}>
                  Tap the button above to launch AR. <br/>
                  <span style={{ fontSize: "11px" }}>Requires iOS 12+ or Android with ARCore</span>
                </p>
                
                <button 
                  onClick={() => setShowAR(false)}
                  style={{ 
                    marginTop: "12px",
                    padding: "8px 16px",
                    background: "transparent",
                    border: `1px solid ${BORDER}`,
                    borderRadius: "6px",
                    color: MUTED,
                    fontSize: "12px",
                    cursor: "pointer",
                    fontFamily: "'Nunito',sans-serif"
                  }}
                >
                  Close Preview
                </button>
              </div>
            )}
          </div>

          {/* INFO PANEL */}
          <div style={{ paddingTop: "8px" }}>
            <div style={{ fontSize: "10px", color: GOLD, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" }}>{product.category}</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 700, color: "#F0EAD6", lineHeight: 1.1, marginBottom: "16px", letterSpacing: "-0.5px" }}>{product.name}</h1>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <span style={{ color: GOLD, fontSize: "14px" }}>{"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}</span>
              <span style={{ color: MUTED, fontSize: "13px" }}>{product.rating} · {product.reviews.toLocaleString()} reviews</span>
            </div>

            <div className="price-text" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "42px", fontWeight: 700, color: GOLD, marginBottom: "24px" }}>₹{product.price.toLocaleString()}</div>

            <p style={{ color: "#c8bfa6", fontSize: "15px", lineHeight: 1.75, marginBottom: "28px", fontWeight: 300 }}>{product.longDesc}</p>

            {/* Tags */}
            <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginBottom: "28px" }}>
              {product.tags.map(t => <span key={t} style={{ padding: "4px 12px", background: `${GOLD}0F`, border: `1px solid ${GOLD}28`, borderRadius: "40px", color: GOLD, fontSize: "11px", fontWeight: 700, letterSpacing: "0.8px" }}>{t}</span>)}
            </div>

            {/* Quantity */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
              <span style={{ fontSize: "12px", color: MUTED, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>Quantity</span>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "6px 14px" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: "none", border: "none", color: "#F0EAD6", cursor: "pointer", fontSize: "18px", fontWeight: 700, lineHeight: 1 }}>−</button>
                <span style={{ fontWeight: 800, fontSize: "16px", minWidth: "20px", textAlign: "center" }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ background: "none", border: "none", color: "#F0EAD6", cursor: "pointer", fontSize: "18px", fontWeight: 700, lineHeight: 1 }}>+</button>
              </div>
            </div>

            {/* CTA */}
            <div className="cta-buttons" style={{ display: "flex", gap: "12px", marginBottom: "28px" }}>
              <button onClick={addToCart} id="add-to-cart-btn"
                style={{ flex: 1, background: cartAdded ? "#52b788" : GOLD, border: "none", borderRadius: "12px", padding: "16px", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "15px", cursor: "pointer", color: DARK, letterSpacing: "0.5px", transition: "background 0.3s" }}>
                {cartAdded ? "✓ Added!" : `Add to Cart — ₹${(product.price * qty).toLocaleString()}`}
              </button>
              <a href="/cart" style={{ background: "transparent", border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "16px 20px", textDecoration: "none", color: MUTED, display: "flex", alignItems: "center", fontSize: "13px", fontWeight: 600 }}>
                View Cart →
              </a>
            </div>

            {/* Perks */}
            {[["🎁", "Free gift wrapping", "Signature box + satin ribbon included"], ["🚚", "Free shipping", "On all orders over ₹3,000"], ["↩", "Easy returns", "30-day hassle-free return policy"]].map(([icon, title, sub]) => (
              <div key={title} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 0", borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ fontSize: "22px" }}>{icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "#F0EAD6" }}>{title}</div>
                  <div style={{ color: MUTED, fontSize: "12px" }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
