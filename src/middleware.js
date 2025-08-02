// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request) {
  // This middleware does not modify or block anything.
  return NextResponse.next();
}

// Optionally define which paths it should run on
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'], // apply to all routes, ignore static, _next, and API
};
