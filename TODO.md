# 🏁 GiftAI Hackathon: Remaining Tasks

This checklist tracks what needs to be done to transition from the **Mock MVP** to a **Production-Ready** application as described in the README.

---

## 🏗️ 1. Database & Backend Foundation
- [ ] **Install Dependencies**: `npm install prisma @prisma/client @supabase/supabase-js razorpay`.
- [ ] **Setup `.env.local`**: Add Supabase and Razorpay API keys.
- [ ] **Prisma Schema**: Create `prisma/schema.prisma` with `Product`, `User`, and `Order` models.
- [ ] **Database Push**: Run `npx prisma db push` to create tables in Supabase.
- [ ] **Data Migration**: Create a `seed.js` script to move hardcoded products from `page.jsx` into the Supabase database.

---

## 🔐 2. Authentication & Security
- [ ] **Supabase Auth**: Implement Login and Register pages in `src/app/(auth)/`.
- [ ] **Session Management**: Add Middleware to protect the `/admin` and `/orders` routes.
- [ ] **User Profile**: Update the "U" icon in the navbar to show real user initials and a logout button.

---

## 🛍️ 3. Core Shopping Experience (Real Data)
- [ ] **Connect Homepage**: Fetch products from Prisma instead of using the hardcoded `PRODUCTS` array.
- [ ] **Product Detail Page**: Create `src/app/products/[id]/page.jsx` to show full descriptions.
- [ ] **AR Viewer**: Add `<model-viewer>` to the product detail page for 3D/AR previews.
- [ ] **Persistent Cart**: Save cart items to the database or `localStorage` so they don't disappear on refresh.

---

## 💳 4. Payments & Checkout
- [ ] **Address Validation**: Add a proper form validation for the checkout process.
- [ ] **Razorpay Integration**:
    - [ ] Create `/api/payment/create-order` route.
    - [ ] Add the Razorpay checkout script to the frontend.
    - [ ] Handle payment success webhooks to update order status to "Confirmed".

---

## 🤖 5. Advanced AI Features
- [ ] **Real LLM Chat**: Replace the `getReply` function with an API call to OpenAI or Claude.
- [ ] **Smart Recommender**: Pass the user's quiz answers to an LLM to generate more personalized reasons than the current hardcoded ones.
- [ ] **Personalized Feed**: Implement a basic algorithm to show "Featured Gifts" based on the user's previously viewed categories.

---

## 🛠️ 6. Admin Panel
- [ ] **Product Management**: Build a dashboard to Add, Edit, or Delete products from the database.
- [ ] **Live Order Feed**: Show a list of all successful orders for admin processing.
- [ ] **Analytics**: Add simple charts (using Recharts) to show sales trends.

---

## 🎨 7. Final Polish
- [ ] **Loading States**: Add skeleton loaders while products are fetching from the database.
- [ ] **Responsive Design**: Test and fix any layout issues on small mobile screens (especially the cart table).
- [ ] **SEO**: Add Meta Tags and OpenGraph images for better social sharing.

---

### 💡 Pro-Tip for Demo:
If time is short, prioritize **Authentication** and one **Real Database feature** (like saving an order). Judges value a "Full Stack" flow over a 100% finished UI.
