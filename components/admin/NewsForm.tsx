"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";

interface FormData {
  title: string; slug: string; excerpt: string; content: string;
  image: string; publishedAt: string; published: boolean;
}

interface Props { initialData?: Partial<FormData>; articleId?: string; }

export function NewsForm({ initialData, articleId }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormData>({
    title: "", slug: "", excerpt: "", content: "",
    image: "", publishedAt: new Date().toISOString().slice(0, 10), published: false,
    ...initialData,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "news");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const d = await res.json();
      if (res.ok) set("image", d.url);
    } finally { setUploading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const url = articleId ? `/api/admin/news/${articleId}` : "/api/admin/news";
      const method = articleId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { router.push("/admin/news"); router.refresh(); }
      else { const d = await res.json(); setError(d.error ?? "Ошибка"); }
    } finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>}

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 space-y-5">
        <h2 className="font-semibold text-base text-gray-900 dark:text-white">Основное</h2>
        <Field label="Заголовок *">
          <input required className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Новый маршрут на Красную Поляну" />
        </Field>
        <Field label="Slug (URL)">
          <input className={inputCls} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="Авто из заголовка" />
        </Field>
        <Field label="Краткое описание">
          <textarea className={inputCls} rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="Для карточки на главной..." />
        </Field>
        <Field label="Полный текст *">
          <textarea required className={inputCls} rows={10} value={form.content} onChange={(e) => set("content", e.target.value)} placeholder="Текст статьи..." />
        </Field>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-base text-gray-900 dark:text-white">Обложка</h2>
        <div
          className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center gap-3 cursor-pointer hover:border-turquoise-400 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          {form.image ? (
            <div className="relative w-full max-w-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.image} alt="" className="rounded-xl w-full h-40 object-cover" />
              <button type="button" onClick={(e) => { e.stopPropagation(); set("image", ""); }}
                className="absolute top-2 right-2 bg-black/50 rounded-full p-0.5 text-white hover:bg-black"><X className="h-3.5 w-3.5" /></button>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-300" />
              <p className="text-sm text-gray-500">Нажмите для загрузки</p>
            </>
          )}
          {uploading && <p className="text-sm text-turquoise-600">Загрузка...</p>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-base text-gray-900 dark:text-white">Публикация</h2>
        <div className="flex items-center gap-4">
          <Field label="Дата">
            <input type="date" className={inputCls} value={form.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} />
          </Field>
          <label className="flex items-center gap-2 cursor-pointer mt-6">
            <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-turquoise-600 focus:ring-turquoise-500" />
            <span className="text-sm font-medium">Опубликовать</span>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving}
          className="px-6 py-2.5 bg-turquoise-600 hover:bg-turquoise-700 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-60">
          {saving ? "Сохранение..." : articleId ? "Сохранить" : "Создать"}
        </button>
        <button type="button" onClick={() => router.push("/admin/news")}
          className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl font-semibold text-sm transition-colors">Отмена</button>
      </div>
    </form>
  );
}

const inputCls = "w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-turquoise-500";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
