import { NextResponse, type NextRequest } from 'next/server';

/**
 * Subdomain-based routing middleware.
 *
 * In production:
 *   menu.colesterol.ve      → serves src/app/page.tsx (the menu)
 *   pedidos.colesterol.ve   → serves src/app/pedidos/page.tsx (KDS)
 *   delivery.colesterol.ve  → serves src/app/delivery/page.tsx
 *   admin.colesterol.ve     → serves src/app/admin/page.tsx
 *
 * In development, all routes are accessible via path-based routing:
 *   localhost:3000/         → menu
 *   localhost:3000/pedidos  → KDS
 *   localhost:3000/delivery → delivery
 *   localhost:3000/admin    → admin
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // In development, skip subdomain routing
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  const host = request.headers.get('host') || '';

  // Extract subdomain
  const subdomain = host.split('.')[0];

  // Map subdomains to paths
  const subdomainMap: Record<string, string> = {
    menu: '/',
    pedidos: '/pedidos',
    delivery: '/delivery',
    admin: '/admin',
  };

  const targetPath = subdomainMap[subdomain];

  // If it's a known subdomain and we're not already on the right path
  if (targetPath && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = targetPath;
    return NextResponse.rewrite(url);
  }

  // For Vercel deployment, use path-based routing instead
  // The subdomains will be configured as separate Vercel projects
  // each pointing to the same repo but different build commands

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
