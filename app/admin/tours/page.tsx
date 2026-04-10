"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Clock, Users, Star } from "lucide-react";

interface Tour {
  id: string;
  slug: string;
  title: string;
  image: string;
  priceRub: number;
  durationHours: number;
  category: string;
  rating: number;
  reviewCount: number;
  seatsLeft: number;
}

export default function AdminToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/tours")
      .then((r) => r.json())
      .then((d) => { setTours(d.tours ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Удалить тур «${title}»? Это действие нельзя отменить.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/tours/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTours((prev) => prev.filter((t) => t.id !== id));
      } else {
        setError("Не удалось удалить тур");
        setTimeout(() => setError(""), 4000);
      }
    } catch {
      setError("Ошибка сети при удалении");
      setTimeout(() => setError(""), 4000);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Туры</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {tours.length} {tours.length === 1 ? "тур" : tours.length < 5 ? "тура" : "туров"} в базе
          </p>
        </div>
        <Link
          href="/admin/tours/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-turquoise-600 hover:bg-turquoise-700 text-white rounded-xl font-semibold text-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          Добавить тур
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input type="text" placeholder="Поиск по названию..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-turquoise-500" />
      </div>

      {error && <div className="mb-4 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm">{error}</div>}

      {loading ? (
        <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-3">
          <svg className="animate-spin h-6 w-6 text-turquoise-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          Загрузка...
        </div>
      ) : tours.length === 0 ? (
        <div className="text-center py-20 text-gray-400">Туры не найдены</div>
      ) : (
        <div className="grid gap-4">
          {tours.filter(t => t.title.toLowerCase().includes(search.toLowerCase())).map((tour) => (
            <div
              key={tour.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="w-20 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                {tour.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                    Нет фото
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{tour.title}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {tour.durationHours}ч
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" /> {tour.seatsLeft} мест
                  </span>
                  {tour.reviewCount > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {tour.rating} ({tour.reviewCount})
                    </span>
                  )}
                  <span className="text-turquoise-600 dark:text-turquoise-400 font-medium">
                    {tour.priceRub.toLocaleString("ru-RU")} ₽
                  </span>
                  {tour.category && (
                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                      {tour.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/admin/tours/${tour.id}/edit`}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                  title="Редактировать"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDelete(tour.id, tour.title)}
                  disabled={deleting === tour.id}
                  className="p-2 rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors disabled:opacity-40"
                  title="Удалить"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
