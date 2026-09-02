/**
 * COLESTEROL — Database Seed Script (Supabase JS Client)
 *
 * Usage:
 *   1. Fill in your Supabase URL and Service Role Key in .env.local
 *   2. Run: npx tsx supabase/seed-script.ts
 *
 * This populates the database with all 14 products and 3 default users.
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load env vars from .env.local
const envPath = path.resolve(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env: Record<string, string> = {};
envContent.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const [key, ...rest] = trimmed.split('=');
  env[key.trim()] = rest.join('=').trim();
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || SUPABASE_URL.includes('your-')) {
  console.error('\n❌ Supabase URL not configured in .env.local');
  console.error('   Edit .env.local and set NEXT_PUBLIC_SUPABASE_URL\n');
  process.exit(1);
}

if (!SERVICE_ROLE_KEY || SERVICE_ROLE_KEY.includes('your-')) {
  console.error('\n❌ Service Role Key not configured in .env.local');
  console.error('   Edit .env.local and set SUPABASE_SERVICE_ROLE_KEY\n');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// ============================================
// PRODUCT DATA
// ============================================

const PRODUCTS = [
  // BURGERS
  {
    name: 'La Colesterol',
    description: 'Nuestra insignia. Doble carne, doble queso cheddar, bacon crocante, cebolla caramelizada y salsa secreta Colesterol.',
    price: 8.50,
    category: 'burgers',
    is_featured: true,
    prep_time_minutes: 12,
    sort_order: 1,
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
    customizations: [
      {
        name: 'Termino de carne',
        type: 'single',
        required: true,
        options: [
          { name: 'Medio', price: 0 },
          { name: 'Termino medio', price: 0 },
          { name: 'Bien cocido', price: 0 },
        ],
      },
      {
        name: 'Extras',
        type: 'multiple',
        required: false,
        options: [
          { name: 'Tocineta extra', price: 1.50 },
          { name: 'Queso extra', price: 1.00 },
          { name: 'Guacamole', price: 1.50 },
        ],
      },
    ],
    ingredients_to_remove: ['cebolla', 'lechuga', 'tomate', 'bacon'],
  },
  {
    name: 'Smash Burger',
    description: 'Carne smash a la plancha, queso Americano, pickles, cebolla fresca y special sauce.',
    price: 6.50,
    category: 'burgers',
    is_featured: true,
    prep_time_minutes: 10,
    sort_order: 2,
    image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80',
    customizations: [
      {
        name: 'Termino de carne',
        type: 'single',
        required: true,
        options: [
          { name: 'Medio', price: 0 },
          { name: 'Termino medio', price: 0 },
          { name: 'Bien cocido', price: 0 },
        ],
      },
      {
        name: 'Extras',
        type: 'multiple',
        required: false,
        options: [
          { name: 'Doble carne', price: 3.00 },
          { name: 'Queso extra', price: 1.00 },
        ],
      },
    ],
    ingredients_to_remove: ['pickles', 'cebolla'],
  },
  {
    name: 'BBQ Bacon Burger',
    description: 'Carne Angus, bacon, aros de cebolla, queso pepper jack y salsa BBQ ahumada.',
    price: 9.00,
    category: 'burgers',
    is_featured: false,
    prep_time_minutes: 12,
    sort_order: 3,
    image_url: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&q=80',
    customizations: [
      {
        name: 'Termino de carne',
        type: 'single',
        required: true,
        options: [
          { name: 'Medio', price: 0 },
          { name: 'Termino medio', price: 0 },
          { name: 'Bien cocido', price: 0 },
        ],
      },
    ],
    ingredients_to_remove: ['cebolla', 'bacon'],
  },
  {
    name: 'Pollo Crispy',
    description: 'Pechuga de pollo empanizada, lechuga, tomate, mayonesa y pickles en bun brioche.',
    price: 7.00,
    category: 'burgers',
    is_featured: false,
    prep_time_minutes: 10,
    sort_order: 4,
    image_url: 'https://images.unsplash.com/photo-1606756790138-261d2b101820?w=600&q=80',
    customizations: [
      {
        name: 'Salsa',
        type: 'single',
        required: false,
        options: [
          { name: 'Mayonesa', price: 0 },
          { name: 'BBQ', price: 0 },
          { name: 'Buffalo', price: 0.50 },
        ],
      },
    ],
    ingredients_to_remove: ['lechuga', 'tomate', 'pickles'],
  },

  // ENTRADAS
  {
    name: 'Loaded Fries',
    description: 'Papas fritas crocantes con queso cheddar derretido, bacon y chives.',
    price: 5.50,
    category: 'appetizers',
    is_featured: true,
    prep_time_minutes: 8,
    sort_order: 10,
    image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80',
    customizations: [],
    ingredients_to_remove: [],
  },
  {
    name: 'Onion Rings',
    description: 'Aros de cebolla empanizados con dip de queso cheddar.',
    price: 4.50,
    category: 'appetizers',
    is_featured: false,
    prep_time_minutes: 7,
    sort_order: 11,
    image_url: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&q=80',
    customizations: [],
    ingredients_to_remove: [],
  },
  {
    name: 'Chicken Wings',
    description: '6 alitas de pollo con salsa a elegir: BBQ, Buffalo o Honey Mustard.',
    price: 6.00,
    category: 'appetizers',
    is_featured: true,
    prep_time_minutes: 12,
    sort_order: 12,
    image_url: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&q=80',
    customizations: [
      {
        name: 'Salsa',
        type: 'single',
        required: true,
        options: [
          { name: 'BBQ', price: 0 },
          { name: 'Buffalo', price: 0 },
          { name: 'Honey Mustard', price: 0 },
        ],
      },
    ],
    ingredients_to_remove: [],
  },

  // ACOMPAÑAMIENTOS
  {
    name: 'Papas Fritas',
    description: 'Papas fritas crocantes con sal y seasoning especial.',
    price: 3.00,
    category: 'sides',
    is_featured: false,
    prep_time_minutes: 5,
    sort_order: 20,
    image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80',
    customizations: [],
    ingredients_to_remove: [],
  },
  {
    name: 'Aros de Cebolla',
    description: 'Crujientes aros de cebolla con dip ranch.',
    price: 3.50,
    category: 'sides',
    is_featured: false,
    prep_time_minutes: 6,
    sort_order: 21,
    image_url: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&q=80',
    customizations: [],
    ingredients_to_remove: [],
  },

  // BEBIDAS
  {
    name: 'Coca-Cola',
    description: 'Coca-Cola bien fria 355ml.',
    price: 1.50,
    category: 'drinks',
    is_featured: false,
    prep_time_minutes: 1,
    sort_order: 30,
    image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80',
    customizations: [],
    ingredients_to_remove: [],
  },
  {
    name: 'Sprite',
    description: 'Sprite bien fria 355ml.',
    price: 1.50,
    category: 'drinks',
    is_featured: false,
    prep_time_minutes: 1,
    sort_order: 31,
    image_url: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=600&q=80',
    customizations: [],
    ingredients_to_remove: [],
  },
  {
    name: 'Malta',
    description: 'Malta Regional bien fria.',
    price: 1.50,
    category: 'drinks',
    is_featured: false,
    prep_time_minutes: 1,
    sort_order: 32,
    image_url: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=600&q=80',
    customizations: [],
    ingredients_to_remove: [],
  },
  {
    name: 'Agua',
    description: 'Agua pura 600ml.',
    price: 1.00,
    category: 'drinks',
    is_featured: false,
    prep_time_minutes: 1,
    sort_order: 33,
    image_url: 'https://images.unsplash.com/photo-1523362628745-0c100fc988a6?w=600&q=80',
    customizations: [],
    ingredients_to_remove: [],
  },

  // POSTRES
  {
    name: 'Brownie con Helado',
    description: 'Brownie de chocolate caliente con bola de helado de vainilla.',
    price: 4.50,
    category: 'desserts',
    is_featured: false,
    prep_time_minutes: 5,
    sort_order: 40,
    image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80',
    customizations: [
      {
        name: 'Helado',
        type: 'single',
        required: true,
        options: [
          { name: 'Vainilla', price: 0 },
          { name: 'Chocolate', price: 0 },
          { name: 'Fresa', price: 0 },
        ],
      },
    ],
    ingredients_to_remove: [],
  },

  // COMBOS
  {
    name: 'Combo Colesterol',
    description: 'La Colesterol + Papas Fritas + Bebida. La experiencia completa.',
    price: 12.00,
    category: 'combos',
    is_featured: true,
    prep_time_minutes: 15,
    sort_order: 50,
    image_url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&q=80',
    customizations: [
      {
        name: 'Termino de carne',
        type: 'single',
        required: true,
        options: [
          { name: 'Medio', price: 0 },
          { name: 'Termino medio', price: 0 },
          { name: 'Bien cocido', price: 0 },
        ],
      },
      {
        name: 'Bebida',
        type: 'single',
        required: true,
        options: [
          { name: 'Coca-Cola', price: 0 },
          { name: 'Sprite', price: 0 },
          { name: 'Malta', price: 0 },
          { name: 'Agua', price: 0 },
        ],
      },
    ],
    ingredients_to_remove: ['cebolla', 'lechuga', 'tomate'],
  },
  {
    name: 'Combo Smash',
    description: 'Smash Burger + Loaded Fries + Bebida.',
    price: 10.50,
    category: 'combos',
    is_featured: false,
    prep_time_minutes: 12,
    sort_order: 51,
    image_url: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&q=80',
    customizations: [
      {
        name: 'Bebida',
        type: 'single',
        required: true,
        options: [
          { name: 'Coca-Cola', price: 0 },
          { name: 'Sprite', price: 0 },
          { name: 'Malta', price: 0 },
        ],
      },
    ],
    ingredients_to_remove: [],
  },
];

const USERS = [
  { email: 'admin@colesterol.ve', full_name: 'Admin Colesterol', phone: '04141234567', role: 'admin' },
  { email: 'cocina@colesterol.ve', full_name: 'Cocinero', phone: '04141234568', role: 'kitchen' },
  { email: 'delivery@colesterol.ve', full_name: 'Repartidor Demo', phone: '04141234569', role: 'delivery' },
];

// ============================================
// SEED FUNCTION
// ============================================

async function seed() {
  console.log('\n🍔 COLESTEROL — Database Seeder\n');
  console.log(`   Supabase URL: ${SUPABASE_URL}\n`);

  // 1. Check if products already exist
  const { data: existingProducts } = await supabase
    .from('products')
    .select('id')
    .limit(1);

  if (existingProducts && existingProducts.length > 0) {
    console.log('⚠️  Products table already has data. Skipping product seed.\n');
    console.log('   To re-seed, first run this SQL:\n');
    console.log('   DELETE FROM products WHERE id::text LIKE \'demo-%\';\n');
  } else {
    // 2. Insert products
    console.log(`📦 Inserting ${PRODUCTS.length} products...`);

    const productsToInsert = PRODUCTS.map((p) => ({
      ...p,
      id: `demo-${p.sort_order}`,
      is_available: true,
      customizations: JSON.stringify(p.customizations),
    }));

    const { data, error } = await supabase
      .from('products')
      .upsert(productsToInsert, { onConflict: 'id' })
      .select();

    if (error) {
      console.error('❌ Error inserting products:', error.message);
      console.error('   Make sure you ran supabase/schema.sql first!\n');
    } else {
      console.log(`   ✅ ${data?.length || 0} products inserted\n`);
    }
  }

  // 3. Insert users
  console.log('👤 Inserting default users...');

  for (const user of USERS) {
    const { error } = await supabase
      .from('users')
      .upsert(user, { onConflict: 'email' });

    if (error) {
      console.error(`   ❌ Error inserting ${user.email}:`, error.message);
    } else {
      console.log(`   ✅ ${user.email} (${user.role})`);
    }
  }

  console.log('\n🎉 Seed complete!\n');
  console.log('   Next steps:');
  console.log('   1. Go to your Supabase dashboard → Table Editor');
  console.log('   2. Verify products appear in the products table');
  console.log('   3. Run the app: npm run dev');
  console.log('   4. Products should load from Supabase instead of demo data\n');
}

seed().catch(console.error);
