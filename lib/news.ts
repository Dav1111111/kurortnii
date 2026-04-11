import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { slugify } from './tours';

const NEWS_PATH = path.join(process.cwd(), 'data', 'news.json');

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  publishedAt: string;
  published: boolean;
}

export interface NewsData {
  articles: NewsArticle[];
}

export async function readNews(): Promise<NewsData> {
  let raw: string;
  try {
    raw = await fs.readFile(NEWS_PATH, 'utf-8');
  } catch (err) {
    console.error('Failed to read news.json:', err);
    throw new Error('Не удалось прочитать файл новостей');
  }
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('news.json corrupted:', err);
    throw new Error('Файл новостей повреждён');
  }
}

let writeLock = Promise.resolve();

export async function writeNews(data: NewsData): Promise<void> {
  writeLock = writeLock.then(async () => {
    const tmp = NEWS_PATH + '.tmp';
    await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8');
    await fs.rename(tmp, NEWS_PATH);
  }).catch(err => {
    console.error('Failed to write news.json:', err);
    throw err;
  });
  await writeLock;

  revalidatePath('/');
  revalidatePath('/news');
}

export { slugify };
