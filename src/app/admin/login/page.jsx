"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const GOLD = "#C9A84C", DARK = "#0A0804", SURFACE = "#13110C", CARD = "#1A1710", BORDER = "#2E2A1E", MUTED = "#6B6248";

const Logo = () => (
  <svg width="130" height="32" viewBox="0 0 148 40" fill="none">
    <rect x="1" y="9" width="22" height="22" rx="5" fill="#C9A84C" fillOpacity="0.12" stroke="#C9A84C" strokeWidth="1.1"/>
    <path d="M12 9 L12 5 Q12 3 10 3 Q8 3 8 5 Q8 7 10 9 Z" fill="#C9A84C"/>
    <path d="M12 9 L12 5 Q12 3 14 3 Q16 3 16 5 Q16 7 14 9 Z" fill="#C9A84C"/>
    <rect x="6" y="9" width="12" height="3" rx="1.5" fill="#C9A84C"/>
    <rect x="11" y="12" width="2" height="19" rx="1" fill="#C9A84C" fillOpacity="0.55"/>
    <text x="30" y="28" fontFamily="Georgia,serif" fontSize="21" fontWeight="700" fill="#C9A84C" letterSpacing="1.5">GiftAI</text>
  </svg>
);

export default function AdminLoginPage() {
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      try {
        await fetch("/api/auth/sync", { method: "POST" });
        const accessRes = await fetch("/api/admin/check");
        const accessData = await accessRes.json();

        if (!accessRes.ok) {
          await supabase.auth.signOut();
          setError(accessData?.error || "This account does not have admin access.");
          setLoading(false);
          return;
        }

        window.location.href = "/admin";
      } catch (err) {
        await supabase.auth.signOut();
        setError("Unable to verify admin access. Please try again.");
        setLoading(false);
      }
    }
  };

  const inputStyle = {
    width: "100%", padding: "13px 16px", background: SURFACE,
    border: `1px solid ${BORDER}`, borderRadius: "10px", color: "#F0EAD6",
    fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "'Nunito',sans-serif",
  };

  return (
    <div style={{ fontFamily: "'Nunito',sans-serif", minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=Nunito:wght@300;400;600;700;800&display=swap" rel="stylesheet"/>
      
      <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "300px", background: `radial-gradient(ellipse, ${GOLD}0F 0%, transparent 70%)`, pointerEvents: "none" }}/>
      
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <Logo/>
          <div style={{ marginTop: "12px", display:"inline-block", background:`${GOLD}15`, border:`1px solid ${GOLD}30`, color:GOLD, fontSize:"10px", fontWeight:800, padding:"3px 12px", borderRadius:"40px", letterSpacing:"1.5px" }}>ADMIN PORTAL</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "38px", color: "#F0EAD6", marginTop: "24px", marginBottom: "8px", letterSpacing: "-0.5px" }}>Staff Login</h1>
          <p style={{ color: MUTED, fontSize: "14px", fontWeight: 300 }}>Authorized access only</p>
        </div>

        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "20px", padding: "36px" }}>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontSize: "11px", color: MUTED, fontWeight: 700, letterSpacing: "1.2px", marginBottom: "7px", textTransform: "uppercase" }}>Admin Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@giftai.com" required style={inputStyle}/>
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "11px", color: MUTED, fontWeight: 700, letterSpacing: "1.2px", marginBottom: "7px", textTransform: "uppercase" }}>Security Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={inputStyle}/>
            </div>
            {error && <div style={{ background: "#e24b4a18", border: "1px solid #e24b4a44", borderRadius: "8px", padding: "10px 14px", color: "#e24b4a", fontSize: "13px", marginBottom: "18px" }}>⚠ {error}</div>}
            <button type="submit" disabled={loading}
              style={{ width: "100%", background: GOLD, border: "none", borderRadius: "10px", padding: "15px", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "15px", cursor: loading ? "default" : "pointer", color: DARK, letterSpacing: "0.5px", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Verifying..." : "Access Dashboard →"}
            </button>
          </form>
          
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <a href="/login" style={{ fontSize: "12px", color: MUTED, textDecoration: "none" }}>← Back to User Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}
