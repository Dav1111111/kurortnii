import { NextResponse } from 'next/server';
import toursData from '@/data/tours.json';
import type { NewsData } from '@/lib/news';
import rawNewsData from '@/data/news.json';

export const dynamic = 'force-dynamic';

const INDEXNOW_KEY = '22288b2612d346dba480afdee80f5ca0';
const HOST = 'xn----jtbbjdhsdbbg3ce9iub.xn--p1ai';
const BASE_URL = `https://${HOST}`;

const newsData = rawNewsData as NewsData;

function getAllUrls(): string[] {
  const staticPages = [
    '', '/tours', '/about', '/contact', '/news',
    '/faq', '/reviews', '/privacy', '/terms',
  ];

  const tourPages = toursData.tours.map((t) => `/tours/${t.slug}`);
  const newsPages = newsData.articles
    .filter((a) => a.published)
    .map((a) => `/news/${a.slug}`);

  return [...staticPages, ...tourPages, ...newsPages].map((p) => `${BASE_URL}${p}`);
}

// POST /api/indexnow — submit all URLs to IndexNow
export async function POST() {
  try {
    const urlList = getAllUrls();

    const body = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
      urlList,
    };

    // Submit to Yandex IndexNow endpoint
    const yandexRes = await fetch('https://yandex.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });

    // Submit to Bing/IndexNow endpoint
    const bingRes = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });

    return NextResponse.json({
      ok: true,
      urlCount: urlList.length,
      yandex: yandexRes.status,
      bing: bingRes.status,
    });
  } catch (err) {
    console.error('IndexNow error:', err);
    return NextResponse.json({ error: 'IndexNow failed' }, { status: 500 });
  }
}

// GET /api/indexnow — preview what would be submitted
export async function GET() {
  return NextResponse.json({
    key: INDEXNOW_KEY,
    urls: getAllUrls(),
  });
}
