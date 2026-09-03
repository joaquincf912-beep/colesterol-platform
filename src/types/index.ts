// ============================================
// COLESTEROL PLATFORM TYPES
// ============================================

export type UserRole = 'admin' | 'kitchen' | 'delivery' | 'customer';
export type OrderStatus = 'received' | 'preparing' | 'ready' | 'dispatched' | 'on_the_way' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cash_usd' | 'cash_ves' | 'pago_movil' | 'zelle' | 'binance';
export type ProductCategory = 'burgers' | 'appetizers' | 'sides' | 'drinks' | 'desserts' | 'combos';

// ============================================
// USER
// ============================================

export interface User {
  id: string;
  auth_id: string;
  email: string | null;
  full_name: string;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================
// PRODUCT
// ============================================

export interface CustomizationOption {
  name: string;
  price: number;
}

export interface CustomizationGroup {
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: CustomizationOption[];
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: ProductCategory;
  image_url: string | null;
  video_url: string | null;
  customizations: CustomizationGroup[];
  ingredients_to_remove: string[];
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
  prep_time_minutes: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// ORDER
// ============================================

export interface OrderItemCustomizations {
  [groupName: string]: string | string[];
}

export interface OrderItem {
  product_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  customizations: OrderItemCustomizations;
  removed_ingredients: string[];
  notes: string;
}

export interface Order {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string | null;
  customer_lat: number | null;
  customer_lng: number | null;
  customer_notes: string | null;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: PaymentMethod;
  payment_confirmed: boolean;
  status: OrderStatus;
  assigned_driver_id: string | null;
  estimated_delivery_time: string | null;
  actual_delivery_time: string | null;
  kitchen_started_at: string | null;
  kitchen_ready_at: string | null;
  dispatched_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// DELIVERY LOG
// ============================================

export interface DeliveryLog {
  id: string;
  order_id: string;
  driver_id: string;
  status: OrderStatus;
  latitude: number | null;
  longitude: number | null;
  notes: string | null;
  proof_of_delivery_url: string | null;
  created_at: string;
}

// ============================================
// CART (Client-side only)
// ============================================

export interface CartItem {
  product: Product;
  quantity: number;
  customizations: OrderItemCustomizations;
  removed_ingredients: string[];
  notes: string;
}

// ============================================
// CATEGORY LABELS
// ============================================

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  burgers: 'Burgers',
  appetizers: 'Entradas',
  sides: 'Acompañamientos',
  drinks: 'Bebidas',
  desserts: 'Postres',
  combos: 'Combos',
};

export const CATEGORY_ICONS: Record<ProductCategory, string> = {
  burgers: 'BRG',
  appetizers: 'ENT',
  sides: 'ACP',
  drinks: 'BEB',
  desserts: 'POS',
  combos: 'CMB',
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  received: 'Recibido',
  preparing: 'Cocinando',
  ready: 'Listo',
  dispatched: 'Despachado',
  on_the_way: 'En Camino',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cash_usd: 'Efectivo USD',
  cash_ves: 'Efectivo VES',
  pago_movil: 'Pago Móvil',
  zelle: 'Zelle',
  binance: 'Binance',
};
