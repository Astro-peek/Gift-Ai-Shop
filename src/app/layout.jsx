import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "GiftAI — AI-Powered Luxury Gift Recommendations",
  description: "Discover the perfect luxury gift with GiftAI. Our AI concierge handpicks curated gifts for every occasion, recipient, and budget. From ₹1,299 to ₹12,999.",
  keywords: "luxury gifts, AI gift recommendations, gift ideas India, premium gifts online, personalized gifts",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "GiftAI — AI-Powered Luxury Gift Recommendations",
    description: "Find the perfect gift with AI. Curated luxury gifts for every occasion.",
    type: "website",
    locale: "en_IN",
    siteName: "GiftAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "GiftAI — AI-Powered Luxury Gifting",
    description: "AI-curated luxury gifts for every occasion and recipient.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0804",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          * { box-sizing: border-box; }
          html { font-size: 16px; }
          @media (max-width: 768px) {
            html { font-size: 14px; }
          }
          body { 
            margin: 0; 
            padding: 0; 
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          img { max-width: 100%; height: auto; }
          button { touch-action: manipulation; }
          input, select, textarea { font-size: 16px; }
          @media (max-width: 768px) {
            input, select, textarea { font-size: 16px; }
          }
        `}</style>
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
