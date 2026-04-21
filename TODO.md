# 🏁 GiftAI Hackathon: Remaining Tasks

This checklist tracks what needs to be done to transition from the **Mock MVP** to a **Production-Ready** application as described in the README.

---

## 🏗️ 1. Database & Backend Foundation
- [x] **Install Dependencies**: `npm install prisma @prisma/client @supabase/supabase-js razorpay`
- [x] **Setup `.env.local`**: Add Supabase and Razorpay API keys.
- [x] **Prisma Schema**: Created `prisma/schema.prisma` with `Product`, `User`, and `Order` models.
- [ ] **Database Push**: Run `npm run db:push` to create tables in Supabase. *(needs your Supabase credentials in `.env.local`)*
- [x] **Data Migration**: Created `prisma/seed.js` — run `npm run db:seed` after db:push.

---

## 🔐 2. Authentication & Security
- [x] **Supabase Auth**: Login page at `/login`, Register page at `/register`.
- [x] **Session Management**: Middleware at `src/middleware.js` protects `/admin` and `/orders` routes.
- [x] **User Profile**: Navbar shows real user initials with a logout button dropdown.

---

## 🛍️ 3. Core Shopping Experience (Real Data)
- [ ] **Connect Homepage**: Fetch products from Prisma instead of the hardcoded `PRODUCTS` array. *(ready after db:push + db:seed)*
- [x] **Product Detail Page**: Created `src/app/products/[id]/page.jsx` with full descriptions.
- [x] **AR Viewer**: Added `<model-viewer>` to the product detail page for 3D/AR previews.
- [x] **Persistent Cart**: Cart items saved to `localStorage` — survive page refresh across all pages.

---

## 💳 4. Payments & Checkout
> ⏭️ *Skipped as requested*

---

## 🤖 5. Advanced AI Features
- [x] **Real LLM Chat**: `getReply` replaced with a real API call to `/api/chat` (OpenAI GPT-4o-mini, expert-system fallback).
- [x] **Smart Recommender**: Quiz answers sent to `/api/recommend` — LLM generates personalized reasons.
- [x] **Personalized Feed**: Homepage shows "Curated For You" section based on user's viewed categories.

---

## 🛠️ 6. Admin Panel
> ⏭️ *Skipped as requested*

---

## 🎨 7. Final Polish
- [x] **Loading States**: Skeleton loaders on the homepage product grid while fetching.
- [x] **Responsive Design**: `globals.css` has mobile breakpoints for 768px and 480px screens.
- [x] **SEO**: Meta tags + OpenGraph images set in `layout.jsx` and per-page layout files.

---

## ✅ Setup Commands (run in order after adding Supabase creds to `.env.local`)

```bash
# 1. Generate Prisma client
npm run db:generate

# 2. Push schema to Supabase
npm run db:push

# 3. Seed the database with 12 products
npm run db:seed

# 4. Run the dev server
npm run dev
```

### 💡 Pro-Tip for Demo:
If time is short, prioritize **Authentication** and one **Real Database feature** (like saving an order). Judges value a "Full Stack" flow over a 100% finished UI.
