"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

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

export default function SplitPaymentStatusPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retrying, setRetrying] = useState({});

  useEffect(() => {
    if (!id) return;
    fetchStatus();
    // Poll every 10 seconds for updates
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchStatus = async () => {
    try {
      const res = await fetch(`/api/split-payment/status/${id}`);
      if (!res.ok) throw new Error("Failed to fetch status");
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetryPayment = async (participantId) => {
    setRetrying(prev => ({ ...prev, [participantId]: true }));
    try {
      // In a real implementation, this would call an API to create a new payment link
      alert("Retry functionality would create a new payment link here");
    } finally {
      setRetrying(prev => ({ ...prev, [participantId]: false }));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid": return "✓";
      case "pending": return "⏳";
      case "failed": return "✕";
      case "expired": return "⌛";
      default: return "○";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid": return "#52b788";
      case "pending": return GOLD;
      case "failed": return "#e24b4a";
      case "expired": return MUTED;
      default: return MUTED;
    }
  };

  if (loading) {
    return (
      <div style={{ fontFamily: "'Nunito',sans-serif", minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=Nunito:wght@300;600;700;800&display=swap" rel="stylesheet" />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", color: GOLD, marginBottom: "20px", animation: "pulse 1.5s infinite" }}>◈</div>
          <div style={{ color: MUTED }}>Loading payment status...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ fontFamily: "'Nunito',sans-serif", minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=Nunito:wght@300;600;700;800&display=swap" rel="stylesheet" />
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div style={{ fontSize: "48px", color: "#e24b4a", marginBottom: "20px" }}>✕</div>
          <h1 style={{ color: "#F0EAD6", marginBottom: "12px" }}>Error</h1>
          <p style={{ color: MUTED }}>{error}</p>
          <button onClick={fetchStatus} style={{ marginTop: "20px", background: GOLD, border: "none", padding: "12px 24px", borderRadius: "8px", cursor: "pointer", fontWeight: 700 }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const isComplete = data.status === "paid";
  const isExpired = data.status === "expired";

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

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 1rem" }}>
        <style>{`@media (min-width: 640px) { .status-container { padding: 60px 2rem !important; } }`}</style>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "56px", color: isComplete ? "#52b788" : isExpired ? "#e24b4a" : GOLD, marginBottom: "16px", fontFamily: "'Cormorant Garamond',serif" }}>
            {isComplete ? "✦" : isExpired ? "⌛" : "👥"}
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px, 5vw, 48px)", color: "#F0EAD6", marginBottom: "12px" }}>
            {isComplete ? "Payment Complete!" : isExpired ? "Payment Expired" : "Split Payment Status"}
          </h1>
          <p style={{ color: MUTED, fontSize: "15px", maxWidth: "500px", margin: "0 auto", lineHeight: 1.6 }}>
            {isComplete
              ? "All participants have paid. Your order has been placed and is being prepared."
              : isExpired
                ? "The payment window has expired. Please create a new split payment."
                : `Track who has paid and who is pending. Order will be placed once all ${data.progress.total} participants have paid.`
            }
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "24px", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ fontSize: "14px", color: "#F0EAD6", fontWeight: 700 }}>Payment Progress</div>
            <div style={{ fontSize: "14px", color: GOLD, fontWeight: 800 }}>{data.progress.percentage}%</div>
          </div>
          <div style={{ height: "8px", background: SURFACE, borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${data.progress.percentage}%`, background: isComplete ? "#52b788" : GOLD, borderRadius: "4px", transition: "width 0.5s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontSize: "13px", color: MUTED }}>
            <span>{data.progress.paid} paid</span>
            <span>{data.progress.pending} pending</span>
          </div>
        </div>

        {/* Amount Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "20px", textAlign: "center" }}>
            <div style={{ fontSize: "11px", color: MUTED, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Total Amount</div>
            <div style={{ fontSize: "24px", color: "#F0EAD6", fontWeight: 700, fontFamily: "'Cormorant Garamond',serif" }}>₹{data.totalAmount.toLocaleString()}</div>
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "20px", textAlign: "center" }}>
            <div style={{ fontSize: "11px", color: MUTED, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Paid So Far</div>
            <div style={{ fontSize: "24px", color: "#52b788", fontWeight: 700, fontFamily: "'Cormorant Garamond',serif" }}>₹{data.paidAmount.toLocaleString()}</div>
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "20px", textAlign: "center" }}>
            <div style={{ fontSize: "11px", color: MUTED, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Remaining</div>
            <div style={{ fontSize: "24px", color: data.pendingAmount > 0 ? GOLD : "#52b788", fontWeight: 700, fontFamily: "'Cormorant Garamond',serif" }}>₹{data.pendingAmount.toLocaleString()}</div>
          </div>
        </div>

        {/* Participants List */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "24px", marginBottom: "32px" }}>
          <div style={{ fontSize: "11px", color: GOLD, fontWeight: 800, letterSpacing: "2px", marginBottom: "20px", textTransform: "uppercase" }}>Participants</div>
          
          {data.participants.map((participant, index) => (
            <div key={participant.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 0", borderBottom: index < data.participants.length - 1 ? `1px solid ${BORDER}` : "none" }}>
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: participant.status === "paid" ? "rgba(82, 183, 136, 0.15)" : SURFACE,
                border: `2px solid ${getStatusColor(participant.status)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                color: getStatusColor(participant.status),
                fontWeight: 700,
              }}>
                {participant.status === "paid" ? "✓" : participant.email.charAt(0).toUpperCase()}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "15px", color: "#F0EAD6", fontWeight: 600, marginBottom: "4px" }}>{participant.email}</div>
                <div style={{ fontSize: "12px", color: getStatusColor(participant.status), fontWeight: 600, textTransform: "capitalize" }}>
                  {participant.status}
                  {participant.paidAt && ` • ${new Date(participant.paidAt).toLocaleDateString()}`}
                </div>
              </div>
              
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "18px", color: GOLD, fontWeight: 700, fontFamily: "'Cormorant Garamond',serif" }}>₹{participant.amount.toLocaleString()}</div>
                {participant.status === "pending" && participant.paymentLink && (
                  <a
                    href={participant.paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "11px", color: GOLD, textDecoration: "none", display: "block", marginTop: "4px" }}
                  >
                    Pay Now →
                  </a>
                )}
                {(participant.status === "failed" || participant.status === "expired") && (
                  <button
                    onClick={() => handleRetryPayment(participant.id)}
                    disabled={retrying[participant.id]}
                    style={{ fontSize: "11px", background: "none", border: "none", color: GOLD, cursor: "pointer", padding: 0 }}
                  >
                    {retrying[participant.id] ? "Retrying..." : "Retry →"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order Info (if placed) */}
        {data.order && (
          <div style={{ background: "rgba(82, 183, 136, 0.08)", border: "1px solid rgba(82, 183, 136, 0.3)", borderRadius: "16px", padding: "24px", marginBottom: "32px" }}>
            <div style={{ fontSize: "11px", color: "#52b788", fontWeight: 800, letterSpacing: "2px", marginBottom: "12px", textTransform: "uppercase" }}>Order Placed</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "18px", color: "#F0EAD6", fontWeight: 700 }}>Order #{data.order.id.slice(-6).toUpperCase()}</div>
                <div style={{ fontSize: "13px", color: MUTED, marginTop: "4px" }}>Status: {data.order.status}</div>
              </div>
              <a
                href="/orders"
                style={{ background: "#52b788", color: DARK, padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 700, fontSize: "14px" }}
              >
                View Order →
              </a>
            </div>
          </div>
        )}

        {/* Initiator Info */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
          <div style={{ fontSize: "11px", color: MUTED, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Initiated By</div>
          <div style={{ fontSize: "15px", color: "#F0EAD6", fontWeight: 600 }}>{data.initiator.name}</div>
          <div style={{ fontSize: "13px", color: MUTED }}>{data.initiator.email}</div>
        </div>

        {/* Refresh Button */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={fetchStatus}
            style={{ background: "transparent", border: `1px solid ${BORDER}`, color: MUTED, padding: "12px 32px", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}
          >
            🔄 Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
}
