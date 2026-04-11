"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { Star, Clock, ArrowRight, Flame, ChevronLeft, ChevronRight } from "lucide-react";
import toursData from "@/data/tours.json";

const allTours = toursData.tours;

function TourCard({ tour, index }: { tour: typeof toursData.tours[0]; index: number }) {
  const isHit = index === 0;

  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-[#111827] shadow-card hover:shadow-card-hover transition-shadow duration-300 h-full w-[280px] sm:w-[320px] flex-shrink-0 snap-start"
    >
      {/* Image */}
      <div className="relative overflow-hidden flex-shrink-0 h-52">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="320px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Price badge */}
        <div className="absolute bottom-3 left-3 flex items-baseline gap-0.5 bg-white/95 dark:bg-black/90 backdrop-blur-sm rounded-xl px-3 py-1.5">
          <span
            className="text-[#0A1628] dark:text-white font-extrabold text-lg"
            style={{ letterSpacing: "-0.03em" }}
          >
            {tour.priceRub.toLocaleString("ru-RU")} ₽
          </span>
          <span className="text-muted-foreground text-xs ml-0.5">/чел.</span>
        </div>

        {/* Hot badge */}
        {isHit && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-coral-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            <Flame className="h-3 w-3" />
            Хит
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-2 p-4">
        <h3 className="font-bold text-[#0A1628] dark:text-white leading-tight line-clamp-2 text-[0.95rem]">
          {tour.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 flex-1">
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
            Детали <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function HotOffers() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  const scrollBy = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 320 + 20;
    el.scrollBy({ left: direction === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
  };

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

          {/* Desktop: стрелки + кнопка */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => scrollBy("left")}
              disabled={!canScrollLeft}
              aria-label="Предыдущий тур"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-[#0A1628] dark:hover:text-white hover:border-[#0A1628] dark:hover:border-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scrollBy("right")}
              disabled={!canScrollRight}
              aria-label="Следующий тур"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-[#0A1628] dark:hover:text-white hover:border-[#0A1628] dark:hover:border-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <Link
              href="/tours"
              className="ml-2 inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white hover:shadow-[0_6px_24px_rgba(255,127,80,0.45)] transition-all"
              style={{ background: "linear-gradient(135deg, #FF7F50, #f05d29)" }}
            >
              Все экскурсии <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {/* Горизонтальный скролл */}
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {allTours.map((tour, i) => (
            <TourCard key={tour.slug} tour={tour} index={i} />
          ))}
          {/* Конечный отступ чтобы последняя карточка не прилипала к краю */}
          <div className="flex-shrink-0 w-4 sm:w-0" aria-hidden="true" />
        </div>

        {/* Mobile: кнопки скролла + CTA */}
        <div className="mt-6 flex items-center justify-between sm:hidden">
          <div className="flex gap-2">
            <button
              onClick={() => scrollBy("left")}
              disabled={!canScrollLeft}
              aria-label="Предыдущий тур"
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollBy("right")}
              disabled={!canScrollRight}
              aria-label="Следующий тур"
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white hover:shadow-[0_6px_24px_rgba(255,127,80,0.45)] transition-all"
            style={{ background: "linear-gradient(135deg, #FF7F50, #f05d29)" }}
          >
            Все туры <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
