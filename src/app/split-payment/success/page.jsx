"use client";

const GOLD = "#C9A84C", DARK = "#0A0804", CARD = "#1A1710", BORDER = "#2E2A1E", MUTED = "#6B6248";

export default function SplitPaymentSuccessPage() {
  return (
    <div style={{ fontFamily: "'Nunito',sans-serif", minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=Nunito:wght@300;600;700;800&display=swap" rel="stylesheet" />
      
      <div>
        <div style={{ fontSize: "72px", color: "#52b788", marginBottom: "24px" }}>✓</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "42px", color: "#F0EAD6", marginBottom: "16px" }}>
          Payment Successful!
        </h1>
        <p style={{ color: MUTED, fontSize: "16px", maxWidth: "450px", lineHeight: 1.7, marginBottom: "32px" }}>
          Thank you for your contribution! The order initiator has been notified. 
          The gift order will be placed once all participants have completed their payments.
        </p>
        
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "24px", maxWidth: "400px", margin: "0 auto 32px" }}>
          <div style={{ fontSize: "11px", color: GOLD, fontWeight: 800, letterSpacing: "2px", marginBottom: "12px", textTransform: "uppercase" }}>
            What happens next?
          </div>
          <div style={{ fontSize: "14px", color: "#F0EAD6", lineHeight: 1.7, textAlign: "left" }}>
            1. The order initiator will receive an email confirming your payment<br/>
            2. Once all participants pay, the order will be placed automatically<br/>
            3. You'll receive tracking information via email
          </div>
        </div>

        <a 
          href="/" 
          style={{ 
            display: "inline-block", 
            background: GOLD, 
            color: DARK, 
            padding: "14px 32px", 
            borderRadius: "8px", 
            fontWeight: 800, 
            textDecoration: "none", 
            fontSize: "14px",
            letterSpacing: "0.5px"
          }}
        >
          Continue Shopping →
        </a>
      </div>
    </div>
  );
}
