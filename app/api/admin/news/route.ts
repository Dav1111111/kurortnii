import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { readNews, writeNews, slugify } from '@/lib/news';
import type { NewsArticle } from '@/lib/news';
import { logAudit } from '@/lib/audit';
import { pingIndexNow } from '@/lib/indexnow';

export async function GET() {
  try {
    const data = await readNews();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Ошибка чтения' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await readNews();

    const id = Date.now().toString();
    const slug = body.slug?.trim() || slugify(body.title);

    if (data.articles.some((a) => a.slug === slug)) {
      return NextResponse.json({ error: 'Статья с таким slug уже существует' }, { status: 409 });
    }

    const article: NewsArticle = {
      id,
      slug,
      title: body.title ?? '',
      excerpt: body.excerpt ?? '',
      content: body.content ?? '',
      image: body.image ?? '',
      publishedAt: body.publishedAt ?? new Date().toISOString().slice(0, 10),
      published: body.published ?? false,
    };

    data.articles.unshift(article);
    await writeNews(data);
    await logAudit('create', 'news', id, request.headers.get('x-forwarded-for') ?? undefined);
    if (article.published) {
      pingIndexNow([`/news/${slug}`, '/news']);
    }
    return NextResponse.json(article, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Ошибка создания' }, { status: 500 });
  }
}
