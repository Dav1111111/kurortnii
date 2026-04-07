import { NextRequest, NextResponse } from 'next/server';
import { approveReview, deleteReview } from '@/lib/db';

export async function PATCH(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    const ok = approveReview(id);
    if (!ok) return NextResponse.json({ error: 'Не найдено' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    const ok = deleteReview(id);
    if (!ok) return NextResponse.json({ error: 'Не найдено' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}
