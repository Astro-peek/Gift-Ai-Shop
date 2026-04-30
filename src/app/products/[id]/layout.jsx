export async function generateMetadata({ params }) {
  return {
    title: `Product Details — Giftara`,
    description: "View full details, AR preview, and curated gift notes for this premium Giftara product.",
    openGraph: {
      type: "website",
      siteName: "Giftara",
    },
  };
}

export default function ProductLayout({ children }) {
  return children;
}
