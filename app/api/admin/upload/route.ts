import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string | null) ?? '';

    if (!file) {
      return NextResponse.json({ error: 'Файл не передан' }, { status: 400 });
    }

    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return NextResponse.json({ error: 'Допустимые форматы: JPEG, PNG, WebP, GIF' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Файл слишком большой (макс. 10 МБ)' }, { status: 400 });
    }

    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Resolve upload dir inside public/ with path traversal protection
    const publicRoot = path.join(process.cwd(), 'public');
    const uploadDir = folder
      ? path.resolve(publicRoot, folder.replace(/^\//, ''))
      : path.join(publicRoot, 'tours');

    // Prevent path traversal
    if (!uploadDir.startsWith(publicRoot)) {
      return NextResponse.json({ error: 'Недопустимая папка' }, { status: 400 });
    }

    await fs.mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, safeName);
    await fs.writeFile(filePath, buffer);

    const publicPath = '/' + path.relative(publicRoot, filePath).replace(/\\/g, '/');
    return NextResponse.json({ url: publicPath });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 });
  }
}
