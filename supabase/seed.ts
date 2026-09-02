/**
 * COLESTEROL — Database Seed Data
 *
 * Run with: npx tsx supabase/seed.ts
 *
 * This creates the initial product catalog for the restaurant.
 */

const PRODUCTS = [
  // ============================================
  // BURGERS
  // ============================================
  {
    name: 'La Colesterol',
    description: 'Nuestra insignia. Doble carne, doble queso cheddar, bacon crocante, cebolla caramelizada y salsa secreta Colesterol.',
    price: 8.50,
    category: 'burgers',
    is_featured: true,
    prep_time_minutes: 12,
    sort_order: 1,
    customizations: JSON.stringify([
      {
        name: 'Término de carne',
        type: 'single',
        required: true,
        options: [
          { name: 'Medio', price: 0 },
          { name: 'Término medio', price: 0 },
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
    ]),
    ingredients_to_remove: '{cebolla,lechuga,tomate,bacon}',
  },
  {
    name: 'Smash Burger',
    description: 'Carne smash a la plancha, queso Americano, pickles, cebolla fresca y special sauce.',
    price: 6.50,
    category: 'burgers',
    is_featured: true,
    prep_time_minutes: 10,
    sort_order: 2,
    customizations: JSON.stringify([
      {
        name: 'Término de carne',
        type: 'single',
        required: true,
        options: [
          { name: 'Medio', price: 0 },
          { name: 'Término medio', price: 0 },
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
    ]),
    ingredients_to_remove: '{pickles,cebolla}',
  },
  {
    name: 'BBQ Bacon Burger',
    description: 'Carne Angus, bacon, aros de cebolla, queso pepper jack y salsa BBQ ahumada.',
    price: 9.00,
    category: 'burgers',
    is_featured: false,
    prep_time_minutes: 12,
    sort_order: 3,
    customizations: JSON.stringify([
      {
        name: 'Término de carne',
        type: 'single',
        required: true,
        options: [
          { name: 'Medio', price: 0 },
          { name: 'Término medio', price: 0 },
          { name: 'Bien cocido', price: 0 },
        ],
      },
    ]),
    ingredients_to_remove: '{cebolla,bacon}',
  },
  {
    name: 'Pollo Crispy',
    description: 'Pechuga de pollo empanizada, lechuga, tomate, mayonesa y pickles en bun brioche.',
    price: 7.00,
    category: 'burgers',
    is_featured: false,
    prep_time_minutes: 10,
    sort_order: 4,
    customizations: JSON.stringify([
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
    ]),
    ingredients_to_remove: '{lechuga,tomate,pickles}',
  },

  // ============================================
  // ENTRADAS
  // ============================================
  {
    name: 'Loaded Fries',
    description: 'Papas fritas crocantes con queso cheddar derretido, bacon y chives.',
    price: 5.50,
    category: 'appetizers',
    is_featured: true,
    prep_time_minutes: 8,
    sort_order: 10,
    customizations: JSON.stringify([]),
    ingredients_to_remove: '{}',
  },
  {
    name: 'Onion Rings',
    description: 'Aros de cebolla empanizados con dip de queso cheddar.',
    price: 4.50,
    category: 'appetizers',
    is_featured: false,
    prep_time_minutes: 7,
    sort_order: 11,
    customizations: JSON.stringify([]),
    ingredients_to_remove: '{}',
  },
  {
    name: 'Chicken Wings',
    description: '6 alitas de pollo con salsa a elegir: BBQ, Buffalo o Honey Mustard.',
    price: 6.00,
    category: 'appetizers',
    is_featured: true,
    prep_time_minutes: 12,
    sort_order: 12,
    customizations: JSON.stringify([
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
    ]),
    ingredients_to_remove: '{}',
  },

  // ============================================
  // ACOMPAÑAMIENTOS
  // ============================================
  {
    name: 'Papas Fritas',
    description: 'Papas fritas crocantes con sal y seasoning especial.',
    price: 3.00,
    category: 'sides',
    is_featured: false,
    prep_time_minutes: 5,
    sort_order: 20,
    customizations: JSON.stringify([]),
    ingredients_to_remove: '{}',
  },
  {
    name: 'Aros de Cebolla',
    description: 'Crujientes aros de cebolla con dip ranch.',
    price: 3.50,
    category: 'sides',
    is_featured: false,
    prep_time_minutes: 6,
    sort_order: 21,
    customizations: JSON.stringify([]),
    ingredients_to_remove: '{}',
  },

  // ============================================
  // BEBIDAS
  // ============================================
  {
    name: 'Coca-Cola',
    description: 'Coca-Cola bien fría 355ml.',
    price: 1.50,
    category: 'drinks',
    is_featured: false,
    prep_time_minutes: 1,
    sort_order: 30,
    customizations: JSON.stringify([]),
    ingredients_to_remove: '{}',
  },
  {
    name: 'Sprite',
    description: 'Sprite bien fría 355ml.',
    price: 1.50,
    category: 'drinks',
    is_featured: false,
    prep_time_minutes: 1,
    sort_order: 31,
    customizations: JSON.stringify([]),
    ingredients_to_remove: '{}',
  },
  {
    name: 'Malta',
    description: 'Malta Regional bien fría.',
    price: 1.50,
    category: 'drinks',
    is_featured: false,
    prep_time_minutes: 1,
    sort_order: 32,
    customizations: JSON.stringify([]),
    ingredients_to_remove: '{}',
  },
  {
    name: 'Agua',
    description: 'Agua pura 600ml.',
    price: 1.00,
    category: 'drinks',
    is_featured: false,
    prep_time_minutes: 1,
    sort_order: 33,
    customizations: JSON.stringify([]),
    ingredients_to_remove: '{}',
  },

  // ============================================
  // POSTRES
  // ============================================
  {
    name: 'Brownie con Helado',
    description: 'Brownie de chocolate caliente con bola de helado de vainilla.',
    price: 4.50,
    category: 'desserts',
    is_featured: false,
    prep_time_minutes: 5,
    sort_order: 40,
    customizations: JSON.stringify([
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
    ]),
    ingredients_to_remove: '{}',
  },

  // ============================================
  // COMBOS
  // ============================================
  {
    name: 'Combo Colesterol',
    description: 'La Colesterol + Papas Fritas + Bebida. La experiencia completa.',
    price: 12.00,
    category: 'combos',
    is_featured: true,
    prep_time_minutes: 15,
    sort_order: 50,
    customizations: JSON.stringify([
      {
        name: 'Término de carne',
        type: 'single',
        required: true,
        options: [
          { name: 'Medio', price: 0 },
          { name: 'Término medio', price: 0 },
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
    ]),
    ingredients_to_remove: '{cebolla,lechuga,tomate}',
  },
  {
    name: 'Combo Smash',
    description: 'Smash Burger + Loaded Fries + Bebida.',
    price: 10.50,
    category: 'combos',
    is_featured: false,
    prep_time_minutes: 12,
    sort_order: 51,
    customizations: JSON.stringify([
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
    ]),
    ingredients_to_remove: '{}',
  },
];

// Generate SQL insert statements
const generateSQL = () => {
  let sql = `-- ============================================\n`;
  sql += `-- COLESTEROL SEED DATA\n`;
  sql += `-- Generated: ${new Date().toISOString()}\n`;
  sql += `-- ============================================\n\n`;

  sql += `-- Insert products\n`;
  sql += `INSERT INTO products (name, description, price, category, is_featured, prep_time_minutes, sort_order, customizations, ingredients_to_remove)\n`;
  sql += `VALUES\n`;

  const rows = PRODUCTS.map((p) => {
    const name = p.name.replace(/'/g, "''");
    const desc = p.description.replace(/'/g, "''");
    const customizations = p.customizations.replace(/'/g, "''");
    const ingredients = p.ingredients_to_remove;
    return `  ('${name}', '${desc}', ${p.price}, '${p.category}', ${p.is_featured}, ${p.prep_time_minutes}, ${p.sort_order}, '${customizations}'::jsonb, '${ingredients}')`;
  });

  sql += rows.join(',\n');
  sql += `;\n\n`;

  // Insert admin user
  sql += `-- Insert default admin user (replace auth_id with actual Supabase auth ID)\n`;
  sql += `INSERT INTO users (email, full_name, phone, role)\n`;
  sql += `VALUES ('admin@colesterol.ve', 'Admin Colesterol', '04141234567', 'admin')\n`;
  sql += `ON CONFLICT (email) DO NOTHING;\n\n`;

  // Insert kitchen user
  sql += `-- Insert kitchen user\n`;
  sql += `INSERT INTO users (email, full_name, phone, role)\n`;
  sql += `VALUES ('cocina@colesterol.ve', 'Cocinero', '04141234568', 'kitchen')\n`;
  sql += `ON CONFLICT (email) DO NOTHING;\n\n`;

  // Insert demo driver
  sql += `-- Insert demo delivery driver\n`;
  sql += `INSERT INTO users (email, full_name, phone, role)\n`;
  sql += `VALUES ('delivery@colesterol.ve', 'Repartidor Demo', '04141234569', 'delivery')\n`;
  sql += `ON CONFLICT (email) DO NOTHING;\n`;

  return sql;
};

console.log(generateSQL());
