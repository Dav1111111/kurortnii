import { NextRequest, NextResponse } from 'next/server';
import { getApprovedReviews, createReview } from '@/lib/db';
import { z } from 'zod';

const reviewSchema = z.object({
    name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
    location: z.string().min(2, 'Город должен содержать минимум 2 символа'),
    rating: z.number().min(1).max(5),
    comment: z.string().min(10, 'Отзыв должен содержать минимум 10 символов'),
});

// GET - получить все одобренные отзывы
export async function GET() {
    try {
        const reviews = getApprovedReviews();
        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Ошибка при получении отзывов:', error);
        return NextResponse.json(
            { error: 'Не удалось загрузить отзывы' },
            { status: 500 }
        );
    }
}

// POST - создать новый отзыв
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const validatedData = reviewSchema.parse(body);

        const review = createReview({
            name: validatedData.name,
            location: validatedData.location,
            rating: validatedData.rating,
            comment: validatedData.comment,
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Ошибка валидации', details: error.errors },
                { status: 400 }
            );
        }
        console.error('Ошибка при создании отзыва:', error);
        return NextResponse.json(
            { error: 'Не удалось создать отзыв' },
            { status: 500 }
        );
    }
}
