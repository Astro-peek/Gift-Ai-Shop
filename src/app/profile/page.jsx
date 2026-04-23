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

export default function ProfilePage() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login?redirect=/profile";
        return;
      }
      setUser(session.user);

      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        if (data && !data.error) {
          setProfileData({
            name: data.name || session.user.user_metadata?.full_name || "",
            phone: data.phone || "",
            address: data.address || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile");
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      if (res.ok) alert("Profile saved successfully.");
      else alert("Failed to save profile.");
    } catch (err) {
      alert("Error saving profile.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("giftai_user");
    window.location.href = "/login";
  };

  if (loading) return <div style={{ fontFamily: "'Nunito',sans-serif", minHeight: "100vh", background: DARK, color: GOLD, display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  if (!user) return null;

  return (
    <div style={{ fontFamily: "'Nunito',sans-serif", minHeight: "100vh", background: DARK, color: "#F0EAD6" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,400&family=Nunito:wght@300;600;700;800&display=swap" rel="stylesheet"/>
      
      <nav style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}`, padding: "0 3rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
        <a href="/" style={{ textDecoration: "none" }}><Logo/></a>
        <a href="/" style={{ color: MUTED, textDecoration: "none", fontSize: "13px", fontWeight: 700 }}>← Back to Shop</a>
      </nav>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "48px 2rem" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "48px", marginBottom: "8px", color: "#F0EAD6" }}>My Profile</h1>
        <p style={{ color: MUTED, marginBottom: "40px", fontSize: "14px", fontWeight: 300 }}>Manage your account and delivery details</p>

        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "32px", marginBottom: "24px" }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "32px", borderBottom: `1px solid ${BORDER}`, paddingBottom: "24px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: `${GOLD}22`, border: `1px solid ${GOLD}55`, display: "flex", alignItems: "center", justifyContent: "center", color: GOLD, fontSize: "24px", fontWeight: 800 }}>
              {user.user_metadata?.full_name ? user.user_metadata.full_name[0].toUpperCase() : user.email[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#F0EAD6", marginBottom: "4px" }}>{user.user_metadata?.full_name || "GiftAI User"}</div>
              <div style={{ fontSize: "13px", color: MUTED }}>{user.email}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: MUTED, fontWeight: 700, letterSpacing: "1.5px", marginBottom: "6px", textTransform: "uppercase" }}>Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={e => setProfileData(p => ({ ...p, name: e.target.value }))}
                style={{ width: "100%", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "8px", padding: "12px 14px", color: "#F0EAD6", fontSize: "14px", outline: "none", fontFamily: "'Nunito',sans-serif" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: MUTED, fontWeight: 700, letterSpacing: "1px", marginBottom: "6px", textTransform: "uppercase" }}>Phone Number</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={e => setProfileData(p => ({ ...p, phone: e.target.value }))}
                placeholder="+91 "
                style={{ width: "100%", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "8px", padding: "12px 14px", color: "#F0EAD6", fontSize: "14px", outline: "none", fontFamily: "'Nunito',sans-serif" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: MUTED, fontWeight: 700, letterSpacing: "1px", marginBottom: "6px", textTransform: "uppercase" }}>Primary Delivery Address</label>
              <textarea
                value={profileData.address}
                onChange={e => setProfileData(p => ({ ...p, address: e.target.value }))}
                rows={3}
                placeholder="Street address, city, state, pin code..."
                style={{ width: "100%", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "8px", padding: "12px 14px", color: "#F0EAD6", fontSize: "14px", outline: "none", fontFamily: "'Nunito',sans-serif", resize: "vertical" }}
              />
            </div>
            <button onClick={handleSave} style={{ width: "100%", background: GOLD, color: DARK, border: "none", borderRadius: "8px", padding: "14px", fontWeight: 800, cursor: "pointer", marginTop: "12px" }}>Save Details</button>
          </div>

        </div>

        <button onClick={handleLogout} style={{ width: "100%", background: "transparent", border: `1px solid #e24b4a55`, color: "#e24b4a", borderRadius: "8px", padding: "14px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
          Sign Out of Account
        </button>
      </div>
    </div>
  );
}
