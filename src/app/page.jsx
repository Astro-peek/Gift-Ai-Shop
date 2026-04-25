"use client";
import { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const GOLD = "#C9A84C";
const GOLD2 = "#E8C97A";
const DARK = "#0A0804";
const SURFACE = "#13110C";
const CARD = "#1A1710";
const BORDER = "#2E2A1E";
const MUTED = "#6B6248";

const Logo = ({ size = 36 }) => (
  <svg width={size * 3.6} height={size} viewBox="0 0 148 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="9" width="22" height="22" rx="5" fill="#C9A84C" fillOpacity="0.12" stroke="#C9A84C" strokeWidth="1.1"/>
    <path d="M12 9 L12 5 Q12 3 10 3 Q8 3 8 5 Q8 7 10 9 Z" fill="#C9A84C"/>
    <path d="M12 9 L12 5 Q12 3 14 3 Q16 3 16 5 Q16 7 14 9 Z" fill="#C9A84C"/>
    <rect x="6" y="9" width="12" height="3" rx="1.5" fill="#C9A84C"/>
    <rect x="11" y="12" width="2" height="19" rx="1" fill="#C9A84C" fillOpacity="0.55"/>
    <line x1="6" y1="20.5" x2="18" y2="20.5" stroke="#C9A84C" strokeWidth="0.7" strokeOpacity="0.35"/>
    <text x="30" y="28" fontFamily="Georgia, 'Times New Roman', serif" fontSize="21" fontWeight="700" fill="#C9A84C" letterSpacing="1.5">GiftAI</text>
  </svg>
);

const PRODUCTS = [
  { id:1, name:"Hermès-Style Silk Scarf", price:3499, category:"Luxury Fashion", tags:["women","luxury","anniversary"], rating:4.9, reviews:312, image:"https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&q=85", badge:"Bestseller", desc:"Hand-rolled edges, 100% pure silk. Arrives in signature gift box with ribbon." },
  { id:2, name:"Japanese Cast Iron Tea Set", price:4299, category:"Home & Lifestyle", tags:["parents","home","birthday"], rating:4.8, reviews:178, image:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=85", badge:"Top Rated", desc:"Authentic tetsubin design with 4 cups. Keeps tea perfectly hot for 2+ hours." },
  { id:3, name:"Sony WH-1000XM5 Headphones", price:6999, category:"Premium Tech", tags:["teen","music","birthday","tech"], rating:4.9, reviews:891, image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=85", badge:"Premium", desc:"Industry-leading noise cancellation. 30hr battery. The gift they'll use every day." },
  { id:4, name:"Leather Bound Journal Set", price:1899, category:"Stationery", tags:["student","writing","any","creative"], rating:4.7, reviews:445, image:"https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?w=500&q=85", badge:null, desc:"Handstitched Italian leather cover + fountain pen. For the thinker in your life." },
  { id:5, name:"Luxury Aroma Diffuser Kit", price:2999, category:"Wellness", tags:["women","relaxation","birthday","wellness"], rating:4.8, reviews:267, image:"https://images.unsplash.com/photo-1608181831688-8a6f95a87a6a?w=500&q=85", badge:"New", desc:"Ultrasonic diffuser with 7-colour LED + 6 premium essential oils in velvet pouch." },
  { id:6, name:"Rare Orchid in Glazed Pot", price:2199, category:"Botanicals", tags:["anyone","home","housewarming"], rating:4.6, reviews:134, image:"https://images.unsplash.com/photo-1487530811015-780f3d99b6c0?w=500&q=85", badge:null, desc:"Live Phalaenopsis orchid in hand-glazed ceramic. Blooms for months." },
  { id:7, name:"Belgian Luxury Chocolate Box", price:2499, category:"Gourmet Food", tags:["anyone","sweet","valentine","celebration"], rating:4.9, reviews:623, image:"https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=500&q=85", badge:"Bestseller", desc:"32 hand-crafted pralines — truffles, ganaches & caramels. Gold ribbon packaged." },
  { id:8, name:"Swiss Automatic Watch", price:12999, category:"Fine Accessories", tags:["men","luxury","anniversary"], rating:4.9, reviews:156, image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=85", badge:"Ultra Premium", desc:"Swiss movement, sapphire crystal. Mahogany presentation box included." },
  { id:9, name:"Polaroid Photo Album Kit", price:1299, category:"Memories", tags:["family","memories","anniversary","sentimental"], rating:4.7, reviews:389, image:"https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&q=85", badge:null, desc:"Instant camera + 40 films + gold-edged scrapbook. For priceless memories." },
  { id:10, name:"Ayurvedic Wellness Hamper", price:3799, category:"Wellness", tags:["anyone","health","birthday"], rating:4.7, reviews:201, image:"https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500&q=85", badge:null, desc:"10-piece set: copper bottle, herbal teas, cold-pressed oils & more." },
  { id:11, name:"Marble & Alabaster Chess Set", price:5499, category:"Games & Leisure", tags:["men","family","any"], rating:4.8, reviews:112, image:"https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=500&q=85", badge:null, desc:"Marble board with hand-carved alabaster pieces. A timeless statement piece." },
  { id:12, name:"Professional Art Studio Set", price:4199, category:"Creative Arts", tags:["kids","creative","birthday","art"], rating:4.9, reviews:334, image:"https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=85", badge:"New", desc:"120 professional-grade tools: watercolors, oils, pastels & sketch pads." },
];

const CATEGORIES = ["All","Luxury Fashion","Home & Lifestyle","Premium Tech","Wellness","Gourmet Food","Fine Accessories","Memories","Botanicals","Stationery","Creative Arts","Games & Leisure"];

const BADGE_C = { "Bestseller":[GOLD+"22",GOLD,GOLD+"55"], "Top Rated":["#52b78822","#52b788","#52b78855"], "Premium":["#378add22","#7ab8f5","#378add55"], "Ultra Premium":["#d4537e22","#e87fa8","#d4537e55"], "New":["#9b91ff22","#b0a8ff","#7f77dd55"] };

function SkeletonCard() {
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "16px", overflow: "hidden" }}>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div style={{ height: "215px", background: `linear-gradient(90deg, ${SURFACE} 0%, #23201a 50%, ${SURFACE} 100%)`, backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }}/>
      <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ height: "10px", width: "40%", borderRadius: "5px", background: `linear-gradient(90deg, ${SURFACE} 0%, #23201a 50%, ${SURFACE} 100%)`, backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }}/>
        <div style={{ height: "20px", borderRadius: "5px", background: `linear-gradient(90deg, ${SURFACE} 0%, #23201a 50%, ${SURFACE} 100%)`, backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }}/>
        <div style={{ height: "40px", borderRadius: "5px", background: `linear-gradient(90deg, ${SURFACE} 0%, #23201a 50%, ${SURFACE} 100%)`, backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }}/>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ height: "28px", width: "80px", borderRadius: "5px", background: `linear-gradient(90deg, ${SURFACE} 0%, #23201a 50%, ${SURFACE} 100%)`, backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }}/>
          <div style={{ height: "36px", width: "100px", borderRadius: "6px", background: `linear-gradient(90deg, ${SURFACE} 0%, #23201a 50%, ${SURFACE} 100%)`, backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }}/>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const supabase = createClientComponentClient();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [msgs, setMsgs] = useState([{ role:"ai", text:"Welcome to GiftAI ✨ I'm your personal luxury gift concierge. Who are you shopping for today?" }]);
  const [isListening, setIsListening] = useState(false);
  const [imgErr, setImgErr] = useState({});
  const [productsLoading, setProductsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [viewedCategories, setViewedCategories] = useState([]);
  const [featuredGifts, setFeaturedGifts] = useState([]);
  const chatEndRef = useRef(null);

  // ── Load from localStorage on mount ──────────────────────────────
  useEffect(() => {
    // Simulate loading from DB (or Prisma in production)
    setTimeout(() => setProductsLoading(false), 900);

    const fetchSess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.full_name || session.user.email.split("@")[0],
          email: session.user.email
        });
      }
    };
    fetchSess();

    setMounted(true);
    const savedCart = localStorage.getItem("giftai_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
    const savedWish = localStorage.getItem("giftai_wishlist");
    if (savedWish) setWishlist(JSON.parse(savedWish));

    // Personalized feed: load viewed categories
    const viewed = JSON.parse(localStorage.getItem("giftai_viewed_cats") || "[]");
    setViewedCategories(viewed);
  }, []);


  // ── Compute personalized featured feed ───────────────────────────
  useEffect(() => {
    if (viewedCategories.length > 0) {
      const scored = PRODUCTS
        .map(p => ({ ...p, score: viewedCategories.filter(c => c === p.category).length }))
        .sort((a, b) => b.score - a.score || b.rating - a.rating)
        .slice(0, 4);
      setFeaturedGifts(scored);
    } else {
      // Fallback: top-rated products
      setFeaturedGifts(PRODUCTS.filter(p => p.badge).slice(0, 4));
    }
  }, [viewedCategories]);

  // ── Persist cart to localStorage ────────────────────────────────
  useEffect(() => {
    localStorage.setItem("giftai_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("giftai_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  if (!mounted) return <div style={{ minHeight: "100vh", background: DARK }} />;

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(""), 2800); };

  const addToCart = (p) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      return ex ? prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...p, qty: 1 }];
    });
    showToast(`${p.name} — added to cart`);
  };

  const toggleWish = (id) => setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  // Track viewed category for personalized feed
  const trackView = (p) => {
    const viewed = JSON.parse(localStorage.getItem("giftai_viewed_cats") || "[]");
    const updated = [...viewed, p.category].slice(-20);
    localStorage.setItem("giftai_viewed_cats", JSON.stringify(updated));
    setViewedCategories(updated);
  };

  const filtered = PRODUCTS.filter(p => {
    const mc = category === "All" || p.category === category;
    const q = search.toLowerCase();
    return mc && (!q || p.name.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)) || p.category.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
  });

  const handleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { showToast("Voice not supported"); return; }
    const r = new SR(); r.lang = "en-IN";
    r.onstart = () => setIsListening(true);
    r.onresult = (e) => { setSearch(e.results[0][0].transcript); setIsListening(false); };
    r.onerror = () => setIsListening(false);
    r.onend = () => setIsListening(false);
    r.start();
  };

  // Real LLM Chat via API route
  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const m = chatInput.trim();
    const newMsgs = [...msgs, { role: "user", text: m }];
    setMsgs(newMsgs);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: m, history: msgs }),
      });
      const data = await res.json();
      setMsgs(prev => [...prev, { role: "ai", text: data.reply }]);
    } catch {
      setMsgs(prev => [...prev, { role: "ai", text: "Hmm, I'm having a moment ✨ Try again or use the Gift Recommender Quiz!" }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("giftai_user");
    setUser(null);
    setUserMenuOpen(false);
    showToast("Signed out successfully");
  };

  const userProfileIcon = user ? (user.name ? user.name[0].toUpperCase() : "U") : "👤";

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", minHeight:"100vh", background:DARK, color:"#F0EAD6" }}>
      {/* SEO — Next.js Head can be used server-side; these are fallback inline meta for client components */}
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Nunito:wght@300;400;600;700;800;900&display=swap" rel="stylesheet"/>

      {/* NAV */}
      <nav style={{ background:SURFACE, borderBottom:`1px solid ${BORDER}`, padding:"0 1rem", display:"flex", alignItems:"center", justifyContent:"space-between", height:"68px", position:"sticky", top:0, zIndex:100 }}>
        <Logo size={28}/>
        
        {/* Desktop Navigation */}
        <div style={{ display:"flex", gap:"2px" }} className="desktop-nav">
          {[["Home","/"],["Recommend","/recommend"],["Orders","/orders"],["Admin","/admin"]].map(([n, href]) => (
            <a key={n} href={href} style={{ color:MUTED, textDecoration:"none", padding:"7px 16px", borderRadius:"6px", fontSize:"13px", fontWeight:600, letterSpacing:"0.5px" }}>{n}</a>
          ))}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ 
            display:"none", 
            background:"none", 
            border:"none", 
            color:GOLD, 
            cursor:"pointer",
            padding:"8px"
          }}
          className="mobile-menu-btn"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? (
              <><path d="M18 6L6 18M6 6l12 12"/></>
            ) : (
              <><path d="M3 12h18M3 6h18M3 18h18"/></>
            )}
          </svg>
        </button>
        
        <div style={{ display:"flex", alignItems:"center", gap:"20px" }}>
          <a href="/cart" style={{ textDecoration:"none", position:"relative" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            {cartCount > 0 && <span style={{ position:"absolute", top:"-7px", right:"-8px", background:GOLD, color:DARK, borderRadius:"50%", width:"17px", height:"17px", fontSize:"10px", fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center" }}>{cartCount}</span>}
          </a>
          {/* User avatar with dropdown */}
          <div style={{ position:"relative" }}>
            <div id="user-menu-btn" onClick={() => setUserMenuOpen(o => !o)}
              style={{ width:"32px", height:"32px", borderRadius:"50%", background:user ? `${GOLD}28` : `${GOLD}18`, border:`1px solid ${user ? GOLD+"55" : BORDER}`, display:"flex", alignItems:"center", justifyContent:"center", color:GOLD, fontWeight:800, fontSize:user?"12px":"16px", cursor:"pointer", transition:"all 0.2s" }}>
              {userProfileIcon}
            </div>
            {userMenuOpen && (
              <div style={{ position:"absolute", top:"44px", right:0, background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:"12px", padding:"8px", minWidth:"180px", zIndex:200, boxShadow:"0 16px 40px #000000cc" }}>
                {user ? (
                  <>
                    <div style={{ padding:"10px 14px", fontSize:"12px", color:MUTED, borderBottom:`1px solid ${BORDER}`, marginBottom:"6px" }}>
                      <div style={{ color:"#F0EAD6", fontWeight:700, marginBottom:"2px" }}>{user.name}</div>
                      <div>{user.email}</div>
                    </div>
                    <a href="/profile" style={{ display:"block", padding:"9px 14px", color:MUTED, textDecoration:"none", fontSize:"13px", borderRadius:"7px" }}>My Profile</a>
                    <a href="/orders" style={{ display:"block", padding:"9px 14px", color:MUTED, textDecoration:"none", fontSize:"13px", borderRadius:"7px" }}>My Orders</a>
                    <button onClick={handleLogout} style={{ width:"100%", textAlign:"left", padding:"9px 14px", color:"#e24b4a", background:"none", border:"none", fontSize:"13px", cursor:"pointer", fontFamily:"'Nunito',sans-serif", borderRadius:"7px" }}>Sign Out</button>
                  </>
                ) : (
                  <>
                    <a href="/login" style={{ display:"block", padding:"9px 14px", color:"#F0EAD6", textDecoration:"none", fontSize:"13px", fontWeight:600, borderRadius:"7px" }}>Sign In</a>
                    <a href="/register" style={{ display:"block", padding:"9px 14px", color:GOLD, textDecoration:"none", fontSize:"13px", fontWeight:700, borderRadius:"7px" }}>Create Account →</a>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{ 
          display:"none",
          position:"fixed", 
          top:"68px", 
          left:0, 
          right:0, 
          background:SURFACE, 
          borderBottom:`1px solid ${BORDER}`,
          zIndex:99,
          padding:"1rem"
        }} className="mobile-menu-dropdown">
          {[["Home","/"],["Recommend","/recommend"],["Orders","/orders"],["Admin","/admin"]].map(([n, href]) => (
            <a key={n} href={href} onClick={() => setMobileMenuOpen(false)} style={{ display:"block", color:MUTED, textDecoration:"none", padding:"12px 0", borderBottom:`1px solid ${BORDER}`, fontSize:"14px", fontWeight:600 }}>{n}</a>
          ))}
        </div>
      )}
      
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .mobile-menu-dropdown { display: block !important; }
          .hero-section { padding: 60px 1rem 40px !important; }
          .hero-stats { 
            gap: 24px !important; 
            flex-wrap: wrap;
            margin-top: 40px !important;
          }
          .hero-stats > div { flex: 1; min-width: 120px; }
          .featured-section, .search-section, .products-section { 
            padding-left: 1rem !important; 
            padding-right: 1rem !important; 
          }
          .category-filters { 
            overflow-x: auto !important;
            flex-wrap: nowrap !important;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 8px;
          }
          .category-filters button { white-space: nowrap; }
          .product-grid { grid-template-columns: 1fr !important; }
          .section-divider { margin-left: 1rem !important; margin-right: 1rem !important; }
          .chat-widget { 
            width: 100% !important; 
            height: 100% !important; 
            bottom: 0 !important; 
            right: 0 !important;
            border-radius: 0 !important;
          }
          .toast { 
            left: 1rem !important; 
            right: 1rem !important; 
            transform: none !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
          .mobile-menu-dropdown { display: none !important; }
        }
        @media (max-width: 480px) {
          .hero-stats { gap: 16px !important; }
          .hero-stats > div { min-width: 100px; }
        }
      `}</style>

      {/* HERO */}
      <section className="hero-section" style={{ textAlign:"center", padding:"100px 2rem 80px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"10%", left:"50%", transform:"translateX(-50%)", width:"700px", height:"350px", background:`radial-gradient(ellipse, ${GOLD}0F 0%, transparent 70%)`, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, backgroundImage:`repeating-linear-gradient(0deg, transparent, transparent 60px, ${GOLD}05 60px, ${GOLD}05 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, ${GOLD}05 60px, ${GOLD}05 61px)`, pointerEvents:"none" }}/>
        <div style={{ position:"relative" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:`${GOLD}0F`, border:`1px solid ${GOLD}28`, borderRadius:"40px", padding:"6px 20px", fontSize:"11px", color:GOLD, fontWeight:700, marginBottom:"28px", letterSpacing:"2.5px" }}>
            <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:GOLD, display:"inline-block" }}/>
            AI-POWERED LUXURY GIFTING
          </div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(50px,8vw,92px)", fontWeight:700, lineHeight:1.02, marginBottom:"24px", color:"#F0EAD6", letterSpacing:"-1px" }}>
            Gift with <span style={{ color:GOLD }}>intention.</span><br/>
            <em>Impress</em> with AI.
          </h1>
          <p style={{ fontSize:"18px", color:MUTED, maxWidth:"480px", margin:"0 auto 44px", lineHeight:1.7, fontWeight:300 }}>
            Tell our concierge AI who you're shopping for. Get handpicked luxury recommendations — instantly.
          </p>
          <div style={{ display:"flex", gap:"14px", justifyContent:"center", flexWrap:"wrap" }}>
            <a href="/recommend" style={{ background:GOLD, color:DARK, padding:"15px 38px", borderRadius:"8px", fontWeight:800, fontSize:"14px", textDecoration:"none", letterSpacing:"0.8px" }}>Try Gift Recommender →</a>
            <button onClick={() => setChatOpen(true)} style={{ background:"transparent", border:`1px solid ${BORDER}`, color:"#F0EAD6", padding:"15px 38px", borderRadius:"8px", fontWeight:600, fontSize:"14px", cursor:"pointer", fontFamily:"'Nunito',sans-serif", letterSpacing:"0.5px" }}>Ask the Concierge</button>
          </div>
          <div className="hero-stats" style={{ display:"flex", gap:"56px", justifyContent:"center", marginTop:"70px" }}>
            {[["30+","Curated gifts"],["4.8★","Avg. rating"],["AI","Recommendations"],["Free","Gift wrapping"]].map(([v, l]) => (
              <div key={l} style={{ textAlign:"center" }}>
                <div style={{ fontSize:"26px", fontWeight:700, color:GOLD, fontFamily:"'Cormorant Garamond',serif" }}>{v}</div>
                <div style={{ fontSize:"10px", color:MUTED, marginTop:"4px", letterSpacing:"1.5px", textTransform:"uppercase" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERSONALIZED FEATURED GIFTS (if viewed categories exist) */}
      {featuredGifts.length > 0 && featuredGifts.some(p => p.score > 0) && (
        <section className="featured-section" style={{ padding:"0 3rem 60px", maxWidth:"1320px", margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"28px" }}>
            <div style={{ height:"1px", flex:1, background:`linear-gradient(to right, ${BORDER}, transparent)` }}/>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"18px", color:GOLD, fontStyle:"italic", letterSpacing:"1px", whiteSpace:"nowrap" }}>Curated For You</span>
            <div style={{ height:"1px", flex:1, background:`linear-gradient(to left, ${BORDER}, transparent)` }}/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"18px" }}>
            {featuredGifts.map(p => {
              const bc = BADGE_C[p.badge] || [];
              return (
                <a key={p.id} href={`/products/${p.id}`} onClick={() => trackView(p)} style={{ textDecoration:"none", display:"block", background:CARD, border:`1px solid ${GOLD}33`, borderRadius:"14px", overflow:"hidden", transition:"transform 0.2s, border-color 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.borderColor=`${GOLD}66`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.borderColor=`${GOLD}33`; }}>
                  <div style={{ height:"160px", overflow:"hidden", background:SURFACE }}>
                    <img src={p.image} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  </div>
                  <div style={{ padding:"14px 16px" }}>
                    <div style={{ fontSize:"9px", color:GOLD, fontWeight:800, letterSpacing:"1.8px", textTransform:"uppercase", marginBottom:"4px" }}>{p.category}</div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"15px", color:"#F0EAD6", fontWeight:700 }}>{p.name}</div>
                    <div style={{ color:GOLD, fontWeight:700, fontSize:"15px", marginTop:"6px", fontFamily:"'Cormorant Garamond',serif" }}>₹{p.price.toLocaleString()}</div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* SEARCH + FILTERS */}
      <section className="search-section" style={{ padding:"0 3rem 32px", maxWidth:"1320px", margin:"0 auto" }}>
        <div style={{ display:"flex", gap:"10px", marginBottom:"16px" }}>
          <div style={{ flex:1, position:"relative" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2" style={{ position:"absolute", left:"15px", top:"50%", transform:"translateY(-50%)" }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search gifts, occasions, recipients..." style={{ width:"100%", padding:"12px 14px 12px 42px", background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:"8px", color:"#F0EAD6", fontSize:"14px", outline:"none", boxSizing:"border-box", fontFamily:"'Nunito',sans-serif" }}/>
          </div>
          <button onClick={handleVoice} style={{ padding:"12px 16px", background:isListening?GOLD:SURFACE, border:`1px solid ${isListening?GOLD:BORDER}`, borderRadius:"8px", color:isListening?DARK:MUTED, cursor:"pointer", display:"flex", alignItems:"center" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          </button>
        </div>
        <div className="category-filters" style={{ display:"flex", gap:"7px", flexWrap:"wrap" }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{ padding:"5px 14px", borderRadius:"40px", border:`1px solid ${category===c?GOLD:BORDER}`, background:category===c?`${GOLD}12`:"transparent", color:category===c?GOLD:MUTED, fontWeight:600, fontSize:"11px", cursor:"pointer", letterSpacing:"0.3px", fontFamily:"'Nunito',sans-serif" }}>{c}</button>
          ))}
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div className="section-divider" style={{ maxWidth:"1320px", margin:"0 3rem 40px", display:"flex", alignItems:"center", gap:"16px" }}>
        <div style={{ height:"1px", flex:1, background:`linear-gradient(to right, ${BORDER}, transparent)` }}/>
        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"18px", color:GOLD, fontStyle:"italic", letterSpacing:"1px", whiteSpace:"nowrap" }}>Curated Collection</span>
        <div style={{ height:"1px", flex:1, background:`linear-gradient(to left, ${BORDER}, transparent)` }}/>
      </div>

      {/* GRID — with skeleton loaders */}
      <section className="products-section" style={{ padding:"0 3rem 100px", maxWidth:"1320px", margin:"0 auto" }}>
        <div className="product-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"22px" }}>
          {productsLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i}/>)
            : filtered.map(p => {
                const bc = BADGE_C[p.badge] || [];
                return (
                  <div key={p.id} style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:"16px", overflow:"hidden", transition:"transform 0.25s,border-color 0.25s", cursor:"pointer" }}
                    onMouseEnter={e => { e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.borderColor=`${GOLD}44`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.borderColor=BORDER; }}>
                    {/* Image — click goes to product detail */}
                    <a href={`/products/${p.id}`} onClick={() => trackView(p)} style={{ textDecoration:"none", display:"block" }}>
                      <div style={{ height:"215px", position:"relative", overflow:"hidden", background:SURFACE }}>
                        {!imgErr[p.id] ? (
                          <img src={p.image} alt={p.name} onError={() => setImgErr(prev => ({ ...prev, [p.id]:true }))}
                            style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.4s" }}
                            onMouseEnter={e => e.target.style.transform="scale(1.07)"}
                            onMouseLeave={e => e.target.style.transform="scale(1)"}/>
                        ) : (
                          <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"56px" }}>🎁</div>
                        )}
                        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 45%,rgba(10,8,4,0.72) 100%)" }}/>
                        {p.badge && <div style={{ position:"absolute", top:"11px", left:"11px", background:bc[0], border:`1px solid ${bc[2]}`, color:bc[1], fontSize:"9px", fontWeight:800, padding:"3px 11px", borderRadius:"40px", letterSpacing:"1.2px" }}>{p.badge.toUpperCase()}</div>}
                      </div>
                    </a>
                    <div style={{ padding:"18px 20px" }}>
                      <button onClick={() => toggleWish(p.id)} style={{ float:"right", background:"none", border:"none", cursor:"pointer", color:wishlist.includes(p.id)?GOLD:MUTED, fontSize:"18px", padding:0, marginTop:"2px" }}>
                        {wishlist.includes(p.id) ? "♥" : "♡"}
                      </button>
                      <div style={{ fontSize:"9px", color:GOLD, fontWeight:800, marginBottom:"5px", letterSpacing:"1.8px", textTransform:"uppercase" }}>{p.category}</div>
                      <div style={{ fontSize:"16px", fontWeight:700, marginBottom:"6px", color:"#F0EAD6", fontFamily:"'Cormorant Garamond',serif", lineHeight:1.25 }}>{p.name}</div>
                      <p style={{ fontSize:"12px", color:MUTED, marginBottom:"12px", lineHeight:1.55 }}>{p.desc}</p>
                      <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"15px" }}>
                        <span style={{ color:GOLD, fontSize:"12px", letterSpacing:"1px" }}>{"★".repeat(Math.floor(p.rating))}{"☆".repeat(5-Math.floor(p.rating))}</span>
                        <span style={{ fontSize:"11px", color:MUTED }}>{p.rating} ({p.reviews.toLocaleString()})</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <span style={{ fontSize:"22px", fontWeight:700, color:GOLD, fontFamily:"'Cormorant Garamond',serif" }}>₹{p.price.toLocaleString()}</span>
                        <button onClick={() => addToCart(p)} style={{ background:GOLD, color:DARK, border:"none", borderRadius:"6px", padding:"9px 18px", fontWeight:800, fontSize:"12px", cursor:"pointer", letterSpacing:"0.5px", fontFamily:"'Nunito',sans-serif" }}>Add to Cart</button>
                      </div>
                    </div>
                  </div>
                );
              })
          }
        </div>
        {!productsLoading && filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"100px 0", color:MUTED }}>
            <div style={{ fontSize:"48px", opacity:0.2, marginBottom:"20px", fontFamily:"'Cormorant Garamond',serif" }}>◇</div>
            <div style={{ fontSize:"22px", fontFamily:"'Cormorant Garamond',serif", marginBottom:"8px" }}>No gifts found</div>
            <div style={{ fontSize:"13px" }}>Try adjusting your search or category filter</div>
          </div>
        )}
      </section>

      {/* CHAT */}
      {chatOpen && (
        <div style={{ position:"fixed", bottom:"28px", right:"28px", width:"360px", background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:"20px", boxShadow:"0 32px 80px #000000cc", zIndex:999, display:"flex", flexDirection:"column", maxHeight:"500px", overflow:"hidden" }}>
          <div style={{ padding:"16px 20px", borderBottom:`1px solid ${BORDER}`, display:"flex", justifyContent:"space-between", alignItems:"center", background:"#17140e" }}>
            <div>
              <Logo size={18}/>
              <div style={{ fontSize:"11px", color:MUTED, marginTop:"3px", letterSpacing:"0.5px" }}>Luxury Gift Concierge · Online</div>
            </div>
            <button onClick={() => setChatOpen(false)} style={{ background:"none", border:"none", color:MUTED, fontSize:"22px", cursor:"pointer", lineHeight:1 }}>×</button>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"16px", display:"flex", flexDirection:"column", gap:"12px" }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
                <div style={{ maxWidth:"84%", padding:"11px 14px", borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px", background:m.role==="user"?`${GOLD}1A`:CARD, border:`1px solid ${m.role==="user"?GOLD+"33":BORDER}`, color:m.role==="user"?GOLD2:"#F0EAD6", fontSize:"13px", lineHeight:1.6 }}>
                  {m.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div style={{ display:"flex", justifyContent:"flex-start" }}>
                <div style={{ padding:"11px 18px", borderRadius:"16px 16px 16px 4px", background:CARD, border:`1px solid ${BORDER}`, color:MUTED, fontSize:"13px" }}>
                  <span style={{ animation:"pulse 1s infinite" }}>✦</span> Thinking...
                  <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
                </div>
              </div>
            )}
            <div ref={chatEndRef}/>
          </div>
          <div style={{ padding:"12px 14px", borderTop:`1px solid ${BORDER}`, display:"flex", gap:"8px" }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()}
              placeholder="Who are you gifting for?"
              style={{ flex:1, background:CARD, border:`1px solid ${BORDER}`, borderRadius:"8px", padding:"10px 13px", color:"#F0EAD6", fontSize:"13px", outline:"none", fontFamily:"'Nunito',sans-serif" }}/>
            <button onClick={sendChat} disabled={chatLoading} style={{ background:GOLD, border:"none", borderRadius:"8px", padding:"10px 14px", fontWeight:800, cursor:"pointer", color:DARK, fontSize:"13px", fontFamily:"'Nunito',sans-serif", opacity:chatLoading?0.6:1 }}>→</button>
          </div>
        </div>
      )}
      {!chatOpen && (
        <button onClick={() => setChatOpen(true)} style={{ position:"fixed", bottom:"28px", right:"28px", background:GOLD, border:"none", borderRadius:"50%", width:"56px", height:"56px", cursor:"pointer", boxShadow:`0 8px 28px ${GOLD}40`, zIndex:999, color:DARK, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2.2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </button>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{ position:"fixed", bottom:"28px", left:"50%", transform:"translateX(-50%)", background:SURFACE, border:`1px solid ${GOLD}44`, color:GOLD2, padding:"12px 28px", borderRadius:"40px", fontWeight:600, fontSize:"13px", zIndex:9999, letterSpacing:"0.3px", whiteSpace:"nowrap" }}>
          ✦ {toast}
        </div>
      )}

      {/* Close user menu on outside click */}
      {userMenuOpen && <div onClick={() => setUserMenuOpen(false)} style={{ position:"fixed", inset:0, zIndex:99 }}/>}
    </div>
  );
}
