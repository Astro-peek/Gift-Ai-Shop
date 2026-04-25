"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const GOLD = "#C9A84C", DARK = "#0A0804", SURFACE = "#13110C", CARD = "#1A1710", BORDER = "#2E2A1E", MUTED = "#6B6248";

const Logo = () => (
  <svg width="120" height="28" viewBox="0 0 148 40" fill="none">
    <rect x="1" y="9" width="22" height="22" rx="5" fill="#C9A84C" fillOpacity="0.12" stroke="#C9A84C" strokeWidth="1.1"/>
    <path d="M12 9 L12 5 Q12 3 10 3 Q8 3 8 5 Q8 7 10 9 Z" fill="#C9A84C"/>
    <path d="M12 9 L12 5 Q12 3 14 3 Q16 3 16 5 Q16 7 14 9 Z" fill="#C9A84C"/>
    <rect x="6" y="9" width="12" height="3" rx="1.5" fill="#C9A84C"/>
    <rect x="11" y="12" width="2" height="19" rx="1" fill="#C9A84C" fillOpacity="0.55"/>
    <text x="30" y="28" fontFamily="Georgia,serif" fontSize="21" fontWeight="700" fill="#C9A84C" letterSpacing="1.5">GiftAI</text>
  </svg>
);

export default function CartPage() {
  const supabase = createClientComponentClient();
  const [cart, setCart] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState("cart");
  const [addr, setAddr] = useState({ name: "", phone: "", pincode: "", street: "", city: "", state: "" });
  const [imgErr, setImgErr] = useState({});
  const [paying, setPaying] = useState(false);
  const [method, setMethod] = useState("RAZORPAY"); // RAZORPAY | COD
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    fetchUser();

    setMounted(true);
    const saved = localStorage.getItem("giftai_cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  if (!mounted) return <div style={{ minHeight: "100vh", background: DARK }} />;

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("giftai_cart", JSON.stringify(newCart));
  };

  const upd = (id, d) => saveCart(cart.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i));
  const rm = (id) => saveCart(cart.filter(i => i.id !== id));
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const ship = sub > 3000 ? 0 : 99;
  const total = sub + ship;

  const handleProceed = () => {
    if (!user) {
      window.location.href = `/login?redirect=${encodeURIComponent("/cart")}`;
      return;
    }
    setStep("address");
  };

  const handleCOD = async () => {
    setPaying(true);
    try {
      const orderDetails = {
        userId: user.id,
        userEmail: user.email,
        userName: user.user_metadata?.full_name || user.email.split("@")[0],
        total,
        address: `${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode} (PH: ${addr.phone})`,
        paymentMethod: "COD",
        items: cart
      };

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderDetails })
      });

      if (res.ok) {
        setCart([]); // Clear cart
        setStep("success");
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("COD order failed:", errorData);
        alert("Failed to confirm order: " + (errorData.error || errorData.details || "Please try again."));
      }
    } catch (err) {
      console.error("COD error:", err);
      alert("Error: " + err.message);
    } finally {
      setPaying(false);
    }
  };

  const handleRazorpayPayment = async () => {
    setPaying(true);
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        console.error("Create order failed:", data);
        alert("Payment initialization failed: " + (data.error || data.details || "Unknown error"));
        setPaying(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "GiftAI Luxury",
        description: "Order Payment",
        order_id: data.orderId,
        handler: async (response) => {
          const orderDetails = {
            userId: user.id,
            userEmail: user.email,
            userName: user.user_metadata?.full_name || user.email.split("@")[0],
            total,
            address: `${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode} (PH: ${addr.phone})`,
            items: cart
          };

          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, orderDetails }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.verified) {
            setCart([]);
            setStep("success");
          } else {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: addr.name,
          contact: addr.phone,
        },
        theme: { color: "#C9A84C" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        alert("Payment failed. Please try again.");
      });
      rzp.open();
    } catch (e) {
      console.error("Payment error:", e);
      alert("Payment error: " + e.message);
    } finally {
      setPaying(false);
    }
  };

  if (step === "success") return (
    <div style={{ fontFamily: "'Nunito',sans-serif", minHeight: "100vh", background: DARK, color: "#F0EAD6", display: "flex", flexDirection: "column", alignItems: "center", justifyCenter: "center", textAlign: "center", padding: "2rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,400&family=Nunito:wght@300;600;700;800&display=swap" rel="stylesheet"/>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "72px", color: GOLD, marginBottom: "24px" }}>✦</div>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "48px", color: "#F0EAD6", marginBottom: "12px" }}>Order Confirmed</h1>
      <p style={{ color: MUTED, fontSize: "16px", marginBottom: "8px", fontWeight: 300 }}>Order #ORD-{Math.floor(Math.random() * 9000 + 1000)}</p>
      <p style={{ color: MUTED, fontSize: "14px", maxWidth: "400px", lineHeight: 1.7, marginBottom: "40px", fontWeight: 300 }}>Your gifts are being prepared with care. A tracking notification will arrive via SMS and email.</p>
      <div style={{ display: "flex", gap: "12px" }}>
        <a href="/orders" style={{ background: GOLD, color: DARK, padding: "14px 30px", borderRadius: "8px", fontWeight: 800, textDecoration: "none", fontSize: "14px", letterSpacing: "0.5px" }}>Track Order →</a>
        <a href="/" style={{ background: "transparent", border: `1px solid ${BORDER}`, color: MUTED, padding: "14px 30px", borderRadius: "8px", fontWeight: 600, textDecoration: "none", fontSize: "14px" }}>Continue Shopping</a>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Nunito',sans-serif", minHeight: "100vh", background: DARK, color: "#F0EAD6" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,400&family=Nunito:wght@300;600;700;800&display=swap" rel="stylesheet"/>

      {/* Nav */}
      <nav style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}`, padding: "0 3rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
        <a href="/" style={{ textDecoration: "none" }}><Logo/></a>
        <div style={{ display: "flex", gap: "28px" }}>
          {["Cart", "Address", "Payment"].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: ["cart", "address", "payment"][i] === step ? GOLD : BORDER, color: DARK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 900 }}>{i + 1}</div>
              <span style={{ fontSize: "13px", color: ["cart", "address", "payment"][i] === step ? GOLD : MUTED, fontWeight: 600 }}>{s}</span>
            </div>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "48px 2rem" }}>

        {/* ── CART STEP ── */}
        {step === "cart" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "28px" }}>
            <div>
              <div style={{ marginBottom: "16px" }}>
                <a href="/" style={{ color: MUTED, textDecoration: "none", fontSize: "14px", fontWeight: 700 }}>← Back to Shop</a>
              </div>
              <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "40px", marginBottom: "28px", color: "#F0EAD6" }}>Your Cart</h1>

              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0", color: MUTED }}>
                  <div style={{ fontSize: "40px", color: GOLD, marginBottom: "16px", fontFamily: "'Cormorant Garamond',serif" }}>◇</div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "24px", marginBottom: "12px" }}>Your cart is empty</div>
                  <a href="/" style={{ color: GOLD, textDecoration: "none", fontWeight: 700, fontSize: "14px" }}>Browse Gifts →</a>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", overflow: "hidden", display: "flex", alignItems: "stretch" }}>
                      <div style={{ width: "110px", minWidth: "110px", height: "110px", overflow: "hidden" }}>
                        {!imgErr[item.id] ? (
                          <img src={item.image} alt={item.name} onError={() => setImgErr(p => ({ ...p, [item.id]: true }))} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                        ) : (
                          <div style={{ width: "100%", height: "100%", background: SURFACE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px" }}>🎁</div>
                        )}
                      </div>
                      <div style={{ flex: 1, padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "10px", color: GOLD, fontWeight: 800, letterSpacing: "1.5px", marginBottom: "3px", textTransform: "uppercase" }}>{item.category}</div>
                          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "17px", color: "#F0EAD6", marginBottom: "2px" }}>{item.name}</div>
                          <div style={{ color: GOLD, fontWeight: 700, fontSize: "16px" }}>₹{item.price.toLocaleString()}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <button onClick={() => upd(item.id, -1)} style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: "#F0EAD6", width: "28px", height: "28px", borderRadius: "6px", cursor: "pointer", fontSize: "16px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                          <span style={{ fontWeight: 800, fontSize: "15px", minWidth: "16px", textAlign: "center" }}>{item.qty}</span>
                          <button onClick={() => upd(item.id, 1)} style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: "#F0EAD6", width: "28px", height: "28px", borderRadius: "6px", cursor: "pointer", fontSize: "16px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 800, fontSize: "16px", color: "#F0EAD6", marginBottom: "8px" }}>₹{(item.price * item.qty).toLocaleString()}</div>
                          <button onClick={() => rm(item.id)} style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", fontSize: "12px", fontFamily: "'Nunito',sans-serif" }}>Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "24px", height: "fit-content", position: "sticky", top: "80px" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "22px", color: "#F0EAD6", marginBottom: "20px" }}>Order Summary</h2>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", color: MUTED, fontSize: "14px" }}><span>Subtotal</span><span>₹{sub.toLocaleString()}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", color: MUTED, fontSize: "14px" }}><span>Gift Wrap</span><span style={{ color: "#52b788" }}>FREE</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", color: MUTED, fontSize: "14px" }}><span>Shipping</span><span style={{ color: ship === 0 ? "#52b788" : "#F0EAD6" }}>{ship === 0 ? "FREE" : `₹${ship}`}</span></div>
              {ship === 0 && <div style={{ background: "#52b78812", border: "1px solid #52b78830", borderRadius: "8px", padding: "8px 12px", fontSize: "11px", color: "#52b788", marginBottom: "16px", letterSpacing: "0.3px" }}>✓ Free shipping on orders above ₹3,000</div>}
              <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: "16px", display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <span style={{ fontWeight: 700, fontSize: "16px", color: "#F0EAD6" }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: "24px", color: GOLD, fontFamily: "'Cormorant Garamond',serif" }}>₹{total.toLocaleString()}</span>
              </div>
              <button onClick={handleProceed}
                style={{ width:"100%", background:cart.length>0?GOLD:BORDER, border:"none", borderRadius:"8px", padding:"14px", fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"15px", cursor:cart.length>0?"pointer":"default", color:DARK, letterSpacing:"0.5px" }}>
                Proceed to Checkout →
              </button>
            </div>
          </div>
        )}

        {/* ── ADDRESS STEP ── */}
        {step === "address" && (
          <div style={{ maxWidth: "520px", margin: "0 auto" }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "40px", marginBottom: "28px", color: "#F0EAD6" }}>Delivery Address</h1>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[["name", "Full Name"], ["phone", "Phone Number"], ["pincode", "PIN Code"], ["street", "Street Address"], ["city", "City"], ["state", "State"]].map(([f, l]) => (
                <div key={f}>
                  <label style={{ display: "block", fontSize: "11px", color: MUTED, fontWeight: 700, letterSpacing: "1px", marginBottom: "6px", textTransform: "uppercase" }}>{l}</label>
                  <input
                    value={addr[f]}
                    onChange={e => setAddr(p => ({ ...p, [f]: e.target.value }))}
                    style={{ width: "100%", background: CARD, border: `1px solid ${BORDER}`, borderRadius: "8px", padding: "12px 14px", color: "#F0EAD6", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "'Nunito',sans-serif" }}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button onClick={() => setStep("cart")} style={{ flex: 1, background: "transparent", border: `1px solid ${BORDER}`, borderRadius: "8px", padding: "13px", color: MUTED, fontFamily: "'Nunito',sans-serif", fontWeight: 600, cursor: "pointer" }}>← Back</button>
              <button onClick={() => setStep("payment")} style={{ flex: 2, background: GOLD, border: "none", borderRadius: "8px", padding: "13px", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "15px", cursor: "pointer", color: DARK, letterSpacing: "0.5px" }}>Continue to Payment →</button>
            </div>
          </div>
        )}

        {/* ── PAYMENT STEP ── */}
        {step === "payment" && (
          <div style={{ maxWidth: "520px", margin: "0 auto" }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "40px", marginBottom: "28px", color: "#F0EAD6" }}>Payment Method</h1>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
              <div onClick={() => setMethod("RAZORPAY")}
                style={{ padding: "20px", borderRadius: "14px", border: `1px solid ${method==="RAZORPAY"?GOLD:BORDER}`, background: CARD, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: method==="RAZORPAY"?GOLD:"#F0EAD6" }}>Razorpay (Cards, UPI, Netbanking)</div>
                  <div style={{ fontSize: "12px", color: MUTED, marginTop: "4px" }}>Fast, secure & reliable (Select UPI in next step)</div>
                </div>
                {method==="RAZORPAY" && <div style={{ color: GOLD }}>✓</div>}
              </div>
              <div onClick={() => setMethod("COD")}
                style={{ padding: "20px", borderRadius: "14px", border: `1px solid ${method==="COD"?GOLD:BORDER}`, background: CARD, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: method==="COD"?GOLD:"#F0EAD6" }}>Cash on Delivery</div>
                  <div style={{ fontSize: "12px", color: MUTED, marginTop: "4px" }}>Pay when your luxury gift arrives</div>
                </div>
                {method==="COD" && <div style={{ color: GOLD }}>✓</div>}
              </div>
            </div>

            {method === "RAZORPAY" && (
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "24px", marginBottom: "20px" }}>
                <div style={{ fontSize: "10px", color: GOLD, fontWeight: 800, letterSpacing: "1.5px", marginBottom: "16px" }}>RAZORPAY SECURE</div>
                <div style={{ display: "flex", gap: "28px", color: "#F0EAD6", fontSize: "14px" }}>
                   Supports Cards, UPI, NetBanking
                </div>
              </div>
            )}

            {/* Order total summary */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "20px", marginBottom: "24px" }}>
              {[["Items", `₹${sub.toLocaleString()}`], ["Gift Wrap", "FREE"], ["Shipping", ship === 0 ? "FREE" : `₹${ship}`]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: MUTED, fontSize: "14px" }}>
                  <span>{l}</span>
                  <span style={{ color: v === "FREE" ? "#52b788" : "inherit" }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${BORDER}`, paddingTop: "12px", fontWeight: 700 }}>
                <span style={{ color: "#F0EAD6" }}>Total</span>
                <span style={{ color: GOLD, fontFamily: "'Cormorant Garamond',serif", fontSize: "22px" }}>₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setStep("address")}
                style={{ flex: 1, background: "transparent", border: `1px solid ${BORDER}`, borderRadius: "8px", padding: "13px", color: MUTED, fontFamily: "'Nunito',sans-serif", fontWeight: 600, cursor: "pointer" }}>
                ← Back
              </button>

              <button
                onClick={method === "RAZORPAY" ? handleRazorpayPayment : handleCOD}
                disabled={paying}
                style={{
                  flex: 2,
                  background: paying ? "#2E2A1E" : "#C9A84C",
                  border: "none",
                  borderRadius: "8px",
                  padding: "13px",
                  fontFamily: "'Nunito',sans-serif",
                  fontWeight: 800,
                  fontSize: "15px",
                  cursor: paying ? "not-allowed" : "pointer",
                  color: "#0A0804",
                  letterSpacing: "0.5px",
                }}>
                {paying ? "Processing…" : (method === "RAZORPAY" ? `Pay ₹${total.toLocaleString()} →` : "Confirm Order →")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
