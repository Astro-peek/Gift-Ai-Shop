export async function generateMetadata({ params }) {
  return {
    title: `Product Details — GiftAI`,
    description: "View full details, AR preview, and curated gift notes for this premium GiftAI product.",
    openGraph: {
      type: "website",
      siteName: "GiftAI",
    },
  };
}

export default function ProductLayout({ children }) {
  return children;
}
