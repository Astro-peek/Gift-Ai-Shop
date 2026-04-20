# GiftAI — Project Structure & Logic Overview

Welcome to **GiftAI**, a premium, AI-powered gift recommendation engine built for speed and aesthetics. This document explains the internal "magic" of how the app works so you can explain it to the judges!

---

## 1. Project Architecture
The project is built using **Next.js 14** (App Router). It follows the `src/app` directory pattern.

-   **`src/app/page.jsx`**: The Homepage. Contains the Product Grid, Search, Voice Search, and the AI Concierge Chat.
-   **`src/app/recommend/page.jsx`**: The 3-Step Gift Recommender Quiz.

---

## 2. The "AI" Logic (How it works under the hood)

Since this is a Hackathon MVP, we use **"Expert Systems" logic** to ensure 100% reliability and zero latency.

### A. The Concierge Chat (`page.jsx`)
-   **Logic**: It uses a function called `getReply(msg)`.
-   **Mechanism**: It scans your message for "keywords" (tags).
-   **Example**: If you say *"What for my kid?"*, it finds the `kid` tag in `AI_RESPONSES` and gives a custom recommendation with reasons.
-   **Fallback**: If no keyword is found, it gives a polite "tell me more" response.

### B. The Gift Recommender (`recommend/page.jsx`)
-   **Logic**: A 3-step quiz (Occasion → Recipient → Budget).
-   **Scoring Algorithm**:
    -   Every product has **Tags**.
    -   Every choice (like "Birthday" or "Mom") has **Associated Tags**.
    -   The system calculates a **Compatibility Score** for each product by matching your choices against the product's tags.
    -   **Result**: It sorts products by score and picks the top 3.
-   **Fallback**: If no perfect match is found, it filters by budget to ensure the user always sees something relevant.

### C. Suggested Gift Notes
-   We don't just recommend a gift; we provide a **suggested note** for the card (e.g., *"For the man who taught me everything worth knowing..."*). This adds a "human touch" that judges love.

---

## 3. Styling & Aesthetics
-   **Design Language**: Sleek Dark Mode with **Gold (#C9A84C)** accents.
-   **Typography**: Uses `Cormorant Garamond` (luxury serif) for headings and `Nunito` for UI text.
-   **Premium Touches**:
    -   Hover effects with smooth scaling.
    -   Custom SVG logos and icons.
    -   "Pulse" animations during loading states to simulate "AI Thinking".

---

## 4. Key Components to Highlight
| Feature | Location | Why highlight it? |
| :--- | :--- | :--- |
| **Voice Search** | `page.jsx` (handleVoice) | Uses the Browser's Speech API. It's high-tech and zero cost. |
| **Scoring Engine** | `recommend/page.jsx` (score function) | Shows "Algorithmic thinking" — it's smart recommendation logic. |
| **Responsive UI** | Entire App | Works perfectly on phones for "on-the-go" gifting. |

---

## 5. Next Steps for Development
1.  **Backend Integration**: Connect to Supabase to save "Orders" and "Favorites".
2.  **External AI**: Replace the keyword-matching with a real OpenAI/Claude API call once we have a key.
3.  **Payments**: Integrate Razorpay (logic is planned in the README).

---
*Built with ❤️ by the GiftAI Team.*
