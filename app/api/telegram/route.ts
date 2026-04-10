import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// Rate limiting: 5 requests per minute per IP
const attempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  entry.count++;
  return entry.count <= 5;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

interface BookingPayload {
  fullName?: string;
  email?: string;
  phone?: string;
  date?: string;
  message?: string;
  tourTitle?: string;
  tourSlug?: string;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ ok: false, error: 'Слишком много запросов' }, { status: 429 });
    }

    const body = (await request.json()) as BookingPayload;
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = (process.env.TELEGRAM_CHAT_ID || "").replace(/[^0-9-]/g, "");

    if (!token || !chatId) {
      console.error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set');
      return NextResponse.json({ ok: false, error: 'Ошибка сервера' }, { status: 500 });
    }

    const lines: string[] = [];
    lines.push("Новая заявка на бронирование");
    if (body.tourTitle) lines.push(`Тур: ${escapeHtml(body.tourTitle)}`);
    if (body.tourSlug) lines.push(`Ссылка: https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/tours/${escapeHtml(body.tourSlug)}`);
    if (body.fullName) lines.push(`Имя: ${escapeHtml(body.fullName)}`);
    if (body.phone) lines.push(`Телефон: ${escapeHtml(body.phone)}`);
    if (body.email) lines.push(`Email: ${escapeHtml(body.email)}`);
    if (body.date) lines.push(`Дата: ${escapeHtml(body.date)}`);
    if (body.message) lines.push(`Комментарий: ${escapeHtml(body.message)}`);

    const text = lines.join("\n");

    const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(tgUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok || !data.ok) {
      console.error('Telegram API error:', data?.description);
      return NextResponse.json({ ok: false, error: 'Ошибка отправки' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Telegram route error:', err);
    return NextResponse.json({ ok: false, error: 'Ошибка сервера' }, { status: 500 });
  }
}
