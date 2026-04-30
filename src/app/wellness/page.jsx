"use client";
import { useState, useEffect } from "react";
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
    <text x="30" y="28" fontFamily="Georgia, 'Times New Roman', serif" fontSize="21" fontWeight="700" fill="#C9A84C" letterSpacing="1.5">Giftara</text>
  </svg>
);

const BADGE_C = { 
  "Bestseller": [GOLD+"22", GOLD, GOLD+"55"], 
  "Top Rated": ["#52b78822", "#52b788", "#52b78855"], 
  "Premium": ["#378add22", "#7ab8f5", "#378add55"], 
  "Ultra Premium": ["#d4537e22", "#e87fa8", "#d4537e55"], 
  "New": ["#9b91ff22", "#b0a8ff", "#7f77dd55"] 
};

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

export default function WellnessPage() {
  const supabase = createClientComponentClient();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [budget, setBudget] = useState("");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState("");
  const [productsLoading, setProductsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imgErr, setImgErr] = useState({});

  // Fetch products and filter for Wellness
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          const wellnessProducts = data.filter(p => p.category === "Wellness");
          setProducts(wellnessProducts);
          setFilteredProducts(wellnessProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();

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
    const savedCart = localStorage.getItem("giftara_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
    const savedWish = localStorage.getItem("giftara_wishlist");
    if (savedWish) setWishlist(JSON.parse(savedWish));
  }, []);

  useEffect(() => {
    localStorage.setItem("giftara_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("giftara_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Filter by budget
  const handleBudgetSearch = () => {
    if (!budget || isNaN(budget)) {
      setFilteredProducts(products);
      return;
    }
    const maxBudget = parseFloat(budget);
    const filtered = products.filter(p => p.price <= maxBudget);
    setFilteredProducts(filtered);
  };

  const handleBudgetKeyDown = (e) => {
    if (e.key === "Enter") {
      handleBudgetSearch();
    }
  };

  const clearBudget = () => {
    setBudget("");
    setFilteredProducts(products);
  };

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("giftara_user");
    setUser(null);
    setUserMenuOpen(false);
    showToast("Signed out successfully");
  };

  const userProfileIcon = user ? (user.name ? user.name[0].toUpperCase() : "U") : "👤";

  return (
    <div style={{ fontFamily: "'Nunito',sans-serif", minHeight: "100vh", background: DARK, color: "#F0EAD6" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Nunito:wght@300;400;600;700;800;900&display=swap" rel="stylesheet"/>

      {/* NAV */}
      <nav style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}`, padding: "0 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px", position: "sticky", top: 0, zIndex: 100 }}>
        <Logo size={28}/>
        
        <div style={{ display: "flex", gap: "2px" }} className="desktop-nav">
          {[["Home","/"],["Wellness","/wellness"],["Recommend","/recommend"],["Orders","/orders"],["Admin","/admin"]].map(([n, href]) => (
            <a key={n} href={href} style={{ color: n === "Wellness" ? GOLD : MUTED, textDecoration: "none", padding: "7px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, letterSpacing: "0.5px" }}>{n}</a>
          ))}
        </div>
        
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: "none", background: "none", border: "none", color: GOLD, cursor: "pointer", padding: "8px" }}
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
        
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <a href="/cart" style={{ textDecoration: "none", position: "relative" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            {cartCount > 0 && <span style={{ position: "absolute", top: "-7px", right: "-8px", background: GOLD, color: DARK, borderRadius: "50%", width: "17px", height: "17px", fontSize: "10px", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
          </a>
          <div style={{ position: "relative" }}>
            <div id="user-menu-btn" onClick={() => setUserMenuOpen(o => !o)}
              style={{ width: "32px", height: "32px", borderRadius: "50%", background: user ? `${GOLD}28` : `${GOLD}18`, border: `1px solid ${user ? GOLD+"55" : BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", color: GOLD, fontWeight: 800, fontSize: user ? "12px" : "16px", cursor: "pointer", transition: "all 0.2s" }}>
              {userProfileIcon}
            </div>
            {userMenuOpen && (
              <div style={{ position: "absolute", top: "44px", right: 0, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "8px", minWidth: "180px", zIndex: 200, boxShadow: "0 16px 40px #000000cc" }}>
                {user ? (
                  <>
                    <div style={{ padding: "10px 14px", fontSize: "12px", color: MUTED, borderBottom: `1px solid ${BORDER}`, marginBottom: "6px" }}>
                      <div style={{ color: "#F0EAD6", fontWeight: 700, marginBottom: "2px" }}>{user.name}</div>
                      <div>{user.email}</div>
                    </div>
                    <a href="/profile" style={{ display: "block", padding: "9px 14px", color: MUTED, textDecoration: "none", fontSize: "13px", borderRadius: "7px" }}>My Profile</a>
                    <a href="/orders" style={{ display: "block", padding: "9px 14px", color: MUTED, textDecoration: "none", fontSize: "13px", borderRadius: "7px" }}>My Orders</a>
                    <button onClick={handleLogout} style={{ width: "100%", textAlign: "left", padding: "9px 14px", color: "#e24b4a", background: "none", border: "none", fontSize: "13px", cursor: "pointer", fontFamily: "'Nunito',sans-serif", borderRadius: "7px" }}>Sign Out</button>
                  </>
                ) : (
                  <>
                    <a href="/login" style={{ display: "block", padding: "9px 14px", color: "#F0EAD6", textDecoration: "none", fontSize: "13px", fontWeight: 600, borderRadius: "7px" }}>Sign In</a>
                    <a href="/register" style={{ display: "block", padding: "9px 14px", color: GOLD, textDecoration: "none", fontSize: "13px", fontWeight: 700, borderRadius: "7px" }}>Create Account →</a>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {mobileMenuOpen && (
        <div style={{ display: "none", position: "fixed", top: "68px", left: 0, right: 0, background: SURFACE, borderBottom: `1px solid ${BORDER}`, zIndex: 99, padding: "1rem" }} className="mobile-menu-dropdown">
          {[["Home","/"],["Wellness","/wellness"],["Recommend","/recommend"],["Orders","/orders"],["Admin","/admin"]].map(([n, href]) => (
            <a key={n} href={href} onClick={() => setMobileMenuOpen(false)} style={{ display: "block", color: n === "Wellness" ? GOLD : MUTED, textDecoration: "none", padding: "12px 0", borderBottom: `1px solid ${BORDER}`, fontSize: "14px", fontWeight: 600 }}>{n}</a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .mobile-menu-dropdown { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
          .mobile-menu-dropdown { display: none !important; }
        }
      `}</style>

      {/* HERO SECTION */}
      <section style={{ textAlign: "center", padding: "60px 2rem 40px", position: "relative" }}>
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: `${GOLD}0F`, border: `1px solid ${GOLD}28`, borderRadius: "40px", padding: "6px 20px", fontSize: "11px", color: GOLD, fontWeight: 700, marginBottom: "20px", letterSpacing: "2.5px" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: GOLD, display: "inline-block" }}/>
            WELLNESS COLLECTION
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(40px,6vw,72px)", fontWeight: 700, lineHeight: 1.1, marginBottom: "16px", color: "#F0EAD6", letterSpacing: "-1px" }}>
            Wellness & <span style={{ color: GOLD }}>Self-Care</span>
          </h1>
          <p style={{ fontSize: "16px", color: MUTED, maxWidth: "520px", margin: "0 auto 32px", lineHeight: 1.7, fontWeight: 300 }}>
            Discover premium wellness products for mindful living. Find gifts that nurture the body, calm the mind, and uplift the spirit.
          </p>
        </div>
      </section>

      {/* BUDGET FILTER BAR */}
      <section style={{ padding: "0 2rem 40px", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "20px 24px", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: "1 1 300px" }}>
            <span style={{ color: GOLD, fontSize: "14px", fontWeight: 600, whiteSpace: "nowrap" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" style={{ marginRight: "6px", verticalAlign: "middle" }}>
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              Budget Filter:
            </span>
            <div style={{ position: "relative", flex: 1 }}>
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: MUTED, fontSize: "14px" }}>₹</span>
              <input 
                type="number" 
                value={budget} 
                onChange={e => setBudget(e.target.value)} 
                onKeyDown={handleBudgetKeyDown}
                placeholder="Enter max budget" 
                style={{ 
                  width: "100%", 
                  padding: "10px 12px 10px 28px", 
                  background: CARD, 
                  border: `1px solid ${BORDER}`, 
                  borderRadius: "8px", 
                  color: "#F0EAD6", 
                  fontSize: "14px", 
                  outline: "none",
                  fontFamily: "'Nunito',sans-serif"
                }}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button 
              onClick={handleBudgetSearch}
              style={{ 
                background: GOLD, 
                color: DARK, 
                border: "none", 
                borderRadius: "8px", 
                padding: "10px 24px", 
                fontWeight: 700, 
                fontSize: "13px", 
                cursor: "pointer",
                fontFamily: "'Nunito',sans-serif"
              }}
            >
              Search
            </button>
            {budget && (
              <button 
                onClick={clearBudget}
                style={{ 
                  background: "transparent", 
                  color: MUTED, 
                  border: `1px solid ${BORDER}`, 
                  borderRadius: "8px", 
                  padding: "10px 16px", 
                  fontWeight: 600, 
                  fontSize: "13px", 
                  cursor: "pointer",
                  fontFamily: "'Nunito',sans-serif"
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
        
        {/* Results count */}
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <span style={{ color: MUTED, fontSize: "13px" }}>
            Showing {filteredProducts.length} wellness product{filteredProducts.length !== 1 ? 's' : ''}
            {budget && !isNaN(budget) && ` under ₹${parseInt(budget).toLocaleString()}`}
          </span>
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section style={{ padding: "0 2rem 80px", maxWidth: "1320px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
          {productsLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i}/>)
            : filteredProducts.length === 0 ? (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 0", color: MUTED }}>
                <div style={{ fontSize: "48px", opacity: 0.2, marginBottom: "20px" }}>🌿</div>
                <div style={{ fontSize: "20px", fontFamily: "'Cormorant Garamond',serif", marginBottom: "8px" }}>No wellness products found</div>
                <div style={{ fontSize: "14px" }}>
                  {budget ? `Try adjusting your budget of ₹${parseInt(budget).toLocaleString()}` : "Check back soon for new arrivals"}
                </div>
              </div>
            ) : filteredProducts.map(p => {
                const bc = BADGE_C[p.badge] || [];
                return (
                  <div key={p.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "16px", overflow: "hidden", transition: "transform 0.25s, border-color 0.25s", cursor: "pointer" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = `${GOLD}44`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = BORDER; }}>
                    <a href={`/products/${p.id}`} style={{ textDecoration: "none", display: "block" }}>
                      <div style={{ height: "220px", position: "relative", overflow: "hidden", background: SURFACE }}>
                        {!imgErr[p.id] ? (
                          <img src={p.image} alt={p.name} onError={() => setImgErr(prev => ({ ...prev, [p.id]: true }))}
                            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                            onMouseEnter={e => e.target.style.transform = "scale(1.07)"}
                            onMouseLeave={e => e.target.style.transform = "scale(1)"}/>
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "56px" }}>🌿</div>
                        )}
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 45%, rgba(10,8,4,0.72) 100%)" }}/>
                        {p.badge && <div style={{ position: "absolute", top: "11px", left: "11px", background: bc[0], border: `1px solid ${bc[2]}`, color: bc[1], fontSize: "9px", fontWeight: 800, padding: "3px 11px", borderRadius: "40px", letterSpacing: "1.2px" }}>{p.badge.toUpperCase()}</div>}
                      </div>
                    </a>
                    <div style={{ padding: "18px 20px" }}>
                      <button onClick={() => toggleWish(p.id)} style={{ float: "right", background: "none", border: "none", cursor: "pointer", color: wishlist.includes(p.id) ? GOLD : MUTED, fontSize: "18px", padding: 0, marginTop: "2px" }}>
                        {wishlist.includes(p.id) ? "♥" : "♡"}
                      </button>
                      <div style={{ fontSize: "9px", color: GOLD, fontWeight: 800, marginBottom: "5px", letterSpacing: "1.8px", textTransform: "uppercase" }}>{p.category}</div>
                      <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "6px", color: "#F0EAD6", fontFamily: "'Cormorant Garamond',serif", lineHeight: 1.25 }}>{p.name}</div>
                      <p style={{ fontSize: "12px", color: MUTED, marginBottom: "12px", lineHeight: 1.55 }}>{p.desc}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "15px" }}>
                        <span style={{ color: GOLD, fontSize: "12px", letterSpacing: "1px" }}>{"★".repeat(Math.floor(p.rating))}{"☆".repeat(5 - Math.floor(p.rating))}</span>
                        <span style={{ fontSize: "11px", color: MUTED }}>{p.rating} ({p.reviews.toLocaleString()})</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "22px", fontWeight: 700, color: GOLD, fontFamily: "'Cormorant Garamond',serif" }}>₹{p.price.toLocaleString()}</span>
                        <button onClick={() => addToCart(p)} style={{ background: GOLD, color: DARK, border: "none", borderRadius: "6px", padding: "9px 18px", fontWeight: 800, fontSize: "12px", cursor: "pointer", letterSpacing: "0.5px", fontFamily: "'Nunito',sans-serif" }}>Add to Cart</button>
                      </div>
                    </div>
                  </div>
                );
              })
          }
        </div>
      </section>

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", bottom: "28px", left: "50%", transform: "translateX(-50%)", background: SURFACE, border: `1px solid ${GOLD}44`, color: GOLD2, padding: "12px 28px", borderRadius: "40px", fontWeight: 600, fontSize: "13px", zIndex: 9999, letterSpacing: "0.3px", whiteSpace: "nowrap" }}>
          ✦ {toast}
        </div>
      )}

      {/* Close user menu on outside click */}
      {userMenuOpen && <div onClick={() => setUserMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 99 }}/>}
    </div>
  );
}
