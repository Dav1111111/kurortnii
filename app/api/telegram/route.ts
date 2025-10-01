import { NextResponse } from "next/server";

interface BookingPayload {
  fullName?: string;
  email?: string;
  phone?: string;
  date?: string;
  message?: string;
  tourTitle?: string;
  tourSlug?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BookingPayload;
    const token = process.env.TELEGRAM_BOT_TOKEN;
    // Фолбэк по chat_id: берём из переменной окружения или используем предоставленный ID
    const fallbackChatId = "789082318"; // цифры из запроса, игнорируя лишние символы
    const chatId = (process.env.TELEGRAM_CHAT_ID || fallbackChatId).replace(/[^0-9-]/g, "");

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "TELEGRAM_BOT_TOKEN is not set" },
        { status: 500 }
      );
    }

    const lines: string[] = [];
    lines.push("Новая заявка на бронирование ✉️");
    if (body.tourTitle) lines.push(`Тур: ${body.tourTitle}`);
    if (body.tourSlug) lines.push(`Ссылка: https://kurortny-sochi.ru/tours/${body.tourSlug}`);
    if (body.fullName) lines.push(`Имя: ${body.fullName}`);
    if (body.phone) lines.push(`Телефон: ${body.phone}`);
    if (body.email) lines.push(`Email: ${body.email}`);
    if (body.date) lines.push(`Дата: ${body.date}`);
    if (body.message) lines.push(`Комментарий: ${body.message}`);

    const text = lines.join("\n");

    const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(tgUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      // Уменьшаем риск кэширования прокси
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok || !data.ok) {
      return NextResponse.json(
        { ok: false, error: data?.description || "Telegram API error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 });
  }
}


