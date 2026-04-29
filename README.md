# GiftAI ✨

### AI-Powered Luxury Gift Recommendations & Smart E-Commerce Platform

GiftAI is a next-generation AI-driven e-commerce platform designed to eliminate the stress of finding the perfect gift. By combining **luxury product curation** with **Google Gemini AI intelligence**, **smart group payments**, and a **luxury shopping experience**, the platform delivers a personalized concierge experience tailored to the user's intent, emotions, and budget.

**🚀 Live Demo:** [https://gift-ai-shop.vercel.app](https://gift-ai-shop.vercel.app)

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Database](#database)
- [Project Structure](#-project-structure)
- [API Routes](#-api-routes)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [How It Works](#-how-it-works)
- [Hackathon Q&A](#-hackathon-qa)
- [Future Roadmap](#-future-roadmap)

---

## 🌍 Problem Statement

Choosing the right gift is often:

- **Time-consuming** - Hours spent browsing generic products
- **Emotionally uncertain** - Will they like it? Is it appropriate?
- **Financially awkward** - Group gifts require collecting money from multiple people
- **Overwhelming** - Too many choices, no personalization

Most platforms focus on **products**, not **intent**. Users struggle to translate feelings (appreciation, celebration, love) into meaningful gifts.

---

## 💡 Solution

GiftAI bridges this gap through:

1. **AI-Powered Gift Concierge** - Natural language understanding for personalized recommendations
2. **Split Payments** - Easy group gifting with automatic payment link generation
3. **Luxury Experience** - Premium UI/UX that matches the quality of products
4. **Smart Notifications** - Real-time order tracking and delivery updates

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | JavaScript |
| **Styling** | Vanilla CSS (Luxury Dark Theme) |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Prisma |
| **Auth** | Supabase Auth |
| **AI Engine** | Google Gemini 1.5 Pro |
| **Payments** | Razorpay (UPI, Cards, Netbanking, COD) |
| **Email** | Nodemailer |
| **SMS** | Twilio |

---

## 🎯 Key Features

### 🤖 1. AI Gift Scout (Smart Concierge)
- **Real-time conversational AI** powered by Google Gemini
- **Context-aware recommendations** based on occasion, budget, recipient
- **Product catalog integration** - AI knows all 25+ products with prices
- **Natural language processing** - "Luxury eco-friendly gift under ₹4000 for graduation"
- **Fallback recommendations** when API is unavailable

### 💰 2. Split Payments (Group Gifting)
- **Create group gifts** - Split any order among multiple people
- **Automatic Razorpay links** - Each participant gets a unique payment link
- **Real-time tracking** - See who has paid, who is pending
- **Payment notifications** - Email confirmations for all participants
- **Expiry handling** - Links expire after set time with cleanup

### 🛍️ 3. E-Commerce Core
- **25+ curated luxury products** across 10 categories
- **Smart cart** - Persistent across sessions
- **Guest checkout** - No account required to browse
- **COD & Online payments** - Multiple payment options
- **Order tracking** - Status updates (Pending → Packed → Shipped → Delivered)

### 📊 4. Admin Dashboard
- **Role-based access** - USER / ADMIN / OWNER roles
- **Real-time analytics** - Revenue, orders, users
- **Product management** - Add, edit, disable products
- **Order management** - Update status, add tracking IDs
- **Notification system** - Send updates to customers

### 🔔 5. Notification System
- **Multi-channel alerts** - In-app and email
- **Order lifecycle** - Confirmed, Packed, Shipped, Delivered
- **Payment updates** - Split payment status changes
- **Real-time badges** - Unread count on UI

---

## 🏗️ Architecture

### Frontend

```
src/app/
├── (auth)/                    # Authentication routes
│   ├── login/page.jsx        # User login
│   └── register/page.jsx     # User registration
├── admin/                     # Admin panel
│   ├── login/page.jsx        # Admin auth
│   ├── page.jsx              # Dashboard overview
│   ├── products/page.jsx     # Product management
│   └── orders/page.jsx       # Order management
├── api/                       # API routes (see below)
├── cart/page.jsx             # Shopping cart + checkout
├── orders/page.jsx           # User order history
├── products/[id]/page.jsx    # Product detail page
├── profile/page.jsx          # User profile
├── recommend/page.jsx        # AI recommendation interface
├── split-payment/            # Group payment flow
│   ├── page.jsx              # Create split payment
│   ├── [id]/page.jsx         # Payment status page
│   └── success/page.jsx      # Success confirmation
└── page.jsx                  # Homepage + AI chat
```

**Frontend Architecture:**
- **Next.js App Router** - Server-side rendering for SEO
- **Client Components** - Interactive UI with React hooks
- **Supabase Auth Helpers** - Session management
- **Custom CSS** - No UI libraries, pure luxury aesthetic
- **Responsive Design** - Mobile-first approach

### Backend

**API Routes Structure:**

```
src/app/api/
├── admin/
│   ├── check/route.js        # Verify admin role
│   ├── notifications/route.js # Admin notification API
│   ├── orders/route.js       # Order management API
│   ├── products/route.js     # CRUD for products
│   └── stats/route.js        # Analytics data
├── auth/sync/route.js        # Sync auth users to DB
├── chat/route.js            # Gemini AI integration
├── orders/
│   ├── create/route.js      # Create order
│   └── route.js             # Get user orders
├── razorpay/
│   ├── create-order/route.js # Create Razorpay order
│   ├── verify/route.js      # Payment verification
│   └── webhook/route.js     # Razorpay webhooks
├── recommend/route.js       # AI recommendations
├── split-payment/
│   ├── create/route.js      # Create split payment
│   ├── manual-update/route.js # Manual payment sync
│   ├── my-payments/route.js # User's split payments
│   └── status/[id]/route.js # Get payment status
└── user/profile/route.js    # User profile API
```

**Backend Patterns:**
- **Route Handlers** - Next.js App Router API routes
- **Prisma ORM** - Type-safe database queries
- **Supabase Auth** - JWT token validation
- **Razorpay SDK** - Payment processing
- **Google Generative AI** - Gemini API integration

### Database

**Prisma Schema Overview:**

```prisma
model User {
  id            String         @id @default(uuid())
  email         String         @unique
  name          String?
  phone         String?
  address       String?
  role          String         @default("USER") // USER | ADMIN | OWNER
  createdAt     DateTime       @default(now())
  orders        Order[]
  notifications Notification[]
}

model Product {
  id         Int         @id @default(autoincrement())
  name       String
  price      Int
  category   String
  tags       String[]
  rating     Float       @default(4.5)
  reviews    Int         @default(0)
  image      String
  badge      String?
  desc       String
  stock      Int         @default(100)
  isActive   Boolean     @default(true)
  orderItems OrderItem[]
}

model Order {
  id            String         @id @default(uuid())
  userId        String?
  status        String         @default("pending")
  total         Int
  address       String
  paymentMethod String
  paymentId     String?
  trackingId    String?
  items         OrderItem[]
  notifications Notification[]
  splitPayment  SplitPayment?
}

model OrderItem {
  id        Int     @id @default(autoincrement())
  orderId   String
  productId Int
  qty       Int
  price     Int
}

model SplitPayment {
  id              String                   @id @default(uuid())
  orderId         String?                  @unique
  initiatorId     String
  initiatorName   String
  initiatorEmail  String
  totalAmount     Int
  status          String                   @default("pending")
  cartItems       Json
  address         String
  participants    SplitPaymentParticipant[]
}

model SplitPaymentParticipant {
  id              String       @id @default(uuid())
  splitPaymentId  String
  email           String
  amount          Int
  razorpayLinkId  String?
  paymentLink     String?
  status          String       @default("pending")
  paidAt          DateTime?
}

model Notification {
  id        String   @id @default(uuid())
  userId    String
  orderId   String?
  template  String   // ORDER_CONFIRMED | ORDER_PACKED | ORDER_SHIPPED | ORDER_DELIVERED
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

**Database Design Principles:**
- **UUID for users/orders** - Secure, non-sequential IDs
- **Auto-increment for products** - Easy SKU management
- **JSON fields** - Flexible cart storage in split payments
- **Cascading deletes** - Clean up related records
- **Indexes** - Performance optimization on frequently queried fields

---

## 📁 Project Structure

```
Gift-Ai-Shop/
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.js               # Seed data (optional)
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/           # Auth group routes
│   │   ├── admin/            # Admin panel
│   │   ├── api/              # API routes
│   │   ├── cart/             # Cart page
│   │   ├── orders/           # Order history
│   │   ├── products/         # Product pages
│   │   ├── profile/          # User profile
│   │   ├── recommend/        # AI interface
│   │   ├── split-payment/    # Group payments
│   │   ├── layout.jsx        # Root layout
│   │   └── page.jsx          # Homepage
│   ├── components/           # React components
│   ├── controllers/          # Business logic
│   │   └── orderController.js
│   ├── lib/                  # Utilities
│   │   ├── prisma.js         # Prisma client
│   │   └── supabase.js       # Supabase client
│   └── middleware.js         # Auth middleware
├── .env                      # Environment variables
├── next.config.js            # Next.js config
├── package.json              # Dependencies
└── README.md                 # This file
```

---

## 🌐 API Routes

### Authentication
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/sync` | Sync Supabase auth user to Prisma DB |

### AI & Recommendations
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/chat` | Gemini AI chat endpoint |
| POST | `/api/recommend` | Get AI gift recommendations |

### Products
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/products` | Get all products (admin) |
| POST | `/api/admin/products` | Create product |
| PATCH | `/api/admin/products` | Update product |

### Orders
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/orders` | Get user's orders |
| POST | `/api/orders/create` | Create new order |
| GET | `/api/admin/orders` | Get all orders (admin) |
| PATCH | `/api/admin/orders` | Update order status |

### Payments
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/razorpay/create-order` | Create Razorpay order |
| POST | `/api/razorpay/verify` | Verify payment |
| POST | `/api/razorpay/webhook` | Webhook handler |
| POST | `/api/split-payment/create` | Create group payment |
| GET | `/api/split-payment/status/[id]` | Get payment status |
| POST | `/api/split-payment/manual-update` | Manual payment update |

### User
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/user/profile` | Get user profile |
| PATCH | `/api/user/profile` | Update profile |

### Admin
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/check` | Verify admin role |
| GET | `/api/admin/stats` | Get dashboard stats |
| GET | `/api/admin/notifications` | Get notifications |
| POST | `/api/admin/notifications` | Create notification |

---

## ⚙️ Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase recommended)
- Razorpay account
- Supabase account
- Google AI Studio API key

### Steps

1. **Clone the repository**
```bash
git clone <repo-url>
cd Gift-Ai-Shop
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. **Push database schema**
```bash
npx prisma db push
```

5. **Generate Prisma client**
```bash
npx prisma generate
```

6. **Run development server**
```bash
npm run dev
```

7. **Open in browser**
```
http://localhost:3000
```

---

## 🔑 Environment Variables

```env
# Database
DATABASE_URL="postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON_KEY]"
SUPABASE_SERVICE_ROLE_KEY="[SERVICE_ROLE_KEY]"

# Razorpay
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="[SECRET]"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."

# Google Gemini
GEMINI_API_KEY="AI..."

# Email (Optional - for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="[EMAIL]"
SMTP_PASS="[PASSWORD]"
FROM_EMAIL="noreply@giftai.com"

# Twilio (Optional - for SMS)
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="[TOKEN]"
TWILIO_PHONE_NUMBER="+1234567890"
```

---

## 🔄 How It Works

### User Journey

1. **Landing** → User sees AI chat interface
2. **AI Consultation** → Ask for gift recommendations
3. **Browse** → View products or go directly to product page
4. **Cart** → Add items, adjust quantities
5. **Checkout** → Login required, enter address
6. **Payment** → Choose COD or Razorpay
7. **Tracking** → Real-time order status updates

### Group Payment Flow

1. **Create Split** → User enters participant emails & amounts
2. **Generate Links** → Razorpay payment links created for each
3. **Share** → Links sent to participants
4. **Track** → Real-time status of who paid
5. **Complete** → When all paid, order is placed

### Admin Flow

1. **Login** → Secure admin authentication
2. **Dashboard** → View analytics and stats
3. **Products** → Manage catalog
4. **Orders** → Update status, add tracking
5. **Notifications** → Send updates to users

---

## 🎓 Hackathon Q&A

### Technical Questions

**Q: Why Next.js over React?**
A: Next.js provides SSR for SEO, API routes (no separate backend needed), and App Router for better performance. Perfect for hackathons - single codebase, full-stack.

**Q: Why Prisma instead of raw SQL?**
A: Type safety, automatic migrations, and query optimization. The schema acts as single source of truth.

**Q: How does the AI recommendation work?**
A: Google Gemini processes natural language with a product catalog context. It matches user intent (occasion, budget, recipient) to available products.

**Q: How are split payments secure?**
A: Each participant gets a unique Razorpay link. Webhooks verify payments server-side. No sensitive data stored.

**Q: What's the authentication flow?**
A: Supabase Auth handles JWT tokens. Middleware protects routes. User data synced to Prisma for relational queries.

### Business Questions

**Q: What's the unique value proposition?**
A: AI-driven intent matching + group payments. No other gift platform combines both seamlessly.

**Q: Who is the target market?**
A: Urban professionals 25-40, looking for premium gifts with convenience.

**Q: How does this scale?**
A: Serverless architecture (Vercel + Supabase) auto-scales. Razorpay handles payment volume.

**Q: What's the revenue model?**
A: Commission on sales + premium AI concierge subscription (future).

### Implementation Questions

**Q: How long did this take to build?**
A: ~2-3 weeks for full MVP with AI, payments, and admin.

**Q: What's the hardest technical challenge?**
A: Split payment state management across multiple Razorpay webhooks and ensuring data consistency.

**Q: How do you handle errors?**
A: Try-catch blocks, fallback AI responses, toast notifications, and graceful degradation.

### Future Questions

**Q: What's next for GiftAI?**
A: Voice AI, AR gift preview, ML-based recommendation engine, international shipping.

**Q: How would you add AR features?**
A: Integration with @google/model-viewer for 3D product preview (was planned, removed for stability).

---

## 🚀 Future Roadmap

### Phase 1: Enhancement (Completed)
- ✅ AI Chat Interface
- ✅ Split Payments
- ✅ Admin Dashboard
- ✅ Notification System

### Phase 2: Scale
- 🔄 Voice-based AI assistant
- 🔄 ML recommendation engine (user behavior analysis)
- 🔄 International shipping integration
- 🔄 Mobile app (React Native)

### Phase 3: Innovation
- ⏳ AR gift unboxing experience
- ⏳ Social gifting (wishlists, registries)
- ⏳ Gift subscription boxes
- ⏳ AI-generated gift wrapping designs

---

## 🎨 Design Philosophy

**Luxury Minimalism UI:**

| Element | Value |
|---------|-------|
| Background | Deep Espresso (#0A0804) |
| Surface | Rich Brown (#13110C) |
| Card | Mocha (#1A1710) |
| Border | Olive Border (#2E2A1E) |
| Accent | Antique Gold (#C9A84C) |
| Muted | Bronze (#6B6248) |

**Typography:**
- **Cormorant Garamond** - Headlines (elegance)
- **Nunito** - Body text (readability)

**UX Principles:**
- Glassmorphism effects
- Micro-interactions on buttons
- Smooth page transitions
- Mobile-first responsive design
- Accessible color contrast

---

## 📊 Access Control Matrix

| Feature | Guest | User | Admin |
|---------|-------|------|-------|
| Browse Products | ✅ | ✅ | ✅ |
| AI Chat | ✅ | ✅ | ✅ |
| Add to Cart | ✅ | ✅ | ✅ |
| Checkout | ❌ | ✅ | ✅ |
| Profile | ❌ | ✅ | ✅ |
| Orders | ❌ | ✅ | ✅ |
| Split Payment | ❌ | ✅ | ✅ |
| Admin Panel | ❌ | ❌ | ✅ |
| Product CRUD | ❌ | ❌ | ✅ |
| Order Management | ❌ | ❌ | ✅ |

---

## 🏆 Hackathon Value

GiftAI is not just an e-commerce app — it is an **AI-driven decision-making system** that transforms gifting into an intelligent, emotional, and personalized experience.

**Key Differentiators:**
1. **AI + Commerce** - Not just recommendations, but conversational understanding
2. **Social Payments** - Group gifting made effortless
3. **Luxury UX** - Premium feel attracts premium customers
4. **Full-Stack** - Frontend, backend, database, AI, payments — all working together

---

## 👥 Team

Built with ❤️ for Next-Gen E-Commerce Hackathon 🚀

**© 2024 GiftAI Team**

---

## 📞 Support

For issues or questions:
1. Check the [Troubleshooting Guide](#troubleshooting)
2. Open an issue on GitHub
3. Contact the team

---

## 🔧 Troubleshooting

### Common Issues

**"Database connection error"**
- Verify `DATABASE_URL` format
- Check Supabase connection pooling settings
- Ensure IP is allowlisted

**"Razorpay payment failed"**
- Verify keys are correct (test vs live)
- Check webhook URL is accessible
- Verify amount is in paise (×100)

**"AI not responding"**
- Check `GEMINI_API_KEY` is valid
- Verify API quota not exceeded
- Check browser console for errors

**"Admin access denied"**
- User must have `role: "ADMIN"` or `"OWNER"` in database
- Check middleware is properly configured

---

## 📄 License

MIT License - feel free to use this project for learning or your own hackathons!

---

**⭐ Star this repo if you found it helpful!**
