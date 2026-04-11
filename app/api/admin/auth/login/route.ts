import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { signSession, SESSION_COOKIE } from '@/lib/auth';

// Rate limiting: 5 attempts per minute per IP
const attempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    // Cleanup expired entries to prevent memory leak
    if (attempts.size > 500) {
      attempts.forEach((v, k) => {
        if (now > v.resetAt) attempts.delete(k);
      });
    }
    attempts.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  entry.count++;
  return entry.count <= 5;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Слишком много попыток. Подождите минуту.' }, { status: 429 });
    }

    const { password } = await request.json();
    const expected = process.env.ADMIN_PASSWORD;

    if (!expected || !password ||
        password.length !== expected.length ||
        !crypto.timingSafeEqual(Buffer.from(password), Buffer.from(expected))) {
      return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 });
    }

    const token = signSession();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
