"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Clock, Users, ChevronRight, ImageIcon, Check, AlertCircle } from "lucide-react";
import { ImageGallery } from "@/components/image-gallery";

interface Tour {
  id: string;
  title: string;
  description: string;
  image: string;
  imagesFolder?: string;
  durationHours: number;
  priceRub: number;
  priceUnit?: string;
  priceNote?: string;
  days: string[];
  daysText?: string;
  startTime?: string | { weekday?: string; weekend?: string };
  groupSize: string;
  rating: number;
  reviewCount: number;
  seatsLeft: number;
  category: string;
  includes: string[];
  excludes?: string[];
  slug: string;
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  city:      { label: "Городские",  color: "bg-turquoise-100 text-turquoise-700" },
  abkhazia:  { label: "Абхазия",    color: "bg-emerald-100 text-emerald-700" },
  jeeping:   { label: "Джипинг",    color: "bg-orange-100 text-orange-700" },
  nature:    { label: "Горы",       color: "bg-blue-100 text-blue-700" },
  family:    { label: "Семейное",   color: "bg-purple-100 text-purple-700" },
  adventure: { label: "Экстрим",    color: "bg-red-100 text-red-700" },
};

export function TourCard({ tour }: { tour: Tour }) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([tour.image]);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (tour.imagesFolder) {
      fetch(`/api/tour-images?folder=${encodeURIComponent(tour.imagesFolder)}`)
        .then((r) => r.ok ? r.json() : [])
        .then((imgs) => imgs.length > 0 && setGalleryImages(imgs))
        .catch(() => {});
    }
  }, [tour.imagesFolder]);

  const cat = CATEGORY_LABELS[tour.category];
  const isLowSeats = tour.seatsLeft > 0 && tour.seatsLeft <= 5;
  const isSoldOut = tour.seatsLeft === 0;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="group relative rounded-2xl bg-white dark:bg-card border border-border overflow-hidden flex flex-col shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
      >

        {/* Image */}
        <div
          className="relative h-52 overflow-hidden cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label={`Открыть галерею: ${tour.title}`}
          onClick={() => setGalleryOpen(true)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setGalleryOpen(true); } }}
        >
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={tour.image}
              alt={tour.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </motion.div>

          {/* Gradient bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Price badge */}
          <div className="absolute bottom-3 left-3">
            <div className="inline-flex items-baseline gap-0.5 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-black/80 backdrop-blur-sm">
              <span className="text-lg font-extrabold text-[#0A1628] dark:text-white" style={{ letterSpacing: "-0.03em" }}>
                {tour.priceRub.toLocaleString("ru-RU")} ₽
              </span>
              <span className="text-xs text-muted-foreground ml-0.5">/{tour.priceUnit || "чел."}</span>
            </div>
          </div>

          {/* Category tag */}
          {cat && (
            <div className="absolute top-3 left-3">
              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${cat.color}`}>
                {cat.label}
              </span>
            </div>
          )}

          {/* Gallery count */}
          {galleryImages.length > 1 && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                <ImageIcon className="h-3 w-3" />
                {galleryImages.length}
              </span>
            </div>
          )}

          {/* Seats warning */}
          {isLowSeats && (
            <div className="absolute bottom-3 right-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-coral-500 text-white text-xs font-semibold">
                <AlertCircle className="h-3 w-3" />
                Осталось {tour.seatsLeft}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          {/* Rating */}
          {tour.reviewCount > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold">{tour.rating}</span>
              <span className="text-xs text-muted-foreground">({tour.reviewCount})</span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-bold text-base leading-snug mb-2 line-clamp-2 group-hover:text-turquoise-600 dark:group-hover:text-turquoise-400 transition-colors">
            {tour.title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
            {tour.description}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {tour.durationHours} ч
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {tour.groupSize}
            </span>
          </div>

          {/* Details toggle */}
          <AnimatePresence initial={false}>
            {detailsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden mb-4"
              >
                <div className="border-t pt-4 space-y-3">
                  {/* Important info */}
                  <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-800 p-3">
                    <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1.5">Важно знать</p>
                    <ul className="space-y-1 text-xs text-amber-700 dark:text-amber-400">
                      <li>• В любую погоду</li>
                      <li>• Возврат за 24 ч до начала</li>
                      <li>• При опоздании — без возврата</li>
                    </ul>
                  </div>
                  {/* Includes */}
                  <div>
                    <p className="text-xs font-semibold mb-1.5">Включено:</p>
                    <ul className="space-y-1">
                      {tour.includes.slice(0, 4).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <Check className="h-3.5 w-3.5 text-turquoise-500 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Days */}
                  <div>
                    <p className="text-xs font-semibold mb-1">Дни:</p>
                    <p className="text-xs text-muted-foreground">{tour.daysText ?? tour.days.join(", ")}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Buttons */}
          <div className="flex gap-2 mt-auto">
            <button
              onClick={() => setDetailsOpen(!detailsOpen)}
              className="px-4 py-3 rounded-xl text-xs font-semibold border border-border hover:border-turquoise-300 dark:hover:border-turquoise-700 hover:text-turquoise-600 dark:hover:text-turquoise-400 transition-colors min-h-[44px]"
            >
              {detailsOpen ? "Свернуть" : "Детали"}
            </button>
            <Link href={`/tours/${tour.slug}`} className="flex-1">
              <motion.button
                whileTap={{ scale: 0.97 }}
                disabled={isSoldOut}
                className="w-full py-3 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 hover:shadow-[0_6px_24px_rgba(255,127,80,0.45)] min-h-[44px]"
                style={{
                  background: isSoldOut
                    ? "#9ca3af"
                    : "linear-gradient(135deg, #FF7F50 0%, #f05d29 100%)",
                  boxShadow: isSoldOut ? "none" : "0 3px 12px rgba(255,127,80,0.3)",
                }}
              >
                {isSoldOut ? "Нет мест" : "Забронировать"}
                {!isSoldOut && <ChevronRight className="h-3.5 w-3.5" />}
              </motion.button>
            </Link>
          </div>

          {tour.priceNote && (
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-2 text-center">
              ⓘ {tour.priceNote}
            </p>
          )}
        </div>
      </motion.article>

      <ImageGallery images={galleryImages} isOpen={galleryOpen} onClose={() => setGalleryOpen(false)} />
    </>
  );
}
