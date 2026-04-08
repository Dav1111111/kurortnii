import { NextRequest, NextResponse } from 'next/server';
import { readNews, writeNews } from '@/lib/news';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await readNews();
    const article = data.articles.find((a) => a.id === params.id);
    if (!article) return NextResponse.json({ error: 'Не найдено' }, { status: 404 });
    return NextResponse.json(article);
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
    const data = await readNews();
    const idx = data.articles.findIndex((a) => a.id === params.id);
    if (idx === -1) return NextResponse.json({ error: 'Не найдено' }, { status: 404 });

    const existing = data.articles[idx];
    data.articles[idx] = {
      ...existing,
      title: body.title ?? existing.title,
      slug: body.slug ?? existing.slug,
      excerpt: body.excerpt ?? existing.excerpt,
      content: body.content ?? existing.content,
      image: body.image ?? existing.image,
      publishedAt: body.publishedAt ?? existing.publishedAt,
      published: body.published ?? existing.published,
    };

    await writeNews(data);
    return NextResponse.json(data.articles[idx]);
  } catch {
    return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await readNews();
    const idx = data.articles.findIndex((a) => a.id === params.id);
    if (idx === -1) return NextResponse.json({ error: 'Не найдено' }, { status: 404 });
    data.articles.splice(idx, 1);
    await writeNews(data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Ошибка удаления' }, { status: 500 });
  }
}
