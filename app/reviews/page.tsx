import { Testimonials } from "@/components/testimonials";
import { ReviewForm } from "@/components/review-form";
import { ReviewsPageSchema } from "@/components/tour-schema";

export const metadata = {
  title: "Отзывы об экскурсиях в Сочи | Южный Континент",
  description: "Читайте отзывы туристов об экскурсиях Южного Континента в Сочи, Абхазии и на Красной Поляне. Оставьте свой отзыв о туре.",
  alternates: {
    canonical: "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/reviews"
  }
};

export default function ReviewsPage() {
  return (
    <div className="min-h-screen">
      {/*
        ReviewsPageSchema — агрегированный рейтинг TravelAgency.
        Позволяет Google показывать звёзды рядом с названием компании
        в результатах поиска.
        TODO: когда отзывы будут загружаться из БД, вычисляйте
        totalReviewCount и averageRating динамически в ReviewsPageSchema.
      */}
      <ReviewsPageSchema />

      <section className="py-20 bg-gradient-to-b from-turquoise-50 to-white dark:from-turquoise-950/20 dark:to-background">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Отзывы</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Узнайте, что говорят наши клиенты о путешествиях с нами
            </p>
          </div>
        </div>
      </section>

      <Testimonials />

      <section className="py-20 bg-white dark:bg-background">
        <div className="container">
          <ReviewForm />
        </div>
      </section>
    </div>
  );
}
