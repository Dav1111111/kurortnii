import { MetadataRoute } from 'next';
import toursData from '@/data/tours.json';
import type { NewsData } from '@/lib/news';
import rawNewsData from '@/data/news.json';

const newsData = rawNewsData as NewsData;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai';
  const now = new Date().toISOString().split('T')[0];

  // Статические страницы
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/tours`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/news`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/reviews`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Туры
  const tourPages: MetadataRoute.Sitemap = toursData.tours.map((tour) => ({
    url: `${baseUrl}/tours/${tour.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Новости (опубликованные)
  const newsPages: MetadataRoute.Sitemap = newsData.articles
    .filter((a) => a.published)
    .map((article) => ({
      url: `${baseUrl}/news/${article.slug}`,
      lastModified: article.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  return [...staticPages, ...tourPages, ...newsPages];
}
