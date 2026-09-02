'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Lock, Mail, Shield, ChefHat, Truck } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

const ROLE_INFO = {
  admin: {
    label: 'Administrador',
    icon: Shield,
    color: 'text-[#FFC700]',
    bgColor: 'bg-[#FFC700]/10',
    description: 'Panel completo de administracion',
  },
  kitchen: {
    label: 'Cocina',
    icon: ChefHat,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    description: 'Sistema de visualizacion de pedidos',
  },
  delivery: {
    label: 'Repartidor',
    icon: Truck,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    description: 'Aplicacion de domicilios',
  },
};

const DEMO_CREDENTIALS = [
  { email: 'admin@colesterol.ve', password: 'admin123', role: 'admin' as const },
  { email: 'cocina@colesterol.ve', password: 'cocina123', role: 'kitchen' as const },
  { email: 'delivery@colesterol.ve', password: 'delivery123', role: 'delivery' as const },
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading } = useAuth();
  const redirectTo = searchParams.get('redirect') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLogging, setIsLogging] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLogging(true);

    const result = await login(email, password);

    if (result.error) {
      setError(result.error);
      setIsLogging(false);
      return;
    }

    // Navigate to appropriate page based on email
    const target = email.includes('admin')
      ? '/admin'
      : email.includes('cocina')
      ? '/pedidos'
      : '/delivery';

    router.push(redirectTo === '/admin' ? target : redirectTo);
  };

  const handleDemoLogin = (credentials: typeof DEMO_CREDENTIALS[0]) => {
    setEmail(credentials.email);
    setPassword(credentials.password);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-5">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#FFC700]/[0.02] rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#FFC700] flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(255,199,0,0.2)]">
            <span className="text-2xl font-black text-black">C</span>
          </div>
          <h1 className="text-xl font-bold text-white">Colesterol</h1>
          <p className="text-[11px] text-white/30 mt-1 tracking-wider uppercase">Staff Portal</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3 text-center"
            >
              <p className="text-xs text-red-400">{error}</p>
            </motion.div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full bg-white/[0.04] border border-white/[0.06] rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFC700]/30 transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contrasena"
              required
              className="w-full bg-white/[0.04] border border-white/[0.06] rounded-2xl pl-11 pr-11 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFC700]/30 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLogging || !email || !password}
            className={cn(
              'w-full py-3.5 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2',
              email && password
                ? 'bg-[#FFC700] text-black hover:bg-[#FFD633]'
                : 'bg-white/5 text-white/20 cursor-not-allowed'
            )}
          >
            {isLogging ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Ingresar'
            )}
          </button>
        </form>

        {/* Demo Accounts */}
        <div className="mt-8 space-y-2">
          <p className="text-[10px] text-white/20 text-center uppercase tracking-wider mb-3">
            Cuentas de demo
          </p>
          {DEMO_CREDENTIALS.map((cred) => {
            const info = ROLE_INFO[cred.role];
            const Icon = info.icon;
            return (
              <button
                key={cred.email}
                onClick={() => handleDemoLogin(cred)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left',
                  email === cred.email
                    ? 'bg-white/[0.04] border-[#FFC700]/20'
                    : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]'
                )}
              >
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', info.bgColor)}>
                  <Icon className={cn('w-4 h-4', info.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white/70">{info.label}</p>
                  <p className="text-[10px] text-white/30 truncate">{cred.email}</p>
                </div>
                <span className="text-[9px] text-white/15 font-mono">{cred.password}</span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
