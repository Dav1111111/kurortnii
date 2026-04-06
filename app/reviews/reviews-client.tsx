"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Star, Quote, Send, CheckCircle2, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  created_at: string;
}

const AVATAR_COLORS = [
  "bg-turquoise-100 text-turquoise-700 dark:bg-turquoise-900/40 dark:text-turquoise-300",
  "bg-coral-100 text-coral-700 dark:bg-coral-900/40 dark:text-coral-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function StarRating({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type={interactive ? "button" : undefined}
          disabled={!interactive}
          onClick={() => interactive && onRate?.(s)}
          onMouseEnter={() => interactive && setHovered(s)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={interactive ? "transition-transform hover:scale-110" : "cursor-default"}
        >
          <Star
            className={`${interactive ? "h-7 w-7" : "h-3.5 w-3.5"} transition-colors ${
              s <= (hovered || rating) ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const date = new Date(review.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.07 }}
      className="break-inside-avoid mb-5"
    >
      <div className="bg-white dark:bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${color}`}>
              {getInitials(review.name)}
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">{review.name}</p>
              <p className="text-xs text-muted-foreground">{review.location}</p>
            </div>
          </div>
          <Quote className="h-5 w-5 text-turquoise-300 dark:text-turquoise-700 flex-shrink-0 mt-0.5" />
        </div>
        <StarRating rating={review.rating} />
        <p className="text-sm text-muted-foreground leading-relaxed mt-3">{review.comment}</p>
        <p className="text-xs text-muted-foreground/60 mt-3">{date}</p>
      </div>
    </motion.div>
  );
}

export function ReviewsClient() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setReviews(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location, rating, comment }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ошибка");
      }
      setFormSuccess(true);
      setName(""); setLocation(""); setRating(5); setComment("");
      setTimeout(() => setFormSuccess(false), 6000);
      // Reload reviews
      const updated = await fetch("/api/reviews").then((r) => r.json()).catch(() => reviews);
      setReviews(updated);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Ошибка при отправке");
    } finally {
      setSubmitting(false);
    }
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "4.9";

  return (
    <>
      {/* Dynamic rating bar — client only (depends on loaded reviews count) */}
      <div className="bg-[#0A1628] pb-8">
        <div className="container">
          <div className="flex items-center gap-4">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((s) => <Star key={s} className="h-5 w-5 fill-amber-400 text-amber-400" />)}
            </div>
            <span className="text-white font-bold text-xl" style={{ letterSpacing: "-0.03em" }}>{avgRating}</span>
            <span className="text-white/40 text-sm">· {reviews.length} {reviews.length === 1 ? "отзыв" : reviews.length < 5 ? "отзыва" : "отзывов"}</span>
          </div>
        </div>
      </div>

      {/* ── Masonry reviews grid ──────────────────── */}
      <section className="section">
        <div className="container">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-turquoise-400/30 border-t-turquoise-400 rounded-full animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">💬</p>
              <p className="font-semibold mb-1">Отзывов пока нет</p>
              <p className="text-muted-foreground text-sm">Станьте первым — оставьте отзыв ниже</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
              {reviews.map((review, i) => (
                <ReviewCard key={review.id} review={review} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Review form ───────────────────────────── */}
      <section className="section bg-[#F5EDD6]/40 dark:bg-ink/40">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-8 h-0.5 bg-turquoise-500 rounded-full" />
                <span className="text-xs font-semibold uppercase tracking-widest text-turquoise-600 dark:text-turquoise-400">
                  Ваш опыт
                </span>
                <div className="w-8 h-0.5 bg-turquoise-500 rounded-full" />
              </div>
              <h2
                className="font-extrabold"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.03em" }}
              >
                Оставить отзыв
              </h2>
              <p className="text-muted-foreground text-sm mt-2">
                Ваш отзыв появится после модерации. Обычно — в течение суток.
              </p>
            </div>

            <div className="bg-white dark:bg-card rounded-3xl p-8 border border-border shadow-card">
              <AnimatePresence mode="wait">
                {formSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-center py-10 gap-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-turquoise-50 dark:bg-turquoise-900/40 flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-turquoise-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Спасибо за отзыв!</h3>
                      <p className="text-muted-foreground text-sm">Он появится на сайте после проверки.</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold">Ваше имя *</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Иван Иванов"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            minLength={2}
                            disabled={submitting}
                            className="pl-10 h-11 rounded-xl border-border/60 focus:border-turquoise-400 focus-visible:ring-turquoise-400/20"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold">Город *</label>
                        <Input
                          placeholder="Москва"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          required
                          minLength={2}
                          disabled={submitting}
                          className="h-11 rounded-xl border-border/60 focus:border-turquoise-400 focus-visible:ring-turquoise-400/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold">Оценка *</label>
                      <StarRating rating={rating} interactive onRate={setRating} />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold">Ваш отзыв *</label>
                      <Textarea
                        placeholder="Расскажите об экскурсии — что понравилось, что запомнилось…"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        minLength={10}
                        rows={4}
                        disabled={submitting}
                        className="rounded-xl border-border/60 focus:border-turquoise-400 focus-visible:ring-turquoise-400/20 resize-none"
                      />
                    </div>

                    {formError && (
                      <p className="text-sm text-red-500 text-center">{formError}</p>
                    )}

                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: submitting ? 1 : 1.02 }}
                      whileTap={{ scale: submitting ? 1 : 0.97 }}
                      className="w-full h-12 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
                      style={{
                        background: "linear-gradient(135deg, #FF7F50 0%, #f05d29 100%)",
                        boxShadow: "0 4px 20px rgba(255,127,80,0.35)",
                      }}
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Отправляем…
                        </span>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Отправить отзыв
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
