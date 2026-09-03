import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/lib/auth';

export const metadata: Metadata = {
  title: {
    default: 'TraccionWeb App',
    template: '%s | TraccionWeb App',
  },
  description: 'La plataforma gastronomica premium de Venezuela. Burgers, street food y mas. Powered by TraccionWeb.',
  keywords: ['restaurante', 'burgers', 'street food', 'Venezuela', 'TraccionWeb'],
  manifest: '/manifest.json',
  openGraph: {
    title: 'TraccionWeb App',
    description: 'La plataforma gastronomica premium de Venezuela. Powered by TraccionWeb.',
    locale: 'es_VE',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-black text-white antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1C1C1E',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              borderRadius: '16px',
              backdropFilter: 'blur(20px)',
              fontFamily: '-apple-system, BlinkMacSystemFont, SF Pro Display, Inter, system-ui, sans-serif',
            },
          }}
          richColors
          closeButton
        />
      </body>
    </html>
  );
}
