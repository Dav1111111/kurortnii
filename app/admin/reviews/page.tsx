"use client";

import { useEffect, useState } from "react";
import { Check, Trash2, Star, Clock } from "lucide-react";

interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  approved: number;
  created_at: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  useEffect(() => {
    fetch("/api/admin/reviews")
      .then((r) => r.json())
      .then((d) => { setReviews(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleApprove(id: number) {
    const res = await fetch(`/api/admin/reviews/${id}`, { method: "PATCH" });
    if (res.ok) {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, approved: 1 } : r))
      );
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Удалить этот отзыв?")) return;
    const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  }

  const filtered = reviews.filter((r) => {
    if (filter === "pending") return r.approved === 0;
    if (filter === "approved") return r.approved === 1;
    return true;
  });

  const pendingCount = reviews.filter((r) => r.approved === 0).length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Отзывы</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {reviews.length} всего
            {pendingCount > 0 && (
              <span className="ml-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs px-2 py-0.5 rounded-full font-medium">
                {pendingCount} на модерации
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {(["all", "pending", "approved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f
                ? "bg-[#0A1628] text-white dark:bg-white dark:text-[#0A1628]"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {f === "all" ? "Все" : f === "pending" ? "На модерации" : "Одобренные"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Загрузка...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">Отзывов нет</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => (
            <div
              key={review.id}
              className={`bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5 border-l-4 ${
                review.approved === 0
                  ? "border-amber-400"
                  : "border-turquoise-500"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Author row */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">{review.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{review.location}</span>
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-200 dark:text-gray-700"
                          }`}
                        />
                      ))}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        review.approved === 0
                          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                          : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      }`}
                    >
                      {review.approved === 0 ? "На модерации" : "Опубликован"}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {review.comment}
                  </p>

                  {/* Date */}
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {new Date(review.created_at).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {review.approved === 0 && (
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="p-2 rounded-lg text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 transition-colors"
                      title="Одобрить"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-2 rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
