# 🍔 Colesterol — Ultra-Premium Digital Platform

> La experiencia gastronómica más underground de Venezuela.

A full-stack restaurant platform built with **Next.js 14**, **Supabase**, and **Tailwind CSS**. Apple-inspired design, real-time order synchronization, and a complete ecosystem for customers, kitchen, delivery drivers, and admins.

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    COLESTEROL ECOSYSTEM                         │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│ menu.colesterol │ pedidos.colesterol │ delivery.colesterol │ admin.colesterol │
│   Menú Digital │   Kitchen Display  │   Delivery Driver   │   Admin Dashboard│
│   ──────────  │   ──────────────   │   ──────────────    │   ────────────── │
│   Next.js     │   Next.js          │   PWA               │   Next.js        │
│   Framer      │   Real-time WS     │   Google Maps       │   Recharts       │
│   Zustand     │   Sound Alerts     │   Swipe-to-Deliver  │   Toggle Stock   │
├──────────────┴──────────────┴──────────────┴───────────────────┤
│                        SUPABASE                                │
│   PostgreSQL │ Realtime WebSockets │ Row Level Security        │
└──────────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
colesterol-platform/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (Apple Noir)
│   │   ├── globals.css             # Glassmorphism + Apple design system
│   │   ├── page.tsx                # Menu landing (menu.colesterol.ve)
│   │   ├── pedidos/
│   │   │   └── page.tsx            # Kitchen Display System
│   │   ├── delivery/
│   │   │   └── page.tsx            # Driver PWA
│   │   └── admin/
│   │       └── page.tsx            # Admin Dashboard
│   ├── components/
│   │   ├── ui/
│   │   │   ├── ProductCard.tsx     # Apple-style product card
│   │   │   ├── ProductModal.tsx    # Full-screen customization modal
│   │   │   ├── CartDrawer.tsx      # Slide-up cart
│   │   │   ├── Checkout.tsx        # One-tap checkout flow
│   │   │   └── CategoryFilter.tsx  # Animated category pills
│   │   └── kds/
│   │       └── OrderCard.tsx       # KDS order card with urgency colors
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser Supabase client
│   │   │   ├── server.ts           # Server Supabase client
│   │   │   └── realtime.ts         # Real-time hooks + mutations
│   │   ├── utils.ts                # cn(), formatPrice(), etc.
│   │   └── whatsapp.ts            # Pre-rendered WhatsApp messages
│   ├── stores/
│   │   └── cart.ts                 # Zustand cart with persistence
│   └── types/
│       └── index.ts                # Full TypeScript type system
├── supabase/
│   ├── schema.sql                  # Complete database schema
│   └── seed.ts                     # Menu seed data (17 products)
├── package.json
├── tailwind.config.ts              # Brand colors + Apple tokens
├── tsconfig.json                   # Path aliases
└── next.config.js
```

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `cholesterol-yellow` | `#FFC700` | Primary accent, CTAs, prices |
| `cholesterol-black` | `#000000` | Background |
| `cholesterol-gray` | `#1C1C1E` | Cards, surfaces |
| `cholesterol-green` | `#32D74B` | Success states |
| `cholesterol-red` | `#FF453A` | Urgency, errors |
| Border radius | `22px` | All cards (squircle) |

### Glassmorphism Classes
- `.glass` — Standard glass card
- `.glass-strong` — Darker, more opaque
- `.glass-card` — Product cards with shadow

## 🚀 Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 3. Run Supabase schema
# Copy supabase/schema.sql into Supabase SQL Editor and run

# 4. Seed products
npx tsx supabase/seed.ts | psql $DATABASE_URL
# Or paste the output into Supabase SQL Editor

# 5. Start dev server
npm run dev
```

### Routes
- `localhost:3000` → Menu / Landing
- `localhost:3000/pedidos` → Kitchen Display System
- `localhost:3000/delivery` → Delivery Driver App
- `localhost:3000/admin` → Admin Dashboard

## ⚡ Real-time Flow

```
Customer places order
        │
        ▼
  ┌─────────────┐     WebSocket      ┌─────────────────┐
  │  Supabase   │ ──────────────────→ │  Kitchen (KDS)  │
  │  PostgreSQL  │                    │  Order appears   │
  └─────────────┘                    │  instantly        │
        │                            │  🔔 Sound alert  │
        │                            └────────┬────────┘
        │                                     │
        │                            Kitchen marks "Ready"
        │                                     │
        │                                     ▼
        │                            ┌─────────────────┐
        │                            │  Delivery App    │
        │                            │  New order       │
        │                            │  appears         │
        │                            └────────┬────────┘
        │                                     │
        │                            Driver delivers
        │                                     │
        ▼                                     ▼
  ┌─────────────┐                    ┌─────────────────┐
  │  Admin      │                    │  Delivery Log   │
  │  Dashboard  │                    │  Proof of       │
  │  Live stats │                    │  delivery       │
  └─────────────┘                    └─────────────────┘
```

## 📦 Key Technologies

- **Next.js 14** — App Router, Server Components, middleware
- **Supabase** — PostgreSQL, Realtime, Row Level Security
- **Tailwind CSS** — Utility-first with custom design tokens
- **Framer Motion** — 60fps animations, spring physics
- **Zustand** — Lightweight state with persistence
- **Recharts** — Apple Health-style charts
- **Lucide** — SF Symbols-style icons
- **Sonner** — Toast notifications

## 📄 License

Private — Colesterol Restaurant © 2024
