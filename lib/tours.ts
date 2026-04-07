import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const TOURS_PATH = path.join(process.cwd(), 'data', 'tours.json');

export interface Tour {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  imagesFolder?: string;
  durationHours: number;
  priceRub: number;
  priceUnit?: string;
  priceNote?: string;
  days: string[];
  daysText?: string;
  startTime?: string;
  groupSize: string;
  rating: number;
  reviewCount: number;
  seatsLeft: number;
  category: string;
  includes: string[];
  excludes?: string[];
  program?: string[];
  prices?: string[];
  importantInfo?: string[];
}

// Write lock to prevent concurrent writes
let writeLock: Promise<void> = Promise.resolve();

export async function readTours(): Promise<{ tours: Tour[] }> {
  const raw = await fs.readFile(TOURS_PATH, 'utf-8');
  return JSON.parse(raw);
}

export async function writeTours(data: { tours: Tour[] }): Promise<void> {
  writeLock = writeLock.then(async () => {
    const tmp = TOURS_PATH + '.tmp';
    await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8');
    await fs.rename(tmp, TOURS_PATH);
  });
  await writeLock;
  revalidatePath('/');
  revalidatePath('/tours');
  revalidatePath('/tours/[slug]', 'page');
}

const cyrillicMap: Record<string, string> = {
  а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'y',
  к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',
  х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya',
};

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .split('')
    .map(c => cyrillicMap[c] ?? c)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
