"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote, ChevronRight, MessageSquare } from "lucide-react";
import Link from "next/link";

interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  created_at: string;
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3.5 w-3.5 ${s <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
        />
      ))}
    </div>
  );
}

const AVATAR_COLORS = [
  "bg-turquoise-100 text-turquoise-700",
  "bg-coral-100 text-coral-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
  "bg-emerald-100 text-emerald-700",
];

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) setReviews(await res.json());
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    }
    fetchReviews();
  }, []);

  return (
    <section ref={ref} className="section bg-[#0A1628] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-turquoise-500/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-coral-500/6 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="w-8 h-0.5 bg-turquoise-400 rounded-full" />
              <span className="text-xs font-semibold uppercase tracking-widest text-turquoise-400">
                Отзывы гостей
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
              className="text-white text-balance"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em" }}
            >
              Что говорят
              <br />
              <span className="text-gradient">наши гости</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/50 hover:text-white transition-colors group"
            >
              Все отзывы
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-turquoise-400/30 border-t-turquoise-400 rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && reviews.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <MessageSquare className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/40 mb-6">Пока нет отзывов. Будьте первым!</p>
            <Link href="/reviews">
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white border border-white/20 hover:border-turquoise-400 hover:text-turquoise-400 transition-all text-sm">
                Оставить отзыв
              </button>
            </Link>
          </motion.div>
        )}

        {/* Reviews grid */}
        {!isLoading && reviews.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {reviews.slice(0, 6).map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.08 }}
                className="break-inside-avoid mb-5"
              >
                <div className="group relative p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.15] transition-all duration-300">
                  {/* Quote mark */}
                  <Quote className="absolute top-4 right-5 h-8 w-8 text-turquoise-400/15 rotate-180" />

                  {/* Stars */}
                  <div className="flex items-center justify-between mb-4">
                    <StarRating rating={review.rating} />
                    <span className="text-white/20 text-xs">
                      {new Date(review.created_at).toLocaleDateString("ru-RU", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-white/70 text-sm leading-relaxed mb-5">
                    {review.comment}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        AVATAR_COLORS[i % AVATAR_COLORS.length]
                      }`}
                    >
                      {getInitials(review.name)}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold leading-tight">{review.name}</p>
                      {review.location && (
                        <p className="text-white/35 text-xs">{review.location}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA bottom */}
        {!isLoading && reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <Link href="/reviews">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white border border-white/20 hover:border-turquoise-400/60 hover:bg-turquoise-400/10 transition-all duration-300"
              >
                Читать все отзывы
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            </Link>
          </motion.div>
        )}

      </div>
    </section>
  );
}
