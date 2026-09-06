import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Grabación con Drones 4K | Tomas Aéreas — TraccionWeb',
  description: 'Servicio profesional de grabación aérea con drones 4K. Fotografías y videos de alta calidad para inmobiliaria, eventos, negocios y redes sociales.',
  keywords: ['drones', 'grabación aérea', 'drone 4K', 'videos con drone', 'fotografía aérea', 'TraccionWeb', 'DJI Neo'],
  openGraph: {
    title: 'Grabación Aérea con Drones 4K — TraccionWeb',
    description: 'Tomas aéreas profesionales en resolución 4K. Edición cinematográfica, fotografía inmobiliaria y videos publicitarios para impactar a tu audiencia.',
    locale: 'es_VE',
    type: 'website',
    url: 'https://app.traccionweb.com/drones',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grabación Aérea con Drones 4K — TraccionWeb',
    description: 'Tomas aéreas profesionales en resolución 4K. Edición cinematográfica, fotografía inmobiliaria y videos publicitarios.',
  },
};

export default function DronesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
