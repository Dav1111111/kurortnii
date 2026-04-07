import { NextRequest, NextResponse } from 'next/server';
import { readTours, writeTours, slugify } from '@/lib/tours';
import type { Tour } from '@/lib/tours';

export async function GET() {
  try {
    const data = await readTours();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Ошибка чтения' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await readTours();

    const id = Date.now().toString();
    const slug = body.slug?.trim() || slugify(body.title);

    // Check slug uniqueness
    if (data.tours.some((t) => t.slug === slug)) {
      return NextResponse.json({ error: 'Тур с таким slug уже существует' }, { status: 409 });
    }

    const tour: Tour = {
      id,
      slug,
      title: body.title,
      description: body.description ?? '',
      image: body.image ?? '',
      imagesFolder: body.imagesFolder,
      durationHours: Number(body.durationHours) || 0,
      priceRub: Number(body.priceRub) || 0,
      priceUnit: body.priceUnit,
      priceNote: body.priceNote,
      days: Array.isArray(body.days) ? body.days : [],
      daysText: body.daysText,
      startTime: body.startTime,
      groupSize: body.groupSize ?? '',
      rating: Number(body.rating) || 0,
      reviewCount: Number(body.reviewCount) || 0,
      seatsLeft: Number(body.seatsLeft) || 0,
      category: body.category ?? '',
      includes: Array.isArray(body.includes) ? body.includes : [],
      excludes: body.excludes,
      program: body.program,
      prices: body.prices,
      importantInfo: body.importantInfo,
    };

    data.tours.push(tour);
    await writeTours(data);
    return NextResponse.json(tour, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Ошибка создания' }, { status: 500 });
  }
}
