import { NextRequest, NextResponse } from 'next/server';

// Daha basit bir middleware yaklaşımı - Edge Runtime uyumlu
export function middleware(request: NextRequest) {
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth/signin', '/auth/error', '/auth/signout'];
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname === route);
  
  // API routes that should always be accessible (e.g., auth endpoints)
  const publicApiRoutes = ['/api/auth'];
  const isPublicApiRoute = publicApiRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  // Sadece korumalı API rotalarını kontrol et
  if (!isPublicRoute && !isPublicApiRoute && request.nextUrl.pathname.startsWith('/api/')) {
    // Cookie basit kontrolü
    const hasAuthCookie = request.cookies.has('next-auth.session-token') || 
                          request.cookies.has('__Secure-next-auth.session-token');
    
    if (!hasAuthCookie) {
      return NextResponse.json(
        { error: 'Kimlik doğrulama gerekli' },
        { status: 401 }
      );
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Sadece API'leri koruyalım, sayfa koruması için client-side useSession kullanacağız
    '/api/:path*',
  ]
}; 