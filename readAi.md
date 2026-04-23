# 🤖 GiftAI — Project Intelligence Manifest (readAi)
### Comprehensive End-to-End System Documentation

This document provides a highly detailed overview of the **GiftAI** architecture, feature logic, and data flow for understanding by both developers and secondary AI systems.

---

## 🏗️ Core Architecture
GiftAI is a full-stack Next.js 14 application leveraging the App Router. It follows a modular architecture where frontend components use React hooks for state management and communicate with a robust Node.js backend via API routes.

- **Frontend**: Next.js (Client Components), Vanilla CSS (Premium Dark Theme).
- **ORM & Data**: Prisma ORM with a Supabase PostgreSQL backend.
- **Authentication**: Supabase Auth (Session-based via Cookies).
- **Payment Gateway**: Razorpay (Native SDK + Backend Verification).
- **AI Core**: Google Gemini 1.5 Pro API.

---

## 💎 End-to-End Feature Logic

### 1. AI Gift Scout (Concierge)
- **Logic**: A "concierge" system using the Gemini 1.5 Pro model. 
- **User Flow**: Users interact via a persistent chat bubble.
- **AI Instructions**: The AI is prompted to act as a luxury gift scout, analyzing recipient details, occasions, and budgets to recommend specific items from the catalog.
- **Integration**: The chat uses standard fetch requests to `/api/ai/chat` (hidden endpoint logic).

### 2. Personalized Catalog & Scoring
- **Logic**: Every time a user views a product category, that category is added to a "Personalized Feed" list in `localStorage`.
- **Feed Generation**: On the homepage, a `useEffect` hook calculates a score for every product. Products in categories the user has frequently viewed get a higher "Relevance Score" and are displayed in the "Curated For You" section.
- **Fallback**: If no behavior is tracked, the system displays top-rated products by default.

### 3. Shopping Cart & Hydration Strategy
- **Persistence**: Cart items are stored as JSON in `localStorage` under the key `giftai_cart`.
- **Hydration Fix**: To prevent Next.js hydration errors (server-client mismatch), the application initializes with an empty cart and utilizes a `mounted` state guard. The actual cart data is loaded only after the component satisfies `mounted === true` on the client.
- **Functionality**: Local state `cart` manages quantities, removals, and subtotal calculations (with a ₹3,000 free shipping threshold).

### 4. Authentication Barrier & Protected Routes
- **Guest Access**: Guests have full access to browsing and adding items to the cart.
- **The Protected Array**: Routes like `/orders`, `/profile`, and `/admin` are listed in a `PROTECTED` array within `middleware.js`.
- **Middleware Redirection**: 
    - If a guest hits `/admin`, they are redirected to `/admin/login`.
    - If a guest hits `/orders` or `/cart/checkout`, they are redirected to `/login` with a `?redirect=` param.
- **Profile management**: Authenticated users can update their `name`, `phone`, and `address` in the `User` table via the `/api/user/profile` POST endpoint.

### 5. Checkout & Payment Flow (Razorpay + COD)
- **Create Order**: Clicking "Place Order" calls `/api/razorpay/create-order` to generate a native Razorpay Order ID.
- **Verification**: After successful payment, the Razorpay response is sent to `/api/razorpay/verify`. 
- **DB Persistence**: Upon verification, the backend creates a `User` entry (if new), an `Order` entry, and multiple `OrderItem` entries in the Prisma database.
- **Cash on Delivery**: Follows the same persistence logic but bypasses the Razorpay verification step.

### 6. Admin Command Center
- **Security**: The `/api/admin/stats` endpoint performs a server-side check. It queries the Prisma `User` table for the requesting user's ID and verifies that `role === 'ADMIN'`.
- **Data Aggregation**: Statistics are real-time. The dashboard aggregates:
    - **Total Revenue**: `SUM(order.total)`
    - **Active Orders**: `COUNT(order)` where status is not delivered.
    - **Inventory**: Fetches top products and their sales counts from the `Product` table.

---

## 🗄️ Database Schema Summary (Prisma)

- **User**: ID (Supabase Auth reference), Email, Name, Phone, Address, Role (USER/ADMIN).
- **Product**: ID, Name, Price, Category, stock, rating, badge (Pre-curated).
- **Order**: ID, User Connection, Status (placed/confirmed/shipped/delivered), Total, Address, PaymentMethod.
- **OrderItem**: Link between Order and Product, tracking Price and Quantity specifically at the time of purchase.

---

## 🚦 Navigation Rules for AI Agents

- **Homepage**: `/` (Unprotected)
- **AI Recommendation Page**: `/recommend` (Unprotected)
- **Cart**: `/cart` (Unprotected)
- **User Login**: `/login` (Unprotected)
- **Admin Login**: `/admin/login` (Unprotected)
- **User Orders**: `/orders` (Requires `USER` or `ADMIN` session)
- **User Profile**: `/profile` (Requires `USER` or `ADMIN` session)
- **Admin Dashboard**: `/admin` (Requires `ADMIN` role check)

---
*This file is designed as a context-injector for AI systems assisting in the development or maintenance of GiftAI.*
