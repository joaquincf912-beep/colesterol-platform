import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Produccion de Video DOOH | TraccionWeb',
  description: 'Producimos videos profesionales para pantallas DOOH, centros comerciales y espacios publicos. Desde $25/video. Calidad 4K, entrega en 24h.',
  keywords: ['DOOH', 'produccion de video', 'video publicitario', 'pantallas digitales', 'TraccionWeb', 'digital out of home', 'video 4K'],
  openGraph: {
    title: 'Produccion de Video DOOH — TraccionWeb',
    description: 'Videos profesionales para pantallas DOOH y centros comerciales. Desde $25/video. Calidad 4K, entrega en 24 horas.',
    locale: 'es_VE',
    type: 'website',
    url: 'https://app.traccionweb.com/dooh',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Produccion de Video DOOH — TraccionWeb',
    description: 'Videos profesionales para pantallas DOOH. Desde $25/video. Entrega en 24 horas.',
  },
};

export default function DoohLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
