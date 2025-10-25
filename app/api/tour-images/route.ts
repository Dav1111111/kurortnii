import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');

    if (!folder) {
      return NextResponse.json({ error: 'Folder parameter is required' }, { status: 400 });
    }

    const imagesDir = path.join(process.cwd(), 'public', 'images', folder);
    
    // Проверяем существует ли папка
    try {
      await fs.access(imagesDir);
    } catch {
      return NextResponse.json([]);
    }

    const files = await fs.readdir(imagesDir);
    
    // Фильтруем только изображения
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const imageFiles = files.filter(file => 
      imageExtensions.some(ext => file.toLowerCase().endsWith(ext))
    );

    // Создаем полные пути
    const imagePaths = imageFiles.map(file => `/images/${folder}/${encodeURIComponent(file)}`);

    return NextResponse.json(imagePaths);
  } catch (error) {
    console.error('Error reading images:', error);
    return NextResponse.json({ error: 'Failed to read images' }, { status: 500 });
  }
}
