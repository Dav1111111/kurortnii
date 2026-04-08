import { NextRequest, NextResponse } from 'next/server';
import { readSiteContent, writeSiteContent } from '@/lib/site-content';

export async function GET() {
  try {
    const data = await readSiteContent();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Ошибка чтения' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    await writeSiteContent(body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Ошибка сохранения' }, { status: 500 });
  }
}
