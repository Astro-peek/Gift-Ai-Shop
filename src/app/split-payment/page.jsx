"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

const GOLD = "#C9A84C", DARK = "#0A0804", SURFACE = "#13110C", CARD = "#1A1710", BORDER = "#2E2A1E", MUTED = "#6B6248";

const Logo = ({ size = 28 }) => (
  <svg width={size * 3.6} height={size} viewBox="0 0 148 40" fill="none">
    <rect x="1" y="9" width="22" height="22" rx="5" fill="#C9A84C" fillOpacity="0.12" stroke="#C9A84C" strokeWidth="1.1" />
    <path d="M12 9 L12 5 Q12 3 10 3 Q8 3 8 5 Q8 7 10 9 Z" fill="#C9A84C" />
    <path d="M12 9 L12 5 Q12 3 14 3 Q16 3 16 5 Q16 7 14 9 Z" fill="#C9A84C" />
    <rect x="6" y="9" width="12" height="3" rx="1.5" fill="#C9A84C" />
    <rect x="11" y="12" width="2" height="19" rx="1" fill="#C9A84C" fillOpacity="0.55" />
    <line x1="6" y1="20.5" x2="18" y2="20.5" stroke="#C9A84C" strokeWidth="0.7" strokeOpacity="0.35" />
    <text x="30" y="28" fontFamily="Georgia,serif" fontSize="21" fontWeight="700" fill="#C9A84C" letterSpacing="1.5">GiftAI</text>
  </svg>
);

export default function MySplitPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndPayments = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        window.location.href = "/login?redirect=/split-payment";
        return;
      }
      setUser(session.user);

      try {
        const res = await fetch(`/api/split-payment/my-payments?userId=${session.user.id}`);
        if (res.ok) {
          const data = await res.json();
          setPayments(data.payments || []);
        }
      } catch (err) {
        console.error("Failed to fetch payments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPayments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "paid": return "#52b788";
      case "partial_paid": return GOLD;
      case "pending": return MUTED;
      case "expired": return "#e24b4a";
      default: return MUTED;
    }
  };

  if (loading) {
    return (
      <div style={{ fontFamily: "'Nunito',sans-serif", minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=Nunito:wght@300;600;700;800&display=swap" rel="stylesheet" />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", color: GOLD, marginBottom: "20px", animation: "pulse 1.5s infinite" }}>◈</div>
          <div style={{ color: MUTED }}>Loading your split payments...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Nunito',sans-serif", minHeight: "100vh", background: DARK, color: "#F0EAD6" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Nunito:wght@300;400;600;700;800;900&display=swap" rel="stylesheet" />

      <nav style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}`, padding: "0 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
        <style>{`@media (min-width: 768px) { nav { padding: 0 3rem !important; } }`}</style>
        <a href="/" style={{ textDecoration: "none" }}><Logo /></a>
        <a href="/cart" style={{ color: MUTED, textDecoration: "none", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
          <span>←</span> Back to Cart
        </a>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 1rem" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "36px", color: "#F0EAD6", marginBottom: "8px" }}>
          My Split Payments
        </h1>
        <p style={{ color: MUTED, fontSize: "14px", marginBottom: "32px" }}>
          Track and manage your shared gift orders
        </p>

        {payments.length === 0 ? (
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "60px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", color: MUTED, marginBottom: "16px" }}>📭</div>
            <h3 style={{ color: "#F0EAD6", marginBottom: "8px" }}>No split payments yet</h3>
            <p style={{ color: MUTED, fontSize: "14px", marginBottom: "24px" }}>
              You haven't created any split payments. Start one from your cart!
            </p>
            <a href="/cart" style={{ display: "inline-block", background: GOLD, color: DARK, padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 700 }}>
              Go to Cart →
            </a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {payments.map((payment) => {
              const paidCount = payment.participants.filter(p => p.status === "paid").length;
              const totalCount = payment.participants.length;
              const progress = Math.round((paidCount / totalCount) * 100);

              return (
                <div key={payment.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <div style={{ fontSize: "11px", color: MUTED, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                        Split Payment #{payment.id.slice(-6).toUpperCase()}
                      </div>
                      <div style={{ fontSize: "18px", color: "#F0EAD6", fontWeight: 700 }}>
                        ₹{payment.totalAmount.toLocaleString()}
                      </div>
                      <div style={{ fontSize: "13px", color: MUTED, marginTop: "4px" }}>
                        Created {new Date(payment.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{
                      background: getStatusColor(payment.status),
                      color: DARK,
                      padding: "6px 16px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}>
                      {payment.status.replace("_", " ")}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: MUTED, marginBottom: "8px" }}>
                      <span>{paidCount} of {totalCount} paid</span>
                      <span>{progress}%</span>
                    </div>
                    <div style={{ height: "6px", background: SURFACE, borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${progress}%`, background: payment.status === "paid" ? "#52b788" : GOLD, borderRadius: "3px" }} />
                    </div>
                  </div>

                  {/* Participants */}
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontSize: "11px", color: GOLD, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
                      Participants
                    </div>
                    {payment.participants.map((p, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < payment.participants.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            background: p.status === "paid" ? "rgba(82, 183, 136, 0.15)" : SURFACE,
                            border: `2px solid ${p.status === "paid" ? "#52b788" : MUTED}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            color: p.status === "paid" ? "#52b788" : MUTED,
                          }}>
                            {p.status === "paid" ? "✓" : p.email.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontSize: "14px", color: "#F0EAD6" }}>{p.email}</span>
                        </div>
                        <span style={{ fontSize: "14px", color: GOLD, fontWeight: 600 }}>₹{p.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <a href={`/split-payment/${payment.id}`} style={{ flex: 1, textAlign: "center", background: GOLD, color: DARK, padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: 700, fontSize: "14px" }}>
                      Track Status →
                    </a>
                    {payment.orderId && (
                      <a href="/orders" style={{ flex: 1, textAlign: "center", background: "transparent", border: `1px solid ${BORDER}`, color: "#F0EAD6", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}>
                        View Order
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
