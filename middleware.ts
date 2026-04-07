import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'admin_session';
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

async function verifySessionEdge(value: string, secret: string): Promise<boolean> {
  try {
    const dotIdx = value.lastIndexOf('.');
    if (dotIdx === -1) return false;
    const payload = value.slice(0, dotIdx);
    const sig = value.slice(dotIdx + 1);

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigBytes = new Uint8Array(
      (sig.match(/.{1,2}/g) ?? []).map((b) => parseInt(b, 16))
    );
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(payload));
    if (!valid) return false;

    // base64url → base64 → JSON
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/').padEnd(
      payload.length + ((4 - (payload.length % 4)) % 4), '='
    ));
    const { ts } = JSON.parse(json);
    return Date.now() - ts < SESSION_MAX_AGE_MS;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow login page and auth API
  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/api/admin/auth/')
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const cookie = request.cookies.get(SESSION_COOKIE)?.value;
    const secret = process.env.ADMIN_PASSWORD ?? '';

    if (!cookie || !secret || !(await verifySessionEdge(cookie, secret))) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
