import "./globals.css";

export const metadata = {
  title: "GiftAI — AI-Powered Luxury Gift Recommendations",
  description: "Discover the perfect luxury gift with GiftAI. Our AI concierge handpicks curated gifts for every occasion, recipient, and budget. From ₹1,299 to ₹12,999.",
  keywords: "luxury gifts, AI gift recommendations, gift ideas India, premium gifts online, personalized gifts",
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
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
