import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Publicidad DOOH | Pantallas Digitales LED — TraccionWeb',
  description: 'Planes de publicidad en pantallas digitales DOOH. Desde $50/semana. Lleva tu marca a pantallas LED en centros comerciales, restaurantes y zonas de alto tráfico.',
  keywords: ['DOOH', 'publicidad exterior digital', 'pantallas LED', 'publicidad en pantallas', 'TraccionWeb', 'digital out of home'],
  openGraph: {
    title: 'Planes de Publicidad DOOH — Pantallas Digitales LED',
    description: 'Publicidad en pantallas digitales desde $50/semana. Lleva tu marca a pantallas LED en los mejores locations de la ciudad. Métricas en tiempo real.',
    locale: 'es_VE',
    type: 'website',
    url: 'https://app.traccionweb.com/dooh',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Planes de Publicidad DOOH — Pantallas Digitales LED',
    description: 'Publicidad en pantallas digitales desde $50/semana. Lleva tu marca a pantallas LED en los mejores locations de la ciudad.',
  },
};

export default function DoohLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
