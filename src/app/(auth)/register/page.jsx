"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const GOLD = "#C9A84C", DARK = "#0A0804", SURFACE = "#13110C", CARD = "#1A1710", BORDER = "#2E2A1E", MUTED = "#6B6248";

const Logo = () => (
  <svg width="200" height="50" viewBox="0 0 148 40" fill="none" style={{ filter: "drop-shadow(0 0 12px rgba(201, 168, 76, 0.4))" }}>
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#C9A84C"/>
        <stop offset="50%" stopColor="#E8C97A"/>
        <stop offset="100%" stopColor="#C9A84C"/>
      </linearGradient>
    </defs>
    <rect x="1" y="9" width="22" height="22" rx="5" fill="#C9A84C" fillOpacity="0.15" stroke="url(#logoGrad)" strokeWidth="1.2"/>
    <path d="M12 9 L12 5 Q12 3 10 3 Q8 3 8 5 Q8 7 10 9 Z" fill="#E8C97A"/>
    <path d="M12 9 L12 5 Q12 3 14 3 Q16 3 16 5 Q16 7 14 9 Z" fill="#E8C97A"/>
    <rect x="6" y="9" width="12" height="3" rx="1.5" fill="#E8C97A"/>
    <rect x="11" y="12" width="2" height="19" rx="1" fill="#C9A84C" fillOpacity="0.7"/>
    <line x1="6" y1="20.5" x2="18" y2="20.5" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.5"/>
    <text x="30" y="28" fontFamily="Georgia,serif" fontSize="22" fontWeight="700" fill="url(#logoGrad)" letterSpacing="2">Giftara</text>
  </svg>
);

export default function RegisterPage() {
  const supabase = createClientComponentClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name }, emailRedirectTo: `${window.location.origin}/` },
    });
    if (error) { setError(error.message); setLoading(false); }
    else { setSuccess(true); setLoading(false); }
  };

  const inputStyle = {
    width: "100%", padding: "13px 16px", background: SURFACE,
    border: `1px solid ${BORDER}`, borderRadius: "10px", color: "#F0EAD6",
    fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "'Nunito',sans-serif",
  };

  if (success) return (
    <div style={{ fontFamily: "'Nunito',sans-serif", minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=Nunito:wght@600;700;800&display=swap" rel="stylesheet"/>
      <div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "64px", color: GOLD, marginBottom: "20px" }}>✦</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "42px", color: "#F0EAD6", marginBottom: "12px" }}>Check your inbox!</h1>
        <p style={{ color: MUTED, fontSize: "14px", fontWeight: 300, maxWidth: "340px", lineHeight: 1.7 }}>We've sent a confirmation link to <a href={`mailto:${email}`} style={{ color: "#F0EAD6", fontWeight: 600, textDecoration: "underline" }}>{email}</a>. Click it to activate your Giftara account.</p>
        <a href="/login" style={{ display: "inline-block", marginTop: "32px", background: GOLD, color: DARK, padding: "13px 32px", borderRadius: "10px", fontWeight: 800, textDecoration: "none", fontSize: "14px" }}>Back to Login →</a>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Nunito',sans-serif", minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=Nunito:wght@300;400;600;700;800&display=swap" rel="stylesheet"/>
      <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "300px", background: `radial-gradient(ellipse, ${GOLD}0F 0%, transparent 70%)`, pointerEvents: "none" }}/>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <a href="/" style={{ display: "inline-block", marginBottom: "32px", textDecoration: "none", transition: "transform 0.3s ease" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}><Logo/></a>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "38px", color: "#F0EAD6", marginBottom: "8px", letterSpacing: "-0.5px" }}>Create account</h1>
          <p style={{ color: MUTED, fontSize: "14px", fontWeight: 300 }}>Start gifting with AI-powered precision</p>
        </div>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "20px", padding: "36px" }}>
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontSize: "11px", color: MUTED, fontWeight: 700, letterSpacing: "1.2px", marginBottom: "7px", textTransform: "uppercase" }}>Full Name</label>
              <input id="reg-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Aarav Kumar" required style={inputStyle}/>
            </div>
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontSize: "11px", color: MUTED, fontWeight: 700, letterSpacing: "1.2px", marginBottom: "7px", textTransform: "uppercase" }}>Email</label>
              <input id="reg-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={inputStyle}/>
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "11px", color: MUTED, fontWeight: 700, letterSpacing: "1.2px", marginBottom: "7px", textTransform: "uppercase" }}>Password</label>
              <input id="reg-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" minLength={8} required style={inputStyle}/>
            </div>
            {error && <div style={{ background: "#e24b4a18", border: "1px solid #e24b4a44", borderRadius: "8px", padding: "10px 14px", color: "#e24b4a", fontSize: "13px", marginBottom: "18px" }}>⚠ {error}</div>}
            <button id="reg-submit" type="submit" disabled={loading}
              style={{ width: "100%", background: GOLD, border: "none", borderRadius: "10px", padding: "15px", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "15px", cursor: loading ? "default" : "pointer", color: DARK, letterSpacing: "0.5px", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>
          <div style={{ textAlign: "center", marginTop: "22px", fontSize: "13px", color: MUTED }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: GOLD, fontWeight: 700, textDecoration: "none" }}>Sign in →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
