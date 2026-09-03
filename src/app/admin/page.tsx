'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed, Settings, Monitor,
  TrendingUp, DollarSign, Clock, ArrowUpRight, ArrowLeft,
  ToggleLeft, ToggleRight, Plus, Pencil, Trash2, Search,
  ChevronDown, ChevronRight, Eye, X, Check, Save, RefreshCw,
  Phone, MapPin, MessageCircle, Package, AlertCircle, CheckCircle,
  Utensils, Truck, Star, BarChart3, Calendar, Filter,
  ImagePlus, FileText, GripVertical, Copy, ExternalLink
} from 'lucide-react';
import dynamic from 'next/dynamic';
const SalesChart = dynamic(() => import('@/components/admin/SalesChart'), { ssr: false });
import { getSupabaseClient } from '@/lib/supabase/client';
import { useRealtimeOrders, useRealtimeProducts } from '@/lib/supabase/realtime';
import { useOrderStore } from '@/stores/orders';
import type { Order, Product, ProductCategory, OrderStatus } from '@/types';
import { CATEGORY_LABELS, CATEGORY_ICONS, STATUS_LABELS, PAYMENT_LABELS } from '@/types';
import { formatPrice, cn, formatTime } from '@/lib/utils';
import { DEMO_ORDERS } from '@/lib/demo-orders';
import { DEMO_PRODUCTS } from '@/lib/demo-data';

// ============================================
// TYPES
// ============================================

type AdminSection = 'dashboard' | 'orders' | 'menu' | 'settings' | 'monitor';

interface RestaurantSettings {
  name: string;
  slogan: string;
  phone: string;
  whatsapp: string;
  address: string;
  openHours: string;
  deliveryFee: number;
  minOrder: number;
  currency: string;
}

interface DateFilter {
  label: string;
  value: 'today' | 'yesterday' | 'week' | 'all' | 'custom';
}

const DATE_FILTERS: DateFilter[] = [
  { label: 'Hoy', value: 'today' },
  { label: 'Ayer', value: 'yesterday' },
  { label: 'Esta Semana', value: 'week' },
  { label: 'Todos', value: 'all' },
];

const generateSalesData = () => {
  const hours = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM'];
  return hours.map((hour) => ({
    time: hour,
    sales: Math.floor(Math.random() * 200) + 50,
    orders: Math.floor(Math.random() * 15) + 2,
  }));
};

// ============================================
// HELPER: Filter orders by date
// ============================================

function filterOrdersByDate(orders: Order[], filter: DateFilter['value'], customStart?: string, customEnd?: string): Order[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  // Custom date range
  if (filter === 'custom' && customStart) {
    const startDate = new Date(customStart + 'T00:00:00');
    const endDate = customEnd ? new Date(customEnd + 'T23:59:59') : new Date(customStart + 'T23:59:59');
    return orders.filter((order) => {
      const orderDate = new Date(order.created_at);
      return orderDate >= startDate && orderDate <= endDate;
    });
  }

  return orders.filter((order) => {
    const orderDate = new Date(order.created_at);
    switch (filter) {
      case 'today':
        return orderDate >= today;
      case 'yesterday':
        return orderDate >= yesterday && orderDate < today;
      case 'week':
        return orderDate >= weekStart;
      case 'all':
        return true;
      default:
        return true;
    }
  });
}

function filterOrdersBySearch(orders: Order[], query: string): Order[] {
  if (!query.trim()) return orders;
  const q = query.toLowerCase();
  return orders.filter((order) =>
    order.order_number.toString().includes(q) ||
    order.customer_name.toLowerCase().includes(q) ||
    order.customer_phone.includes(q) ||
    order.items.some((item) => item.name.toLowerCase().includes(q))
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [salesData] = useState(generateSalesData);

  // Orders filters
  const [orderDateFilter, setOrderDateFilter] = useState<DateFilter['value']>('today');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [customDateStart, setCustomDateStart] = useState('');
  const [customDateEnd, setCustomDateEnd] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Menu editor
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<ProductCategory | 'all'>('all');

  // Settings
  const [restaurantSettings, setRestaurantSettings] = useState<RestaurantSettings>({
    name: 'TraccionWeb',
    slogan: 'Street Food Premium',
    phone: '+58 414 123 4567',
    whatsapp: '+58 414 123 4567',
    address: 'Av. Principal, Caracas, Venezuela',
    openHours: '11:00 AM - 11:00 PM',
    deliveryFee: 2.00,
    minOrder: 8.00,
    currency: 'USD',
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Exchange rate
  const [vesRate, setVesRate] = useState(36.50);
  const [vesRateLastUpdate, setVesRateLastUpdate] = useState('');
  const [vesRateLoading, setVesRateLoading] = useState(false);

  // Fetch exchange rate from API
  const fetchExchangeRate = useCallback(async () => {
    setVesRateLoading(true);
    try {
      const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficiales');
      const data = await res.json();
      if (data && data[0] && data[0].promedio) {
        setVesRate(data[0].promedio);
        setVesRateLastUpdate(new Date().toLocaleTimeString('es-VE'));
      }
    } catch {
      // Keep default rate on error
      setVesRateLastUpdate(new Date().toLocaleTimeString('es-VE') + ' (manual)');
    }
    setVesRateLoading(false);
  }, []);

  // Auto-fetch exchange rate on mount and every 5 minutes
  useEffect(() => {
    fetchExchangeRate();
    const interval = setInterval(fetchExchangeRate, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchExchangeRate]);

  // Real-time timestamps for live monitor
  const [now, setNow] = useState(Date.now());

  // Stats
  const todayTotal = useMemo(() =>
    filterOrdersByDate(orders, 'today')
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0),
    [orders]
  );
  const todayOrders = useMemo(() =>
    filterOrdersByDate(orders, 'today').filter((o) => o.status !== 'cancelled').length,
    [orders]
  );
  const activeOrders = useMemo(() =>
    orders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length,
    [orders]
  );
  const avgOrderValue = todayOrders > 0 ? todayTotal / todayOrders : 0;

  // Poll API for orders (cross-device sync)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const allOrders = await res.json();
        setOrders(allOrders);
      } catch {
        const store = useOrderStore.getState();
        setOrders([...store.orders]);
      }
    };

    fetchOrders();
    setProducts(DEMO_PRODUCTS);
    setIsLoading(false);
    const interval = setInterval(fetchOrders, 2000);
  }, []);

  // Real-time updates
  useRealtimeOrders(({ eventType, new: newOrder }) => {
    if (eventType === 'INSERT') {
      setOrders((prev) => [newOrder, ...prev]);
    }
    if (eventType === 'UPDATE') {
      setOrders((prev) => prev.map((o) => (o.id === newOrder.id ? newOrder : o)));
    }
  });

  useRealtimeProducts(({ eventType, new: newProduct }) => {
    if (eventType === 'UPDATE') {
      setProducts((prev) => prev.map((p) => (p.id === newProduct.id ? newProduct : p)));
    }
    if (eventType === 'INSERT') {
      setProducts((prev) => [...prev, newProduct]);
    }
  });

  // Refresh timestamps every 10s for live monitor
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(interval);
  }, []);

  // Toggle product availability
  const toggleProductAvailability = useCallback(async (product: Product) => {
    const updated = { ...product, is_available: !product.is_available };
    setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
    try {
      const supabase = getSupabaseClient();
      await supabase.from('products').update({ is_available: updated.is_available }).eq('id', product.id);
    } catch { /* demo mode */ }
  }, []);

  // Delete product
  const deleteProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    let result = filterOrdersByDate(orders, orderDateFilter, customDateStart, customDateEnd);
    result = filterOrdersBySearch(result, orderSearchQuery);
    if (orderStatusFilter !== 'all') {
      result = result.filter((o) => o.status === orderStatusFilter);
    }
    return result;
  }, [orders, orderDateFilter, orderSearchQuery, orderStatusFilter, customDateStart, customDateEnd]);

  // Filtered products for menu editor
  const filteredProducts = useMemo(() => {
    let result = products;
    if (menuCategoryFilter !== 'all') {
      result = result.filter((p) => p.category === menuCategoryFilter);
    }
    if (menuSearchQuery.trim()) {
      const q = menuSearchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }
    return result;
  }, [products, menuCategoryFilter, menuSearchQuery]);

  // Sidebar navigation items
  const navItems = [
    { id: 'dashboard' as const, icon: LayoutDashboard, label: 'Dashboard', color: 'text-yellow-400' },
    { id: 'orders' as const, icon: ShoppingBag, label: 'Pedidos', color: 'text-blue-400' },
    { id: 'menu' as const, icon: UtensilsCrossed, label: 'Menú', color: 'text-green-400' },
    { id: 'settings' as const, icon: Settings, label: 'Configuración', color: 'text-purple-400' },
    { id: 'monitor' as const, icon: Monitor, label: 'Live Monitor', color: 'text-red-400', badge: activeOrders },
  ];

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* ============================================ */}
      {/* SIDEBAR                                     */}
      {/* ============================================ */}
      <aside className="hidden lg:flex w-[260px] h-screen flex-col border-r border-white/5" style={{ background: '#0A0A0A' }}>
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFC700] flex items-center justify-center">
              <span className="text-black font-black text-lg">C</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-white">TraccionWeb</h1>
              <p className="text-[11px] text-white/30">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          <p className="text-[10px] font-semibold text-white/20 uppercase tracking-wider px-3 pt-3 pb-2">Navegación</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                activeSection === item.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              )}
            >
              <item.icon className={cn('w-4 h-4', activeSection === item.id ? item.color : '')} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5">
          <div className="glass-card rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] text-white/50">Sistema Activo</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-white/30">
              <span>Supabase</span>
              <span className="text-green-500">Conectado</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ============================================ */}
      {/* MAIN CONTENT                                */}
      {/* ============================================ */}
      <main className="flex-1 h-screen overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 border-b border-white/5 px-4 py-3" style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FFC700] flex items-center justify-center">
                <span className="text-black font-black text-sm">C</span>
              </div>
              <h1 className="text-sm font-bold text-white">Admin</h1>
            </div>
            {activeOrders > 0 && (
              <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold">
                {activeOrders} activos
              </span>
            )}
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                  activeSection === item.id
                    ? 'bg-[#FFC700] text-black'
                    : 'bg-white/5 text-white/50'
                )}
              >
                <item.icon className="w-3 h-3" />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 lg:p-6 max-w-[1400px] mx-auto">
          <AnimatePresence mode="wait">
            {/* ============================================ */}
            {/* DASHBOARD                                   */}
            {/* ============================================ */}
            {activeSection === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Dashboard</h2>
                  <span className="text-xs text-white/30">
                    {new Date().toLocaleDateString('es-VE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <StatCard icon={DollarSign} label="Ventas Hoy" value={`$${todayTotal.toFixed(2)}`} trend="+12%" color="yellow" />
                  <StatCard icon={ShoppingBag} label="Pedidos Hoy" value={todayOrders.toString()} trend="+8%" color="green" />
                  <StatCard icon={Clock} label="Activos" value={activeOrders.toString()} color="red" />
                  <StatCard icon={TrendingUp} label="Promedio" value={`$${avgOrderValue.toFixed(2)}`} trend="+3%" color="blue" />
                </div>

                {/* Sales Chart */}
                <div className="glass-card rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white/60">Ventas por Hora</h3>
                    <span className="text-xs text-[#FFC700] font-medium">Hoy</span>
                  </div>
                  <div className="h-56">
                    <SalesChart data={salesData.map((d) => ({ hour: d.time, ventas: d.sales, pedidos: 0 }))} />
                  </div>
                </div>

                {/* Quick Recent Orders */}
                <div className="glass-card rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white/60">Pedidos Recientes</h3>
                    <button
                      onClick={() => setActiveSection('orders')}
                      className="text-xs text-[#FFC700] hover:underline"
                    >
                      Ver todos →
                    </button>
                  </div>
                  <div className="space-y-2">
                    {orders.slice(0, 5).map((order) => (
                      <button
                        key={order.id}
                        onClick={() => { setSelectedOrder(order); setActiveSection('orders'); }}
                        className="w-full flex items-center justify-between py-2.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] rounded-lg px-2 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-white/30">#{order.order_number}</span>
                          <span className="text-sm text-white">{order.customer_name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={order.status} />
                          <span className="text-sm font-bold text-[#FFC700]">${order.total.toFixed(2)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ============================================ */}
            {/* ORDERS                                      */}
            {/* ============================================ */}
            {activeSection === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {selectedOrder ? (
                  /* ============================================ */
                  /* ORDER DETAIL VIEW                           */
                  /* ============================================ */
                  <OrderDetailView
                    order={selectedOrder}
                    onBack={() => setSelectedOrder(null)}
                    onStatusChange={(newStatus) => {
                      const updated = { ...selectedOrder, status: newStatus, updated_at: new Date().toISOString() };
                      setSelectedOrder(updated);
                      setOrders((prev) => prev.map((o) => o.id === updated.id ? updated : o));
                    }}
                  />
                ) : (
                  /* ============================================ */
                  /* ORDERS LIST VIEW                            */
                  /* ============================================ */
                  <>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white">Pedidos</h2>
                      <span className="text-xs text-white/30">{filteredOrders.length} pedidos</span>
                    </div>

                    {/* Date Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-1 items-center">
                      {DATE_FILTERS.map((filter) => (
                        <button
                          key={filter.value}
                          onClick={() => {
                            setOrderDateFilter(filter.value);
                            setShowDatePicker(false);
                          }}
                          className={cn(
                            'px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all',
                            orderDateFilter === filter.value && !showDatePicker
                              ? 'bg-[#FFC700] text-black'
                              : 'bg-white/5 text-white/50 hover:bg-white/10'
                          )}
                        >
                          {filter.label}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setShowDatePicker(!showDatePicker);
                          setOrderDateFilter('custom');
                        }}
                        className={cn(
                          'px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5',
                          showDatePicker
                            ? 'bg-[#FFC700] text-black'
                            : 'bg-white/5 text-white/50 hover:bg-white/10'
                        )}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Buscar por fecha
                      </button>
                    </div>

                    {/* Custom Date Picker */}
                    <AnimatePresence>
                      {showDatePicker && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="glass-card rounded-2xl p-4 border border-white/5">
                            <div className="flex items-center gap-2 mb-3">
                              <Calendar className="w-4 h-4 text-[#FFC700]" />
                              <h4 className="text-xs font-semibold text-white/60">Buscar por rango de fechas</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-[10px] text-white/30 mb-1 block">Desde</label>
                                <input
                                  type="date"
                                  value={customDateStart}
                                  onChange={(e) => {
                                    setCustomDateStart(e.target.value);
                                    if (e.target.value) setOrderDateFilter('custom');
                                  }}
                                  className="settings-input text-white"
                                  style={{ colorScheme: 'dark' }}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-white/30 mb-1 block">Hasta</label>
                                <input
                                  type="date"
                                  value={customDateEnd}
                                  onChange={(e) => {
                                    setCustomDateEnd(e.target.value);
                                    if (customDateStart || e.target.value) setOrderDateFilter('custom');
                                  }}
                                  className="settings-input text-white"
                                  style={{ colorScheme: 'dark' }}
                                />
                              </div>
                            </div>
                            {customDateStart && (
                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                                <span className="text-[10px] text-white/30">
                                  {customDateEnd && customDateEnd !== customDateStart
                                    ? `Del ${customDateStart} al ${customDateEnd}`
                                    : `Fecha: ${customDateStart}`
                                  }
                                </span>
                                <button
                                  onClick={() => {
                                    setCustomDateStart('');
                                    setCustomDateEnd('');
                                    setOrderDateFilter('all');
                                    setShowDatePicker(false);
                                  }}
                                  className="text-[10px] text-red-400 hover:text-red-300 transition-colors"
                                >
                                  Limpiar
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Status Filters */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                      {(['all', 'received', 'preparing', 'ready', 'dispatched', 'on_the_way', 'delivered'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => setOrderStatusFilter(status)}
                          className={cn(
                            'px-3 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-all border',
                            orderStatusFilter === status
                              ? 'bg-white/10 border-white/20 text-white'
                              : 'border-white/5 text-white/30 hover:text-white/50'
                          )}
                        >
                          {status === 'all' ? 'Todos' : STATUS_LABELS[status]}
                        </button>
                      ))}
                    </div>

                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input
                        type="text"
                        placeholder="Buscar por #, nombre, teléfono o producto..."
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFC700]/50 transition-colors"
                      />
                    </div>

                    {/* Orders Grid */}
                    <div className="space-y-3">
                      {filteredOrders.length === 0 ? (
                        <div className="text-center py-16">
                          <ShoppingBag className="w-12 h-12 text-white/10 mx-auto mb-3" />
                          <p className="text-white/30 text-sm">No hay pedidos para este filtro</p>
                        </div>
                      ) : (
                        filteredOrders.map((order) => (
                          <OrderCard
                            key={order.id}
                            order={order}
                            onClick={() => setSelectedOrder(order)}
                          />
                        ))
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* ============================================ */}
            {/* MENU EDITOR                                 */}
            {/* ============================================ */}
            {activeSection === 'menu' && (
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {editingProduct ? (
                  <ProductEditor
                    product={editingProduct}
                    onBack={() => setEditingProduct(null)}
                    onSave={(updated) => {
                      setProducts((prev) => prev.map((p) => p.id === updated.id ? updated : p));
                      setEditingProduct(null);
                    }}
                  />
                ) : showNewProductForm ? (
                  <ProductEditor
                    product={null}
                    onBack={() => setShowNewProductForm(false)}
                    onSave={(newProduct) => {
                      setProducts((prev) => [...prev, newProduct]);
                      setShowNewProductForm(false);
                    }}
                  />
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-white">Menú</h2>
                        <p className="text-xs text-white/30 mt-0.5">{products.length} productos en el menú</p>
                      </div>
                      <button
                        onClick={() => setShowNewProductForm(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#FFC700] text-black rounded-xl text-sm font-semibold hover:bg-[#FFD633] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Nuevo Producto
                      </button>
                    </div>

                    {/* Category Filters */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                      {(['all', 'burgers', 'appetizers', 'sides', 'drinks', 'desserts', 'combos'] as const).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setMenuCategoryFilter(cat)}
                          className={cn(
                            'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                            menuCategoryFilter === cat
                              ? 'bg-[#FFC700] text-black'
                              : 'bg-white/5 text-white/50 hover:bg-white/10'
                          )}
                        >
                          {cat === 'all' ? 'Todos' : CATEGORY_LABELS[cat]}
                        </button>
                      ))}
                    </div>

                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={menuSearchQuery}
                        onChange={(e) => setMenuSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFC700]/50 transition-colors"
                      />
                    </div>

                    {/* Products Grid */}
                    <div className="space-y-2">
                      {filteredProducts.map((product) => (
                        <motion.div
                          key={product.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="glass-card rounded-2xl p-3 flex items-center gap-3"
                        >
                          {/* Thumbnail */}
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white/20">
                                {CATEGORY_ICONS[product.category]}
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-white text-sm truncate">{product.name}</h3>
                              {product.is_featured && <Star className="w-3 h-3 text-[#FFC700] flex-shrink-0" />}
                              {!product.is_available && (
                                <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full font-medium">
                                  Agotado
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-white/30 mt-0.5">
                              {CATEGORY_LABELS[product.category]} · ${product.price.toFixed(2)} · {product.prep_time_minutes}min
                            </p>
                          </div>

                          {/* Toggle */}
                          <button
                            onClick={() => toggleProductAvailability(product)}
                            className={cn('transition-colors', product.is_available ? 'text-green-500' : 'text-white/20')}
                          >
                            {product.is_available ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
                          </button>

                          {/* Actions */}
                          <div className="flex gap-1">
                            <button
                              onClick={() => setEditingProduct(product)}
                              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5 text-white/40" />
                            </button>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-400/60" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* ============================================ */}
            {/* SETTINGS                                    */}
            {/* ============================================ */}
            {activeSection === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-5 max-w-2xl"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Configuración</h2>
                  {settingsSaved && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-1 text-xs text-green-400"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Guardado
                    </motion.span>
                  )}
                </div>

                {/* Restaurant Info */}
                <SettingsSection title="Información del Restaurante" icon={Utensils}>
                  <SettingsField label="Nombre">
                    <input
                      type="text"
                      value={restaurantSettings.name}
                      onChange={(e) => setRestaurantSettings({ ...restaurantSettings, name: e.target.value })}
                      className="settings-input"
                    />
                  </SettingsField>
                  <SettingsField label="Eslogan">
                    <input
                      type="text"
                      value={restaurantSettings.slogan}
                      onChange={(e) => setRestaurantSettings({ ...restaurantSettings, slogan: e.target.value })}
                      className="settings-input"
                    />
                  </SettingsField>
                  <SettingsField label="Dirección">
                    <input
                      type="text"
                      value={restaurantSettings.address}
                      onChange={(e) => setRestaurantSettings({ ...restaurantSettings, address: e.target.value })}
                      className="settings-input"
                    />
                  </SettingsField>
                  <SettingsField label="Horario">
                    <input
                      type="text"
                      value={restaurantSettings.openHours}
                      onChange={(e) => setRestaurantSettings({ ...restaurantSettings, openHours: e.target.value })}
                      className="settings-input"
                    />
                  </SettingsField>
                </SettingsSection>

                {/* Contact */}
                <SettingsSection title="Contacto" icon={Phone}>
                  <SettingsField label="Teléfono">
                    <input
                      type="text"
                      value={restaurantSettings.phone}
                      onChange={(e) => setRestaurantSettings({ ...restaurantSettings, phone: e.target.value })}
                      className="settings-input"
                    />
                  </SettingsField>
                  <SettingsField label="WhatsApp">
                    <input
                      type="text"
                      value={restaurantSettings.whatsapp}
                      onChange={(e) => setRestaurantSettings({ ...restaurantSettings, whatsapp: e.target.value })}
                      className="settings-input"
                    />
                  </SettingsField>
                </SettingsSection>

                {/* Delivery */}
                <SettingsSection title="Delivery" icon={Truck}>
                  <SettingsField label="Tarifa de envío ($)">
                    <input
                      type="number"
                      step="0.50"
                      value={restaurantSettings.deliveryFee}
                      onChange={(e) => setRestaurantSettings({ ...restaurantSettings, deliveryFee: parseFloat(e.target.value) || 0 })}
                      className="settings-input"
                    />
                  </SettingsField>
                  <SettingsField label="Pedido mínimo ($)">
                    <input
                      type="number"
                      step="0.50"
                      value={restaurantSettings.minOrder}
                      onChange={(e) => setRestaurantSettings({ ...restaurantSettings, minOrder: parseFloat(e.target.value) || 0 })}
                      className="settings-input"
                    />
                  </SettingsField>
                  <SettingsField label="Moneda">
                    <select
                      value={restaurantSettings.currency}
                      onChange={(e) => setRestaurantSettings({ ...restaurantSettings, currency: e.target.value })}
                      className="settings-input"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="VES">VES (Bs.)</option>
                      <option value="both">Ambas</option>
                    </select>
                  </SettingsField>
                </SettingsSection>

                {/* Exchange Rate */}
                <SettingsSection title="Divisas (USD/VES)" icon={DollarSign}>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div>
                      <p className="text-xs text-white/30">Tasa de cambio oficial</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-black text-[#FFC700]">{vesRate.toFixed(2)}</span>
                        <span className="text-sm text-white/40">Bs./USD</span>
                      </div>
                      {vesRateLastUpdate && (
                        <p className="text-[10px] text-white/20 mt-1">Actualizado: {vesRateLastUpdate}</p>
                      )}
                    </div>
                    <button
                      onClick={fetchExchangeRate}
                      disabled={vesRateLoading}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-white/50 text-xs font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={cn('w-3.5 h-3.5', vesRateLoading && 'animate-spin')} />
                      {vesRateLoading ? 'Actualizando...' : 'Actualizar'}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-[10px] text-white/30">Se actualiza automaticamente cada 5 minutos con el valor oficial del BCV</p>
                  </div>
                  <SettingsField label="Tasa manual (si la API falla)">
                    <input
                      type="number"
                      step="0.01"
                      value={vesRate}
                      onChange={(e) => setVesRate(parseFloat(e.target.value) || 0)}
                      className="settings-input font-mono tabular-nums"
                    />
                  </SettingsField>
                </SettingsSection>

                {/* Save Button */}
                <button
                  onClick={() => {
                    setSettingsSaved(true);
                    setTimeout(() => setSettingsSaved(false), 3000);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#FFC700] text-black rounded-2xl text-sm font-bold hover:bg-[#FFD633] transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Guardar Configuración
                </button>

                {/* Danger Zone */}
                <div className="glass-card rounded-2xl p-5 border border-red-500/10">
                  <h3 className="text-sm font-semibold text-red-400 mb-3">Zona de Peligro</h3>
                  <div className="space-y-2">
                    <button className="w-full text-left px-4 py-3 rounded-xl text-sm text-white/60 hover:bg-white/5 border border-white/5 transition-colors">
                      Cerrar restaurante temporalmente
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-xl text-sm text-red-400/60 hover:bg-red-500/5 border border-red-500/10 transition-colors">
                      Eliminar todos los pedidos de hoy
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ============================================ */}
            {/* LIVE MONITOR                                */}
            {/* ============================================ */}
            {activeSection === 'monitor' && (
              <motion.div
                key="monitor"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-white">Live Monitor</h2>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] text-green-400 font-medium">EN VIVO</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-white/20">Actualiza cada 10s</span>
                </div>

                {/* Live Panels Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* KDS Live Panel */}
                  <LivePanel
                    title="Kitchen (KDS)"
                    icon={<UtensilsCrossed className="w-4 h-4 text-orange-400" />}
                    accentColor="orange"
                  >
                    {orders.filter((o) => ['received', 'preparing', 'ready'].includes(o.status)).length === 0 ? (
                      <EmptyState message="Sin pedidos activos en cocina" />
                    ) : (
                      <div className="space-y-2">
                        {orders
                          .filter((o) => ['received', 'preparing', 'ready'].includes(o.status))
                          .map((order) => (
                            <LiveOrderCard key={order.id} order={order} now={now} />
                          ))}
                      </div>
                    )}
                  </LivePanel>

                  {/* Delivery Live Panel */}
                  <LivePanel
                    title="Delivery"
                    icon={<Truck className="w-4 h-4 text-blue-400" />}
                    accentColor="blue"
                  >
                    {orders.filter((o) => ['dispatched', 'on_the_way'].includes(o.status)).length === 0 ? (
                      <EmptyState message="Sin pedidos en camino" />
                    ) : (
                      <div className="space-y-2">
                        {orders
                          .filter((o) => ['dispatched', 'on_the_way'].includes(o.status))
                          .map((order) => (
                            <LiveOrderCard key={order.id} order={order} now={now} />
                          ))}
                      </div>
                    )}
                  </LivePanel>

                  {/* Menu Live Panel */}
                  <LivePanel
                    title="Menú"
                    icon={<Package className="w-4 h-4 text-green-400" />}
                    accentColor="green"
                  >
                    <div className="space-y-2">
                      {products.slice(0, 8).map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[9px] font-bold text-white/20">{CATEGORY_ICONS[product.category]}</span>
                            <span className="text-xs text-white/70 truncate">{product.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#FFC700] font-mono">${product.price.toFixed(2)}</span>
                            <div className={cn(
                              'w-2 h-2 rounded-full',
                              product.is_available ? 'bg-green-500' : 'bg-red-500'
                            )} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </LivePanel>
                </div>

                {/* Recent Activity Feed */}
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-white/60 mb-4">Actividad Reciente</h3>
                  <div className="space-y-3">
                    {orders.slice(0, 8).map((order) => (
                      <div key={order.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                          order.status === 'received' && 'bg-white/10',
                          order.status === 'preparing' && 'bg-orange-500/10',
                          order.status === 'ready' && 'bg-green-500/10',
                          order.status === 'dispatched' && 'bg-blue-500/10',
                          order.status === 'on_the_way' && 'bg-blue-500/10',
                          order.status === 'delivered' && 'bg-green-500/5',
                          order.status === 'cancelled' && 'bg-red-500/5',
                        )}>
                          {order.status === 'received' && <Package className="w-3.5 h-3.5 text-white/40" />}
                          {order.status === 'preparing' && <UtensilsCrossed className="w-3.5 h-3.5 text-orange-400" />}
                          {order.status === 'ready' && <CheckCircle className="w-3.5 h-3.5 text-green-400" />}
                          {(order.status === 'dispatched' || order.status === 'on_the_way') && <Truck className="w-3.5 h-3.5 text-blue-400" />}
                          {order.status === 'delivered' && <CheckCircle className="w-3.5 h-3.5 text-green-400/50" />}
                          {order.status === 'cancelled' && <X className="w-3.5 h-3.5 text-red-400/50" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white/70">
                            <span className="font-mono text-white/40">#{order.order_number}</span>{' '}
                            {order.customer_name} — {STATUS_LABELS[order.status]}
                          </p>
                          <p className="text-[10px] text-white/20 mt-0.5">
                            {formatTime(order.updated_at)}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-[#FFC700]">${order.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function StatCard({
  icon: Icon, label, value, trend, color,
}: {
  icon: typeof DollarSign;
  label: string;
  value: string;
  trend?: string;
  color: 'yellow' | 'green' | 'red' | 'blue';
}) {
  const colorMap = {
    yellow: 'bg-[#FFC700]/10 text-[#FFC700]',
    green: 'bg-green-500/10 text-green-400',
    red: 'bg-red-500/10 text-red-400',
    blue: 'bg-blue-500/10 text-blue-400',
  };
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', colorMap[color])}>
          <Icon className="w-4 h-4" />
        </div>
        {trend && (
          <span className="flex items-center gap-0.5 text-[10px] text-green-400 font-medium">
            <ArrowUpRight className="w-3 h-3" /> {trend}
          </span>
        )}
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-[11px] text-white/30 mt-0.5">{label}</p>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    received: 'bg-white/10 text-white',
    preparing: 'bg-orange-500/20 text-orange-400',
    ready: 'bg-green-500/20 text-green-400',
    dispatched: 'bg-blue-500/20 text-blue-400',
    on_the_way: 'bg-blue-500/20 text-blue-400',
    delivered: 'bg-green-500/10 text-green-400/50',
    cancelled: 'bg-red-500/10 text-red-400/50',
  };
  return (
    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium', styles[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}

// ============================================
// ORDER CARD (List View)
// ============================================

function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  const elapsed = Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000);

  return (
    <button
      onClick={onClick}
      className="w-full glass-card rounded-2xl p-4 text-left hover:bg-white/[0.03] transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
            <span className="text-sm font-bold text-white/60">#{order.order_number}</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{order.customer_name}</h3>
            <p className="text-[11px] text-white/30">{order.customer_phone}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-base font-bold text-[#FFC700]">${order.total.toFixed(2)}</p>
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Items Summary */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {order.items.map((item, i) => (
          <span key={i} className="text-[10px] bg-white/5 text-white/40 px-2 py-0.5 rounded-full">
            {item.quantity}x {item.name}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-white/20">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {elapsed}min
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {order.customer_address || 'Local'}
          </span>
        </div>
        <span>{PAYMENT_LABELS[order.payment_method]}</span>
        <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white/30 transition-colors" />
      </div>
    </button>
  );
}

// ============================================
// ORDER DETAIL VIEW
// ============================================

function OrderDetailView({
  order,
  onBack,
  onStatusChange,
}: {
  order: Order;
  onBack: () => void;
  onStatusChange: (status: OrderStatus) => void;
}) {
  const elapsed = Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000);

  const statusFlow: OrderStatus[] = ['received', 'preparing', 'ready', 'dispatched', 'on_the_way', 'delivered'];
  const currentIdx = statusFlow.indexOf(order.status);

  return (
    <div className="space-y-5">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a pedidos
      </button>

      {/* Header */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-black text-white">#{order.order_number}</h2>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-sm text-white/50">{order.customer_name}</p>
          </div>
          <p className="text-2xl font-black text-[#FFC700]">${order.total.toFixed(2)}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            {statusFlow.map((status, i) => (
              <div key={status} className="flex items-center">
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all',
                  i <= currentIdx
                    ? 'bg-[#FFC700] text-black'
                    : 'bg-white/5 text-white/20'
                )}>
                  {i < currentIdx ? '✓' : i + 1}
                </div>
                {i < statusFlow.length - 1 && (
                  <div className={cn(
                    'w-8 lg:w-12 h-0.5 mx-1',
                    i < currentIdx ? 'bg-[#FFC700]' : 'bg-white/10'
                  )} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[9px] text-white/20">
            {statusFlow.map((s, i) => (
              <span key={s} className={cn(i <= currentIdx && 'text-[#FFC700]/60')}>
                {STATUS_LABELS[s]}
              </span>
            ))}
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
            <Phone className="w-4 h-4 text-white/20" />
            <div>
              <p className="text-[10px] text-white/20">Teléfono</p>
              <p className="text-xs text-white/70">{order.customer_phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
            <MapPin className="w-4 h-4 text-white/20" />
            <div>
              <p className="text-[10px] text-white/20">Dirección</p>
              <p className="text-xs text-white/70">{order.customer_address || 'Retiro en local'}</p>
            </div>
          </div>
        </div>

        {order.customer_notes && (
          <div className="mt-3 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
            <p className="text-[10px] text-yellow-500/50 mb-1">Notas del cliente</p>
            <p className="text-xs text-white/60">{order.customer_notes}</p>
          </div>
        )}
      </div>

      {/* Order Items - Detailed */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Detalle del Pedido</h3>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                  <p className="text-[10px] text-white/30">
                    {item.quantity}x ${item.unit_price.toFixed(2)}
                  </p>
                </div>
                <span className="text-sm font-bold text-[#FFC700]">${item.total_price.toFixed(2)}</span>
              </div>

              {/* Customizations */}
              {Object.keys(item.customizations).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {Object.entries(item.customizations).map(([key, val]) => (
                    <span key={key} className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">
                      {key}: {Array.isArray(val) ? val.join(', ') : val}
                    </span>
                  ))}
                </div>
              )}

              {/* Removed Ingredients */}
              {item.removed_ingredients.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.removed_ingredients.map((ing) => (
                    <span key={ing} className="text-[9px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full line-through">
                      Sin {ing}
                    </span>
                  ))}
                </div>
              )}

              {/* Notes */}
              {item.notes && (
                <p className="text-[10px] text-white/30 italic">{item.notes}</p>
              )}
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
          <div className="flex justify-between text-xs text-white/30">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          {order.delivery_fee > 0 && (
            <div className="flex justify-between text-xs text-white/30">
              <span>Envío</span>
              <span>${order.delivery_fee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold">
            <span className="text-white">Total</span>
            <span className="text-[#FFC700]">${order.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-white/20 mt-1">
            <span>Método de pago</span>
            <span>{PAYMENT_LABELS[order.payment_method]}</span>
          </div>
        </div>
      </div>

      {/* Timestamps */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Cronología</h3>
        <div className="space-y-2">
          <TimelineItem label="Creado" time={order.created_at} active />
          {order.kitchen_started_at && <TimelineItem label="Cocina comenzó" time={order.kitchen_started_at} active />}
          {order.kitchen_ready_at && <TimelineItem label="Listo" time={order.kitchen_ready_at} active />}
          {order.dispatched_at && <TimelineItem label="Despachado" time={order.dispatched_at} active />}
          {order.delivered_at && <TimelineItem label="Entregado" time={order.delivered_at} active />}
          {order.cancelled_at && <TimelineItem label="Cancelado" time={order.cancelled_at} active={false} red />}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Cambiar Estado</h3>
        <div className="flex flex-wrap gap-2">
          {statusFlow
            .filter((s) => statusFlow.indexOf(s) > currentIdx)
            .map((s) => (
              <button
                key={s}
                onClick={() => onStatusChange(s)}
                className="px-4 py-2.5 rounded-xl text-xs font-medium bg-white/5 text-white/60 hover:bg-white/10 transition-all border border-white/5"
              >
                → {STATUS_LABELS[s]}
              </button>
            ))}
          {order.status !== 'cancelled' && (
            <button
              onClick={() => onStatusChange('cancelled')}
              className="px-4 py-2.5 rounded-xl text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/10"
            >
              Cancelar Pedido
            </button>
          )}
        </div>
      </div>

      {/* Contact Buttons */}
      <div className="flex gap-2">
        <a
          href={`tel:${order.customer_phone}`}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-white/60 text-xs font-medium hover:bg-white/10 transition-all border border-white/5"
        >
          <Phone className="w-3.5 h-3.5" /> Llamar
        </a>
        <a
          href={`https://wa.me/${order.customer_phone.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500/10 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-all border border-green-500/10"
        >
          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
        </a>
      </div>
    </div>
  );
}

function TimelineItem({ label, time, active, red }: { label: string; time: string; active: boolean; red?: boolean }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className={cn(
        'w-2 h-2 rounded-full flex-shrink-0',
        red ? 'bg-red-500' : active ? 'bg-[#FFC700]' : 'bg-white/10'
      )} />
      <span className="text-xs text-white/50 flex-1">{label}</span>
      <span className="text-[10px] text-white/20">{formatTime(time)}</span>
    </div>
  );
}

// ============================================
// PRODUCT EDITOR
// ============================================

function ProductEditor({
  product,
  onBack,
  onSave,
}: {
  product: Product | null;
  onBack: () => void;
  onSave: (product: Product) => void;
}) {
  const isNew = !product;
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price || 0);
  const [category, setCategory] = useState<ProductCategory>(product?.category || 'burgers');
  const [imageUrl, setImageUrl] = useState(product?.image_url || '');
  const [prepTime, setPrepTime] = useState(product?.prep_time_minutes || 10);
  const [isFeatured, setIsFeatured] = useState(product?.is_featured || false);
  const [isAvailable, setIsAvailable] = useState(product?.is_available ?? true);
  const [ingredients, setIngredients] = useState<string[]>(product?.ingredients_to_remove || []);
  const [newIngredient, setNewIngredient] = useState('');

  const handleSave = () => {
    const now = new Date().toISOString();
    const saved: Product = {
      id: product?.id || `new-${Date.now()}`,
      name,
      description,
      price,
      category,
      image_url: imageUrl || null,
      video_url: product?.video_url || null,
      customizations: product?.customizations || [],
      ingredients_to_remove: ingredients,
      is_available: isAvailable,
      is_featured: isFeatured,
      sort_order: product?.sort_order || 99,
      prep_time_minutes: prepTime,
      created_at: product?.created_at || now,
      updated_at: now,
    };
    onSave(saved);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al menú
      </button>

      <h2 className="text-xl font-bold text-white">{isNew ? 'Nuevo Producto' : `Editar: ${product.name}`}</h2>

      {/* Image Preview */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
            {imageUrl ? (
              <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImagePlus className="w-6 h-6 text-white/10" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm text-white font-semibold">{name || 'Nombre del producto'}</p>
            <p className="text-[11px] text-white/30 mt-0.5">{CATEGORY_LABELS[category]} · ${price.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Información Básica</h3>
        <SettingsField label="Nombre">                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="settings-input" placeholder="Ej: Mi Restaurante" />
        </SettingsField>
        <SettingsField label="Descripción">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="settings-input min-h-[80px] resize-none"
            placeholder="Descripción corta del producto..."
          />
        </SettingsField>
        <div className="grid grid-cols-2 gap-3">
          <SettingsField label="Precio ($)">
            <input type="number" step="0.50" value={price} onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} className="settings-input" />
          </SettingsField>
          <SettingsField label="Tiempo prep (min)">
            <input type="number" value={prepTime} onChange={(e) => setPrepTime(parseInt(e.target.value) || 0)} className="settings-input" />
          </SettingsField>
        </div>
        <SettingsField label="Categoría">
          <select value={category} onChange={(e) => setCategory(e.target.value as ProductCategory)} className="settings-input">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </SettingsField>
        <SettingsField label="URL de imagen">
          <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="settings-input" placeholder="https://..." />
        </SettingsField>
      </div>

      {/* Toggles */}
      <div className="glass-card rounded-2xl p-5 space-y-3">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Opciones</h3>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-white/70">Disponible en el menú</span>
          <button onClick={() => setIsAvailable(!isAvailable)}>
            {isAvailable ? <ToggleRight className="w-8 h-8 text-green-500" /> : <ToggleLeft className="w-8 h-8 text-white/20" />}
          </button>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-white/70">Destacado (★)</span>
          <button onClick={() => setIsFeatured(!isFeatured)}>
            {isFeatured ? <ToggleRight className="w-8 h-8 text-[#FFC700]" /> : <ToggleLeft className="w-8 h-8 text-white/20" />}
          </button>
        </div>
      </div>

      {/* Ingredients to Remove */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Ingredientes removibles</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {ingredients.map((ing) => (
            <span key={ing} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 text-xs text-white/60 border border-white/10">
              {ing}
              <button onClick={() => setIngredients(ingredients.filter((i) => i !== ing))} className="text-white/20 hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newIngredient.trim()) {
                setIngredients([...ingredients, newIngredient.trim()]);
                setNewIngredient('');
              }
            }}
            placeholder="Agregar ingrediente..."
            className="settings-input flex-1"
          />
          <button
            onClick={() => {
              if (newIngredient.trim()) {
                setIngredients([...ingredients, newIngredient.trim()]);
                setNewIngredient('');
              }
            }}
            className="px-4 py-2 rounded-xl bg-white/5 text-white/50 text-xs hover:bg-white/10 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={!name.trim()}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all',
          name.trim()
            ? 'bg-[#FFC700] text-black hover:bg-[#FFD633]'
            : 'bg-white/5 text-white/20 cursor-not-allowed'
        )}
      >
        <Save className="w-4 h-4" />
        {isNew ? 'Crear Producto' : 'Guardar Cambios'}
      </button>
    </div>
  );
}

// ============================================
// SETTINGS COMPONENTS
// ============================================

function SettingsSection({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-[#FFC700]" />
        <h3 className="text-sm font-semibold text-white/70">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function SettingsField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] text-white/30 mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

// ============================================
// LIVE MONITOR COMPONENTS
// ============================================

function LivePanel({ title, icon, accentColor, children }: { title: string; icon: React.ReactNode; accentColor: string; children: React.ReactNode }) {
  const borderColors: Record<string, string> = {
    orange: 'border-orange-500/10',
    blue: 'border-blue-500/10',
    green: 'border-green-500/10',
  };
  return (
    <div className={cn('glass-card rounded-2xl p-4 border', borderColors[accentColor] || 'border-white/5')}>
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
        {icon}
        <h3 className="text-sm font-semibold text-white/70">{title}</h3>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[9px] text-white/20">Live</span>
        </div>
      </div>
      <div className="max-h-[300px] overflow-y-auto">{children}</div>
    </div>
  );
}

function LiveOrderCard({ order, now }: { order: Order; now: number }) {
  const elapsed = Math.floor((now - new Date(order.created_at).getTime()) / 60000);
  const isUrgent = elapsed > 15;
  const isWarning = elapsed > 10;

  return (
    <div className={cn(
      'p-3 rounded-xl border transition-all',
      isUrgent ? 'bg-red-500/5 border-red-500/10' :
      isWarning ? 'bg-yellow-500/5 border-yellow-500/10' :
      'bg-white/[0.02] border-white/5'
    )}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold text-white">#{order.order_number}</span>
        <span className={cn(
          'text-[10px] font-bold',
          isUrgent ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-white/30'
        )}>
          {elapsed}min
        </span>
      </div>
      <p className="text-[11px] text-white/50 truncate">{order.customer_name}</p>
      <div className="flex flex-wrap gap-1 mt-1.5">
        {order.items.map((item, i) => (
          <span key={i} className="text-[9px] bg-white/5 text-white/30 px-1.5 py-0.5 rounded">
            {item.quantity}x {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-8">
      <CheckCircle className="w-8 h-8 text-white/5 mx-auto mb-2" />
      <p className="text-[11px] text-white/20">{message}</p>
    </div>
  );
}
