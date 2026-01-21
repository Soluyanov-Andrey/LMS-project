import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const isAuthPage = request.nextUrl.pathname === '/login';

  // Если токена нет и мы пытаемся зайти на защищенную страницу
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Если токен есть и мы пытаемся зайти на страницу логина
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Указываем, какие пути должен проверять middleware
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};