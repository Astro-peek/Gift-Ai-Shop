import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Cache products for 5 minutes to reduce DB calls
let cachedProducts = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getProducts() {
  const now = Date.now();
  if (cachedProducts && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedProducts;
  }
  
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      name: true,
      price: true,
      category: true,
      desc: true,
      badge: true,
    },
  });
  
  // Format for AI (name, price with rupee symbol, category, detail)
  const formattedProducts = products.map(p => ({
    name: p.name,
    price: `₹${p.price.toLocaleString()}`,
    category: p.category,
    detail: p.desc.substring(0, 60) + (p.desc.length > 60 ? "..." : ""),
    badge: p.badge,
  }));
  
  cachedProducts = formattedProducts;
  cacheTimestamp = now;
  return formattedProducts;
}

export async function POST(req) {
  try {
    const { message, history } = await req.json();
    
    // Fetch products from database
    const products = await getProducts();

    const hasKey = process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes("placeholder") && !process.env.GEMINI_API_KEY.includes("your-");
    
    console.log("--- CHAT REQUEST ---");
    console.log("GEMINI_API_KEY Found:", !!process.env.GEMINI_API_KEY);
    console.log("GEMINI_API_KEY Valid:", hasKey);
    console.log("Products loaded:", products.length);

    if (!hasKey) {
      return NextResponse.json({ reply: getFallbackReply(message, products) });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: `You are the GiftAI Concierge. CATALOG: ${JSON.stringify(products)}. RULES: 1. Sophisticated tone. 2. Recommend 1-2 items from catalog with prices. 3. Short responses (max 40 words).`
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
    // Try to get products for fallback even in error case
    try {
      const products = await getProducts();
      return NextResponse.json({ reply: getFallbackReply("gift recommendations", products) });
    } catch {
      return NextResponse.json({ reply: "I'm here to help you find the perfect gift! What occasion are you shopping for?" });
    }
  }
}

function getFallbackReply(msg, products) {
  const q = msg.toLowerCase();
  
  // Find products by category from database
  const techProducts = products?.filter(p => p.category === "Premium Tech");
  const fashionProducts = products?.filter(p => p.category === "Luxury Fashion");
  const accessoriesProducts = products?.filter(p => p.category === "Fine Accessories");
  const foodProducts = products?.filter(p => p.category === "Gourmet Food");
  
  if (q.includes("tech") || q.includes("music") || q.includes("gadget")) {
    const tech = techProducts?.[0];
    if (tech) return `For a modern touch, our ${tech.name} (${tech.price}) is an absolute standout. ${tech.detail}`;
  }
  
  if (q.includes("mom") || q.includes("mother") || q.includes("woman") || q.includes("her")) {
    const fashion = fashionProducts?.[0];
    if (fashion) return `The ${fashion.name} (${fashion.price}) is a timeless choice for her. ${fashion.detail}`;
  }
  
  if (q.includes("dad") || q.includes("father") || q.includes("him") || q.includes("man")) {
    const accessory = accessoriesProducts?.[0];
    if (accessory) return `I'd suggest the ${accessory.name} (${accessory.price}) for a grand gesture. ${accessory.detail}`;
  }
  
  // Default recommendation
  const defaultProduct = foodProducts?.[0] || products?.[0];
  if (defaultProduct) {
    return `What a lovely gift idea. To give you the best advice, could you tell me a little more about who this gift is for? Our ${defaultProduct.name} (${defaultProduct.price}) is always a safe, decadent choice in the meantime.`;
  }
  
  return "What a lovely gift idea! To give you the best advice, could you tell me more about who you're shopping for and your budget?";
}
