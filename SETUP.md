# Colesterol Platform — Setup Guide

## Quick Start (Demo Mode)

The app works out of the box with demo data. No Supabase required:

```bash
npm install
npm run dev
```

Visit http://localhost:3000 — all 4 pages work with 14 demo products and 6 demo orders.

---

## Connect to Supabase (Production Mode)

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Name it `colesterol`
4. Set a strong database password
5. Choose a region close to your users (US East or South America)
6. Wait for the project to initialize (~30 seconds)

### Step 2: Run the SQL Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase/schema.sql`
3. Paste it into the SQL Editor and click **Run**
4. This creates all tables: `users`, `products`, `orders`, `delivery_logs`
5. It also enables Realtime on `orders` and `products` tables

### Step 3: Configure Environment Variables

1. In your Supabase dashboard, go to **Settings → API**
2. Copy the **Project URL** and **Anon Key**
3. Copy the **Service Role Key** (keep this secret!)
4. Edit `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=584141234567
```

### Step 4: Seed the Database

Run the seed script to populate 14 products and 3 default users:

```bash
npx tsx supabase/seed-script.ts
```

You should see:
```
🍔 COLESTEROL — Database Seeder

   Supabase URL: https://YOUR-PROJECT-ID.supabase.co

📦 Inserting 14 products...
   ✅ 14 products inserted

👤 Inserting default users...
   ✅ admin@colesterol.ve (admin)
   ✅ cocina@colesterol.ve (kitchen)
   ✅ delivery@colesterol.ve (delivery)

🎉 Seed complete!
```

### Step 5: Verify

1. Run `npm run dev`
2. Open http://localhost:3000
3. The menu should now load products from Supabase
4. Go to http://localhost:3000/admin → Pedidos tab
5. Place a test order and verify it appears in real-time

---

## Default Users

| Email | Role | Purpose |
|-------|------|---------|
| admin@colesterol.ve | Admin | Full access to admin panel |
| cocina@colesterol.ve | Kitchen | Access to KDS (Kitchen Display) |
| delivery@colesterol.ve | Delivery | Access to delivery app |

---

## Deploy to Vercel

### 1. Push to GitHub

```bash
git add -A
git commit -m "Initial setup with Supabase"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Add environment variables (same as `.env.local`)
4. Deploy

### 3. Configure Subdomains

In your DNS provider, add CNAME records:

| Subdomain | Target |
|-----------|--------|
| menu.colesterol.ve | cname.vercel-dns.com |
| pedidos.colesterol.ve | cname.vercel-dns.com |
| delivery.colesterol.ve | cname.vercel-dns.com |
| admin.colesterol.ve | cname.vercel-dns.com |

In Vercel, add each subdomain to your project's domain settings.

---

## Architecture Overview

```
menu.colesterol.ve     → Welcome Screen + Menu (Customer-facing)
pedidos.colesterol.ve  → Kitchen Display System (Staff)
delivery.colesterol.ve → Delivery App (Drivers, PWA-ready)
admin.colesterol.ve    → Dashboard + Orders + Menu Editor + Settings
```

All 4 apps share the same Supabase database with real-time sync via WebSockets.

---

## Troubleshooting

### "No products showing"
- Check `.env.local` has correct Supabase URL and keys
- Run the seed script: `npx tsx supabase/seed-script.ts`
- Check Supabase dashboard → Table Editor → products

### "Real-time not working"
- Verify you ran the full `schema.sql` (includes `ALTER PUBLICATION`)
- Check Supabase dashboard → Database → Replication
- Ensure `orders` and `products` tables are in the publication

### "RLS blocking requests"
- The schema includes RLS policies. For development, you can temporarily disable RLS:
  ```sql
  ALTER TABLE products DISABLE ROW LEVEL SECURITY;
  ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
  ```
- For production, keep RLS enabled and use proper auth
