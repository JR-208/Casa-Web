import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Modo demo: permitir acceso sin autenticacion si no hay Supabase configurado
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL
  
  const isAuthenticated = request.cookies.get('hogar_auth')?.value === 'true' || isDemoMode
  const isLoginPage = request.nextUrl.pathname === '/login'
  
  if (!isAuthenticated && !isLoginPage) return NextResponse.redirect(new URL('/login', request.url))
  if (isAuthenticated && isLoginPage) return NextResponse.redirect(new URL('/dashboard', request.url))
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
