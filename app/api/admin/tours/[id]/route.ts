import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { readTours, writeTours, slugify } from '@/lib/tours';
import type { Tour } from '@/lib/tours';
import { logAudit } from '@/lib/audit';
import { pingIndexNow } from '@/lib/indexnow';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await readTours();
    const tour = data.tours.find((t) => t.id === params.id || t.slug === params.id);
    if (!tour) return NextResponse.json({ error: 'Не найдено' }, { status: 404 });
    return NextResponse.json(tour);
  } catch {
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const data = await readTours();
    const idx = data.tours.findIndex((t) => t.id === params.id);
    if (idx === -1) return NextResponse.json({ error: 'Не найдено' }, { status: 404 });

    const existing = data.tours[idx];
    const newSlug = body.slug?.trim() || slugify(body.title ?? existing.title);

    // Check slug uniqueness (allow same tour)
    const slugConflict = data.tours.find((t, i) => i !== idx && t.slug === newSlug);
    if (slugConflict) {
      return NextResponse.json({ error: 'Slug уже используется другим туром' }, { status: 409 });
    }

    const updated: Tour = {
      ...existing,
      slug: newSlug,
      title: body.title ?? existing.title,
      description: body.description ?? existing.description,
      image: body.image ?? existing.image,
      imagesFolder: body.imagesFolder ?? existing.imagesFolder,
      durationHours: body.durationHours !== undefined ? Number(body.durationHours) : existing.durationHours,
      priceRub: body.priceRub !== undefined ? Number(body.priceRub) : existing.priceRub,
      priceUnit: body.priceUnit ?? existing.priceUnit,
      priceNote: body.priceNote ?? existing.priceNote,
      days: Array.isArray(body.days) ? body.days : existing.days,
      daysText: body.daysText ?? existing.daysText,
      startTime: body.startTime ?? existing.startTime,
      groupSize: body.groupSize ?? existing.groupSize,
      rating: body.rating !== undefined ? Number(body.rating) : existing.rating,
      reviewCount: body.reviewCount !== undefined ? Number(body.reviewCount) : existing.reviewCount,
      seatsLeft: body.seatsLeft !== undefined ? Number(body.seatsLeft) : existing.seatsLeft,
      category: body.category ?? existing.category,
      includes: Array.isArray(body.includes) ? body.includes : existing.includes,
      excludes: body.excludes ?? existing.excludes,
      program: body.program ?? existing.program,
      prices: body.prices ?? existing.prices,
      importantInfo: body.importantInfo ?? existing.importantInfo,
    };

    data.tours[idx] = updated;
    await writeTours(data);
    await logAudit('update', 'tour', params.id, request.headers.get('x-forwarded-for') ?? undefined);
    pingIndexNow([`/tours/${updated.slug}`, '/tours']);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await readTours();
    const idx = data.tours.findIndex((t) => t.id === params.id);
    if (idx === -1) return NextResponse.json({ error: 'Не найдено' }, { status: 404 });

    const deletedSlug = data.tours[idx].slug;
    data.tours.splice(idx, 1);
    await writeTours(data);
    await logAudit('delete', 'tour', params.id, request.headers.get('x-forwarded-for') ?? undefined);
    pingIndexNow([`/tours/${deletedSlug}`, '/tours']);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Ошибка удаления' }, { status: 500 });
  }
}
