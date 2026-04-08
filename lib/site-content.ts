import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const CONTENT_PATH = path.join(process.cwd(), 'data', 'site-content.json');

export interface Phone {
  name: string;
  number: string;
  raw: string;
}

export interface WorkHours {
  days: string;
  time: string;
}

export interface HeroContent {
  eyebrow: string;
  headlinePart1: string;
  headlinePart2: string;
  rotatingWords: string[];
  subtitle: string;
  heroImage: string;
  heroImageWebp: string;
  heroImageMobile: string;
}

export interface AboutContent {
  title: string;
  titleAccent: string;
  description: string;
  perks: string[];
  image: string;
  yearsCount: string;
  yearsLabel: string;
  yearsSublabel: string;
}

export interface ContactsContent {
  phones: Phone[];
  whatsapp: string;
  telegram: string;
  address: string;
  city: string;
  hours: WorkHours[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface SiteContent {
  hero: HeroContent;
  about: AboutContent;
  contacts: ContactsContent;
  faq: FaqItem[];
}

export async function readSiteContent(): Promise<SiteContent> {
  const raw = await fs.readFile(CONTENT_PATH, 'utf-8');
  return JSON.parse(raw);
}

let writeLock = Promise.resolve();

export async function writeSiteContent(data: SiteContent): Promise<void> {
  writeLock = writeLock.then(async () => {
    const tmp = CONTENT_PATH + '.tmp';
    await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8');
    await fs.rename(tmp, CONTENT_PATH);
  });
  await writeLock;

  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/faq');
  revalidatePath('/contact');
}
