"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Clock, ArrowRight, Flame } from "lucide-react";
import toursData from "@/data/tours.json";

// Топ-5 туров: 1 featured + 4 в сетке
const TOP_SLUGS = [
  "bigfoot-quads",
  "golden-ring-abkhazia",
  "olympic-evening-fountains",
  "jeep-33-waterfalls-show",
  "guest-abkhazia",
];

const topTours = TOP_SLUGS.map((slug) =>
  toursData.tours.find((t) => t.slug === slug)
).filter(Boolean) as typeof toursData.tours;

function TourCard({ tour, index, featured }: { tour: typeof toursData.tours[0]; index: number; featured?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      className={featured ? "sm:col-span-2" : ""}
    >
      <Link
        href={`/tours/${tour.slug}`}
        className="group relative flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-[#111827] shadow-card hover:shadow-card-hover transition-shadow duration-300 h-full"
      >
        {/* Image */}
        <div className={`relative overflow-hidden flex-shrink-0 ${featured ? "h-64 sm:h-72 lg:h-80" : "h-56 sm:h-64"}`}>
          <Image
            src={tour.image}
            alt={tour.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes={featured ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Price badge */}
          <div className="absolute bottom-3 left-3 flex items-baseline gap-0.5 bg-white/95 dark:bg-black/90 backdrop-blur-sm rounded-xl px-3 py-1.5">
            <span className="text-[#0A1628] dark:text-white font-extrabold text-lg" style={{ letterSpacing: "-0.03em" }}>
              {tour.priceRub.toLocaleString("ru-RU")} ₽
            </span>
            <span className="text-muted-foreground text-xs ml-0.5">/чел.</span>
          </div>

          {/* Hot badge */}
          {index === 0 && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-coral-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              <Flame className="h-3 w-3" />
              Хит
            </div>
          )}
        </div>

        {/* Content */}
        <div className={`flex flex-col flex-1 gap-2 ${featured ? "p-5 sm:p-6" : "p-4"}`}>
          <h3
            className="font-bold text-[#0A1628] dark:text-white leading-tight line-clamp-2"
            style={{ fontSize: featured ? "clamp(1.1rem, 1.8vw, 1.35rem)" : "clamp(0.95rem, 1.5vw, 1.05rem)" }}
          >
            {tour.title}
          </h3>

          <p className={`text-muted-foreground flex-1 ${featured ? "text-sm sm:text-base line-clamp-3" : "text-sm line-clamp-2"}`}>
            {tour.description}
          </p>

          <div className="flex items-center justify-between pt-1 mt-auto">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {tour.reviewCount > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-[#0A1628] dark:text-white">{tour.rating}</span>
                  <span className="text-xs">({tour.reviewCount})</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {tour.durationHours}ч
              </span>
            </div>
            <span className="text-turquoise-600 dark:text-turquoise-400 text-sm font-semibold flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
              Подробнее <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function HotOffers() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });

  return (
    <section className="section bg-muted/50 dark:bg-[#0d1520]">
      <div className="container">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Flame className="h-5 w-5 text-coral-500" />
              <span className="text-xs font-semibold uppercase tracking-widest text-coral-500">
                Горячие предложения
              </span>
            </div>
            <h2
              className="font-extrabold text-[#0A1628] dark:text-white text-balance"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
            >
              Самые популярные{" "}
              <span className="text-gradient">туры</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              Выбор тысяч туристов — маршруты с лучшими отзывами и самым высоким рейтингом
            </p>
          </div>

          {/* Desktop CTA */}
          <Link
            href="/tours"
            className="hidden sm:inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white hover:shadow-[0_6px_24px_rgba(255,127,80,0.45)] transition-all flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #FF7F50, #f05d29)" }}
          >
            Все экскурсии <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {topTours.map((tour, i) => (
            <TourCard key={tour.slug} tour={tour} index={i} featured={i === 0} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm text-white hover:shadow-[0_6px_24px_rgba(255,127,80,0.45)] transition-all"
            style={{ background: "linear-gradient(135deg, #FF7F50, #f05d29)" }}
          >
            Смотреть все экскурсии <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
