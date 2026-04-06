import { ReviewsClient } from "./reviews-client";

export const metadata = {
  title: "Отзывы об экскурсиях в Сочи",
  description: "4.8 из 5 — реальные отзывы туристов о турах Южного Континента в Сочи, Абхазии и на Красной Поляне. Читайте отзывы и оставьте свой.",
  alternates: {
    canonical: "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/reviews"
  }
};

export default function ReviewsPage() {
  return (
    <div className="min-h-screen">
      {/* SSR hero — H1 visible to crawlers without JS */}
      <section className="relative pt-32 pb-16 bg-[#0A1628] overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-turquoise-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-coral-500/15 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-turquoise-400 rounded-full" />
            <span className="text-xs font-semibold uppercase tracking-widest text-turquoise-400">Отзывы</span>
          </div>
          <h1
            className="text-white font-extrabold mb-3 text-balance"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
          >
            Что говорят{" "}
            <span className="text-gradient">наши туристы</span>
          </h1>
        </div>
      </section>
      <ReviewsClient />
    </div>
  );
}
