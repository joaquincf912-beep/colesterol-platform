'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  X, CreditCard, Banknote, Smartphone,
  Copy, Check, ArrowLeft, Loader2, Sparkles, MapPin
} from 'lucide-react';
import { useCart } from '@/stores/cart';
import { formatPrice, copyToClipboard, PAGO_MOVIL_DATA, cn } from '@/lib/utils';
import { broadcastNewOrder } from '@/lib/supabase/realtime';
import { useOrderStore } from '@/stores/orders';
import type { PaymentMethod } from '@/types';
import { toast } from 'sonner';
import OrderSuccess from './OrderSuccess';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  orderMode: 'dine_in' | 'delivery';
}

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: typeof CreditCard; description: string }[] = [
  { id: 'cash_usd', label: 'Efectivo USD', icon: Banknote, description: 'Pago en dólares americanos' },
  { id: 'cash_ves', label: 'Efectivo VES', icon: Banknote, description: 'Pago en bolívares' },
  { id: 'pago_movil', label: 'Pago Móvil', icon: Smartphone, description: 'Transferencia desde tu banco' },
  { id: 'zelle', label: 'Zelle', icon: CreditCard, description: 'Pago por Zelle' },
];

export default function Checkout({ isOpen, onClose, orderMode }: CheckoutProps) {
  const { items, getTotal, clearCart } = useCart();
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_usd');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderData, setOrderData] = useState<{
    orderId: string;
    orderNumber: number;
    total: number;
    items: { name: string; quantity: number; price: number }[];
  } | null>(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [locationGranted, setLocationGranted] = useState(false);
  const [customerCoords, setCustomerCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Request geolocation
  const requestLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCustomerCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationGranted(true);
      },
      () => {
        // User denied or error
        setLocationGranted(false);
      }
    );
  };

  // Auto-request location on checkout open
  useEffect(() => {
    if (isOpen && !locationGranted && !customerCoords) {
      requestLocation();
    }
  }, [isOpen]);

  const total = getTotal();
  const deliveryFee = 2.00;

  const handleCopyPagoMovil = async () => {
    const text = `${PAGO_MOVIL_DATA.ci}\n${PAGO_MOVIL_DATA.phone}\n${PAGO_MOVIL_DATA.bank}\nMonto: $${(total + deliveryFee).toFixed(2)}`;
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      toast.success('Datos copiados al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      toast.error('Completa nombre y telefono');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
        total_price: item.product.price * item.quantity,
        customizations: item.customizations,
        removed_ingredients: item.removed_ingredients,
        notes: item.notes,
      }));

      // Create order via API (cross-device sync)
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name,
          customer_phone: phone,
          customer_address: address || 'En local',
          items: orderItems,
          subtotal: total,
          delivery_fee: deliveryFee,
          total: total + deliveryFee,
          payment_method: paymentMethod,
        }),
      });
      const order = await res.json();

      // Also add to local store for instant UI update
      useOrderStore.getState().addOrder(order);

      // Prepare success data
      setOrderData({
        orderId: order.id,
        orderNumber: order.order_number || Math.floor(1000 + Math.random() * 9000),
        total: total + deliveryFee,
        items: items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price * item.quantity,
        })),
      });
      setShowSuccess(true);
    } catch {
      // Demo mode — create order in shared store
      const { useOrderStore } = await import('@/stores/orders');
      const store = useOrderStore.getState();
      const orderNumber = store.getNextOrderNumber();
      const now = new Date().toISOString();
      const newOrder = {
        id: 'order-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        order_number: orderNumber,
        customer_name: name,
        customer_phone: phone,
        customer_address: address || 'En local',
        customer_notes: null,
        items: items.map((item) => ({
          product_id: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          unit_price: item.product.price,
          total_price: item.product.price * item.quantity,
          customizations: item.customizations,
          removed_ingredients: item.removed_ingredients,
          notes: item.notes,
        })),
        subtotal: total,
        delivery_fee: deliveryFee,
        total: total + deliveryFee,
        payment_method: paymentMethod,
        payment_confirmed: true,
        status: 'received',
        assigned_driver_id: null,
        estimated_delivery_time: null,
        actual_delivery_time: null,
        kitchen_started_at: null,
        kitchen_ready_at: null,
        dispatched_at: null,
        delivered_at: null,
        cancelled_at: null,
        cancellation_reason: null,
        created_at: now,
        updated_at: now,
      };
      store.addOrder(newOrder as any);
      setOrderData({
        orderId: newOrder.id,
        orderNumber: orderNumber,
        total: total + deliveryFee,
        items: items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price * item.quantity,
        })),
      });
      setShowSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setOrderData(null);
    setStep('form');
    setName('');
    setPhone('');
    setAddress('');
    setPaymentMethod('cash_usd');
    onClose();
  };

  const handleClose = () => {
    setStep('form');
    setName('');
    setPhone('');
    setAddress('');
    setPaymentMethod('cash_usd');
    onClose();
  };

  return (
    <>
      {/* Checkout Form */}
      <AnimatePresence>
        {isOpen && !showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            style={{ background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
            onClick={handleClose}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 32, stiffness: 340, mass: 0.8 }}
              className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto"
              style={{
                background: 'rgba(22, 22, 24, 0.95)',
                backdropFilter: 'blur(40px) saturate(200%)',
                WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'clamp(16px, env(safe-area-inset-bottom, 0px) + 16px, 22px) 22px 22px 22px',
                boxShadow: '0 -4px 60px rgba(0, 0, 0, 0.5)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* iOS Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                  {step !== 'form' && (
                    <button
                      onClick={() => setStep('form')}
                      className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 text-white/60" />
                    </button>
                  )}
                  <h2 className="text-lg font-bold text-white">
                    {step === 'payment' ? 'Método de Pago' : 'Checkout'}
                  </h2>
                </div>
                <button onClick={handleClose} className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors">
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>

              <div className="px-6 pb-8 space-y-4">
                {/* FORM STEP */}
                {step === 'form' && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {/* Location Request */}
                      <button
                        onClick={requestLocation}
                        className={cn(
                          'w-full flex items-center justify-center gap-2 py-3 rounded-[14px] text-sm font-medium transition-all border',
                          locationGranted
                            ? 'bg-cholesterol-green/10 border-cholesterol-green/20 text-cholesterol-green'
                            : 'bg-white/[0.03] border-white/[0.06] text-white/50 hover:bg-white/[0.05]'
                        )}
                      >
                        <MapPin className="w-4 h-4" />
                        {locationGranted ? 'Ubicacion compartida' : 'Compartir mi ubicacion'}
                      </button>

                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre"
                        className="w-full bg-white/[0.04] border border-white/[0.04] rounded-[14px] px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cholesterol-yellow/20 focus:bg-white/[0.06] transition-all"
                      />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Teléfono (WhatsApp)"
                        className="w-full bg-white/[0.04] border border-white/[0.04] rounded-[14px] px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cholesterol-yellow/20 focus:bg-white/[0.06] transition-all"
                      />
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Dirección de entrega (opcional si comes al local)"
                        rows={2}
                        className="w-full bg-white/[0.04] border border-white/[0.04] rounded-[14px] px-4 py-3.5 text-sm text-white placeholder:text-white/20 resize-none focus:outline-none focus:border-cholesterol-yellow/20 focus:bg-white/[0.06] transition-all"
                      />
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white/[0.04] rounded-[14px] p-4 space-y-2.5 border border-white/[0.04]">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex justify-between text-sm">
                          <span className="text-white/50">
                            {item.quantity}x {item.product.name}
                          </span>
                          <span className="text-white/80 font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                        </div>
                      ))}
                      <div className="border-t border-white/[0.05] pt-2.5 flex justify-between text-sm">
                        <span className="text-white/30">Delivery</span>
                        <span className="text-white/40">{formatPrice(deliveryFee)}</span>
                      </div>
                      <div className="border-t border-white/[0.05] pt-2.5 flex justify-between">
                        <span className="font-semibold text-white">Total</span>
                        <span className="font-bold text-cholesterol-yellow text-lg">{formatPrice(total + deliveryFee)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setStep('payment')}
                      disabled={!name || !phone}
                      className="btn-primary w-full py-4 text-[15px]"
                    >
                      Continuar al Pago →
                    </button>
                  </div>
                )}

                {/* PAYMENT STEP */}
                {step === 'payment' && (
                  <div className="space-y-3">
                    {PAYMENT_METHODS.map((method) => (
                      <motion.button
                        key={method.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPaymentMethod(method.id)}
                        className={cn(
                          'w-full flex items-center gap-4 p-4 rounded-[14px] transition-all duration-200 border',
                          paymentMethod === method.id
                            ? 'bg-cholesterol-yellow/8 border-cholesterol-yellow/25'
                            : 'bg-white/[0.03] border-white/[0.04] hover:bg-white/[0.05]'
                        )}
                      >
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                          paymentMethod === method.id
                            ? 'bg-cholesterol-yellow text-black'
                            : 'bg-white/[0.06] text-white/40'
                        )}>
                          <method.icon className="w-5 h-5" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-medium text-white text-sm">{method.label}</p>
                          <p className="text-[11px] text-white/30 mt-0.5">{method.description}</p>
                        </div>
                        {paymentMethod === method.id && (
                          <div className="w-5 h-5 rounded-full bg-cholesterol-yellow flex items-center justify-center">
                            <Check className="w-3 h-3 text-black" strokeWidth={3} />
                          </div>
                        )}
                      </motion.button>
                    ))}

                    {/* Pago Móvil details */}
                    <AnimatePresence>
                      {paymentMethod === 'pago_movil' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="bg-white/[0.04] rounded-[14px] p-4 space-y-3 border border-white/[0.04]">
                            <h4 className="text-sm font-semibold text-white">Datos para transferir</h4>
                            <div className="space-y-1.5 text-sm">
                              <div className="flex justify-between">
                                <span className="text-white/30">Cedula</span>
                                <span className="text-white/80 font-mono text-sm">{PAGO_MOVIL_DATA.ci}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/30">Telefono</span>
                                <span className="text-white/80 font-mono text-sm">{PAGO_MOVIL_DATA.phone}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/30">Banco</span>
                                <span className="text-white/80 font-mono text-sm">{PAGO_MOVIL_DATA.bank}</span>
                              </div>
                              <div className="flex justify-between pt-2 border-t border-white/[0.05]">
                                <span className="text-white/30">Monto</span>
                                <span className="text-cholesterol-yellow font-bold">{formatPrice(total + deliveryFee)}</span>
                              </div>
                            </div>
                            <button
                              onClick={handleCopyPagoMovil}
                              className="btn-secondary w-full flex items-center justify-center gap-2 text-sm py-3"
                            >
                              {copied ? <Check className="w-4 h-4 text-cholesterol-green" /> : <Copy className="w-4 h-4" />}
                              {copied ? 'Copiado' : 'Copiar datos'}
                            </button>

                            {/* Reference Number Input */}
                            <div className="pt-2 border-t border-white/[0.05]">
                              <label className="text-[11px] text-white/30 mb-1.5 block">
                                Numero de referencia (una vez realices el pago)
                              </label>
                              <input
                                type="text"
                                value={referenceNumber}
                                onChange={(e) => setReferenceNumber(e.target.value)}
                                placeholder="Ej: 1234567890"
                                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-[12px] px-3.5 py-3 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-cholesterol-yellow/20 focus:bg-white/[0.06] transition-all font-mono tabular-nums"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-[15px]"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Enviar Pedido — {formatPrice(total + deliveryFee)}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Success Screen */}
      {orderData && (
        <OrderSuccess
          isOpen={showSuccess}
          orderId={orderData.orderId}
          orderNumber={orderData.orderNumber}
          customerName={name}
          paymentMethod={paymentMethod}
          total={orderData.total}
          items={orderData.items}
          orderMode={orderMode}
          onClose={handleCloseSuccess}
        />
      )}
    </>
  );
}
