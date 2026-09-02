-- ============================================
-- COLESTEROL DATABASE SCHEMA
-- Supabase PostgreSQL + Realtime
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('admin', 'kitchen', 'delivery', 'customer');
CREATE TYPE order_status AS ENUM ('received', 'preparing', 'ready', 'dispatched', 'on_the_way', 'delivered', 'cancelled');
CREATE TYPE payment_method AS ENUM ('cash_usd', 'cash_ves', 'pago_movil', 'zelle', 'binance');
CREATE TYPE product_category AS ENUM ('burgers', 'appetizers', 'sides', 'drinks', 'desserts', 'combos');

-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Admins can view all users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- PRODUCTS TABLE
-- ============================================

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category product_category NOT NULL,
  image_url TEXT,
  video_url TEXT,
  customizations JSONB DEFAULT '[]'::jsonb,
  -- Example customizations:
  -- [
  --   {
  --     "name": "Término de carne",
  --     "type": "single",
  --     "required": true,
  --     "options": [
  --       {"name": "Medio", "price": 0},
  --       {"name": "Bien cocido", "price": 0},
  --       {"name": "Término medio", "price": 0}
  --     ]
  --   },
  --   {
  --     "name": "Extras",
  --     "type": "multiple",
  --     "required": false,
  --     "options": [
  --       {"name": "Tocineta extra", "price": 1.50},
  --       {"name": "Queso extra", "price": 1.00}
  --     ]
  --   }
  -- ]
  ingredients_to_remove TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  prep_time_minutes INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available products" ON products
  FOR SELECT USING (is_available = true);

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- ORDERS TABLE
-- ============================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number SERIAL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  customer_notes TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Example items:
  -- [
  --   {
  --     "product_id": "uuid",
  --     "name": "Colesterol Burger",
  --     "quantity": 2,
  --     "unit_price": 8.50,
  --     "total_price": 17.00,
  --     "customizations": {"Término de carne": "Medio", "Extras": ["Tocineta extra"]},
  --     "removed_ingredients": ["cebolla"],
  --     "notes": "Sin mayonesa"
  --   }
  -- ]
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  payment_method payment_method NOT NULL DEFAULT 'cash_usd',
  payment_confirmed BOOLEAN DEFAULT false,
  status order_status NOT NULL DEFAULT 'received',
  assigned_driver_id UUID REFERENCES users(id),
  estimated_delivery_time TIMESTAMPTZ,
  actual_delivery_time TIMESTAMPTZ,
  -- Kitchen timing
  kitchen_started_at TIMESTAMPTZ,
  kitchen_ready_at TIMESTAMPTZ,
  dispatched_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own orders" ON orders
  FOR SELECT USING (
    customer_phone = (SELECT phone FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Kitchen can view active orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('admin', 'kitchen')
    )
  );

CREATE POLICY "Drivers can view assigned orders" ON orders
  FOR SELECT USING (
    assigned_driver_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "System can create orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Kitchen can update order status" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('admin', 'kitchen', 'delivery')
    )
  );

-- ============================================
-- DELIVERY LOGS TABLE
-- ============================================

CREATE TABLE delivery_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES users(id),
  status order_status NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  notes TEXT,
  proof_of_delivery_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE delivery_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Drivers can manage own logs" ON delivery_logs
  FOR ALL USING (
    driver_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Admins can view all logs" ON delivery_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_available ON products(is_available);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_driver ON orders(assigned_driver_id);
CREATE INDEX idx_delivery_logs_order ON delivery_logs(order_id);
CREATE INDEX idx_delivery_logs_driver ON delivery_logs(driver_id);

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- ============================================

-- Enable realtime for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE products;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := (SELECT COALESCE(MAX(order_number), 0) + 1 FROM orders);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();
