import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks: Record<string, boolean> = {};

  // Check SQLite
  try {
    db.prepare('SELECT 1').get();
    checks.sqlite = true;
  } catch {
    checks.sqlite = false;
  }

  // Check JSON data files
  const dataFiles = ['tours.json', 'news.json', 'site-content.json'];
  for (const file of dataFiles) {
    try {
      await fs.access(path.join(process.cwd(), 'data', file));
      checks[file] = true;
    } catch {
      checks[file] = false;
    }
  }

  const healthy = Object.values(checks).every(Boolean);
  return NextResponse.json(
    { status: healthy ? 'ok' : 'degraded', checks },
    { status: healthy ? 200 : 503 }
  );
}
