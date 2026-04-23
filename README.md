# GiftAI ✨

### AI-Powered Luxury Gift Recommendations & Smart Concierge

GiftAI is a next-generation AI-driven e-commerce platform designed to eliminate the stress of finding the perfect gift. By combining **luxury product curation** with **Google Gemini AI intelligence**, the platform delivers a personalized concierge experience tailored to the user's intent, emotions, and budget.

---

## 🌍 Problem Statement

Choosing the right gift is often:

* Time-consuming
* Emotionally uncertain
* Overwhelming due to too many choices

Most platforms focus on **products**, not **intent**. Users struggle to translate feelings (e.g., appreciation, celebration) into meaningful gifts.

---

## 💡 Solution

GiftAI bridges this gap by using **AI-powered conversational intelligence** to:

* Understand user intent in natural language
* Interpret emotional and contextual cues
* Recommend highly relevant, premium gifts instantly

---

## 🧠 How AI Works

* Powered by **Google Gemini 1.5 Pro**
* Uses prompt-based contextual understanding
* Processes:

  * Occasion (birthday, graduation, etc.)
  * Budget constraints
  * Personal preferences (eco-friendly, luxury, etc.)
* Outputs **curated, actionable gift suggestions** with product links

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 14 (App Router), JavaScript
* **Styling:** Custom Luxury Dark Theme (Vanilla CSS)
* **Backend & DB:** Supabase PostgreSQL
* **ORM:** Prisma
* **Authentication:** Supabase Auth
* **AI Engine:** Google Gemini 1.5 Pro
* **Payments:** Razorpay (UPI, Cards, Netbanking, COD)

---

## 🎯 Key Features

### 🤖 AI Gift Scout (Smart Concierge)

* Real-time conversational AI
* Context-aware recommendations
* Handles complex queries like:
  *"Luxury eco-friendly gift under ₹4000 for graduation"*

---

### 👤 Personalized User Profiles

* Persistent addresses & user data
* Secure authentication & session management

---

### 🛒 Smart Guest-to-Buyer Flow

* Browse & add to cart without login
* Secure checkout & order tracking for authenticated users

---

### 📊 Admin Dashboard

* Real-time analytics (revenue, orders, users)
* Role-based access control
* Business intelligence insights

---

### 💳 Seamless Checkout

* Razorpay integration
* Supports UPI, Cards, Netbanking
* Cash on Delivery option
* Full order persistence

---

## 🔐 Access Control

| Feature         | Guest | User | Admin |
| --------------- | ----- | ---- | ----- |
| Browse Products | ✅     | ✅    | ✅     |
| AI Chat         | ✅     | ✅    | ✅     |
| Add to Cart     | ✅     | ✅    | ✅     |
| Checkout        | ❌     | ✅    | ✅     |
| Profile         | ❌     | ✅    | ✅     |
| Orders          | ❌     | ✅    | ✅     |
| Admin Panel     | ❌     | ❌    | ✅     |

---

## ⚙️ Installation

```bash
git clone <repo-url>
cd giftai
npm install
```

### 🔑 Environment Variables (.env)

```
DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
GEMINI_API_KEY=
```

```bash
npx prisma db push
npm run dev
```

---

## 🎨 Design Philosophy

GiftAI follows a **Luxury Minimalism UI**:

* Background: Deep Espresso (#0A0804)
* Accent: Antique Gold (#C9A84C)
* Fonts:

  * Cormorant Garamond (Elegance)
  * Nunito (Readability)

✨ Features:

* Glassmorphism
* Micro-interactions
* Smooth transitions

---

## 🚀 Future Enhancements

* 🎙️ Voice-based AI gifting assistant
* 🧠 Emotion detection via sentiment analysis
* 🕶️ AR-based gift preview
* 🎁 Social gifting & group contributions

---

## 🏆 Hackathon Value

GiftAI is not just an e-commerce app — it is an **AI-driven decision-making system** that transforms gifting into an intelligent, emotional, and personalized experience.

---

© 2024 GiftAI Team
Built for Next-Gen E-Commerce Hackathon 🚀
