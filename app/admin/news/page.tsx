"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

interface Article {
  id: string; slug: string; title: string; excerpt: string;
  image: string; publishedAt: string; published: boolean;
}

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/news")
      .then((r) => r.json())
      .then((d) => { setArticles(d.articles ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Удалить «${title}»?`)) return;
    const res = await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
    if (res.ok) setArticles((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Новости</h1>
          <p className="text-sm text-gray-500 mt-0.5">{articles.length} статей</p>
        </div>
        <Link href="/admin/news/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-turquoise-600 hover:bg-turquoise-700 text-white rounded-xl font-semibold text-sm transition-colors">
          <Plus className="h-4 w-4" /> Добавить
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Загрузка...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">Новостей пока нет</div>
      ) : (
        <div className="space-y-4">
          {articles.map((a) => (
            <div key={a.id} className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4">
              <div className="w-20 h-14 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                {a.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.image} alt={a.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">Нет фото</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{a.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span>{a.publishedAt}</span>
                  <span className={`inline-flex items-center gap-1 ${a.published ? "text-green-600" : "text-amber-600"}`}>
                    {a.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {a.published ? "Опубликовано" : "Черновик"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/news/${a.id}/edit`} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                  <Pencil className="h-4 w-4" />
                </Link>
                <button onClick={() => handleDelete(a.id, a.title)} className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors">
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
