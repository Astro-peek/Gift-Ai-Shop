import "./globals.css";

export const metadata = {
  title: "GiftAI — Find the Perfect Gift",
  description: "AI-powered gift recommendation platform for everyone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
