import { NextResponse } from 'next/server';
import { getAllReviews } from '@/lib/db';

export async function GET() {
  try {
    const reviews = getAllReviews();
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}
