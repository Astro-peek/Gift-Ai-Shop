import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { occasion, recipient, budget, products } = await req.json();

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes("your-")) {
      return NextResponse.json({ reasons: products.map(p => `Perfect for a ${recipient} on their ${occasion}.`) });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `User is shopping for a ${recipient} for a ${occasion} with a budget of ₹${budget}.
    We have selected these 3 gifts: ${products.map(p => p.name).join(", ")}.
    For each gift, write one short, elegant sentence (max 12 words) explaining why it's perfect for this specific occasion and recipient.
    Return ONLY a JSON array of 3 strings. Example: ["Reason 1", "Reason 2", "Reason 3"]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean JSON from response if needed
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const reasons = JSON.parse(cleanText);

    return NextResponse.json({ reasons });
  } catch (err) {
    console.error("Gemini Recommend Error:", err);
    return NextResponse.json({ reasons: [] });
  }
}
