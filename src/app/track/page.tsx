'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, ArrowLeft, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TrackPage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = () => {
    if (searchInput.trim()) {
      router.push(`/track/${searchInput.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-white/5"
        style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-white/60" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-white">Seguimiento de Pedido</h1>
            <p className="text-[10px] text-white/30">Tiempo real</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Icon */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-[#FFC700]/10 flex items-center justify-center mx-auto mb-5">
              <Package className="w-8 h-8 text-[#FFC700]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Donde esta tu pedido?</h2>
            <p className="text-sm text-white/30">
              Ingresa el numero de tu pedido para ver el estado en tiempo real
            </p>
          </div>

          {/* Search Input */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <input
                type="number"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Numero de pedido"
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-2xl pl-12 pr-5 py-4 text-lg text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFC700]/30 transition-colors font-mono tabular-nums"
                autoFocus
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!searchInput.trim()}
              className={cn(
                'w-full py-4 rounded-2xl font-semibold text-sm transition-all',
                searchInput.trim()
                  ? 'bg-[#FFC700] text-black hover:bg-[#FFD633] active:scale-[0.98]'
                  : 'bg-white/5 text-white/20 cursor-not-allowed'
              )}
            >
              Rastrear Pedido
            </button>
          </div>

          {/* Help */}
          <div className="text-center pt-4">
            <p className="text-[11px] text-white/20">
              El numero de pedido lo recibiste por WhatsApp o en tu comprobante
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
