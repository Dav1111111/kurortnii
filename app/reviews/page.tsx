import { ReviewsPageSchema } from "@/components/tour-schema";
import { ReviewsClient } from "./reviews-client";

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
      <ReviewsPageSchema />
      <ReviewsClient />
    </div>
  );
}
