import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const PRODUCTS = [
  { name: "Hermès-Style Silk Scarf", price: "₹3,499", category: "Luxury Fashion", detail: "Pure silk, hand-rolled edges" },
  { name: "Japanese Cast Iron Tea Set", price: "₹4,299", category: "Home & Lifestyle", detail: "Traditional tetsubin design" },
  { name: "Sony WH-1000XM5", price: "₹6,999", category: "Premium Tech", detail: "Industry-leading noise cancellation" },
  { name: "Leather Bound Journal", price: "₹1,899", category: "Stationery", detail: "Italian leather, handstitched" },
  { name: "Luxury Aroma Diffuser", price: "₹2,999", category: "Wellness", detail: "Ultrasonic with essential oils" },
  { name: "Rare Orchid", price: "₹2,199", category: "Botanicals", detail: "Live bloom in glazed ceramic" },
  { name: "Belgian Chocolate Box", price: "₹2,499", category: "Gourmet Food", detail: "32 hand-crafted pralines" },
  { name: "Swiss Automatic Watch", price: "₹12,999", category: "Fine Accessories", detail: "Swiss movement, sapphire crystal" },
  { name: "Polaroid Photo Kit", price: "₹1,299", category: "Memories", detail: "Instant camera + scrapbook" },
  { name: "Ayurvedic Wellness Hamper", price: "₹3,799", category: "Wellness", detail: "10-piece holistic set" },
  { name: "Marble Chess Set", price: "₹5,499", category: "Games & Leisure", detail: "Hand-carved marble & alabaster" },
  { name: "Professional Art Set", price: "₹4,199", category: "Creative Arts", detail: "120-piece studio-grade set" },
];

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { message, history } = await req.json();

    const hasKey = process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes("placeholder") && !process.env.GEMINI_API_KEY.includes("your-");
    
    console.log("--- CHAT REQUEST ---");
    console.log("GEMINI_API_KEY Found:", !!process.env.GEMINI_API_KEY);
    console.log("GEMINI_API_KEY Valid:", hasKey);

    if (!hasKey) {
      return NextResponse.json({ reply: getFallbackReply(message) });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: `You are the GiftAI Concierge. CATALOG: ${JSON.stringify(PRODUCTS)}. RULES: 1. Sophisticated tone. 2. Recommend 1-2 items from catalog with prices. 3. Short responses (max 40 words).`
    });

    let formattedHistory = (history || []).map(m => ({
      role: m.role === "ai" ? "model" : "user",
      parts: [{ text: m.text }],
    }));

    // Gemini API requires the first message in history to drop 'model' role
    if (formattedHistory.length > 0 && formattedHistory[0].role === "model") {
      formattedHistory.shift();
    }

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: { temperature: 0.8 },
    });

    const result = await chat.sendMessage(message);
    return NextResponse.json({ reply: result.response.text() });

  } catch (error) {
    console.error("DEBUG: Gemini Error:", error);
    return NextResponse.json({ reply: getFallbackReply("gift recommendations") });
  }
}

function getFallbackReply(msg) {
  const q = msg.toLowerCase();
  if (q.includes("tech") || q.includes("music") || q.includes("gadget")) 
    return "For a modern touch, our Sony WH-1000XM5 (₹6,999) is an absolute standout. It's the gold standard in noise cancellation.";
  if (q.includes("mom") || q.includes("mother") || q.includes("woman") || q.includes("her"))
    return "The Hermès-Style Silk Scarf (₹3,499) is a timeless choice for her, though a Rare Orchid (₹2,199) also brings lasting joy.";
  if (q.includes("dad") || q.includes("father") || q.includes("him") || q.includes("man"))
    return "I'd suggest the Swiss Automatic Watch (₹12,999) for a grand gesture, or the Marble Chess Set (₹5,499) for a classic intellectual gift.";
  return "What a lovely gift idea. To give you the best advice, could you tell me a little more about who this gift is for? Our Belgian Chocolate Box (₹2,499) is always a safe, decadent choice in the meantime.";
}
