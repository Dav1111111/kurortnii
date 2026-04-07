"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Plus, Minus } from "lucide-react";
import type { Tour } from "@/lib/tours";

type FormTour = Partial<Tour>;

interface Props {
  initialData?: FormTour;
  tourId?: string; // present for edit mode
}

const DAYS_OPTIONS = [
  "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс",
  "Ежедневно", "По запросу",
];

const CATEGORIES = [
  "Экскурсии", "Активный отдых", "Природа", "Абхазия", "Горы", "Ночные туры",
];

function ListEditor({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  function update(i: number, v: string) {
    const next = [...value];
    next[i] = v;
    onChange(next);
  }
  function add() { onChange([...value, ""]); }
  function remove(i: number) { onChange(value.filter((_, idx) => idx !== i)); }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-turquoise-500"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 text-sm text-turquoise-600 dark:text-turquoise-400 hover:underline"
        >
          <Plus className="h-3.5 w-3.5" /> Добавить строку
        </button>
      </div>
    </div>
  );
}

export function TourForm({ initialData, tourId }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormTour>({
    title: "",
    description: "",
    image: "",
    imagesFolder: "",
    durationHours: 0,
    priceRub: 0,
    priceUnit: "с человека",
    priceNote: "",
    days: [],
    daysText: "",
    startTime: "",
    groupSize: "",
    rating: 0,
    reviewCount: 0,
    seatsLeft: 10,
    category: "",
    includes: [],
    excludes: [],
    program: [],
    prices: [],
    importantInfo: [],
    ...initialData,
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof FormTour>(k: K, v: FormTour[K]) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  function toggleDay(day: string) {
    const current = form.days ?? [];
    if (current.includes(day)) {
      set("days", current.filter((d) => d !== day));
    } else {
      set("days", [...current, day]);
    }
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "tours");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        set("image", data.url);
      } else {
        setError(data.error ?? "Ошибка загрузки");
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = tourId
        ? `/api/admin/tours/${tourId}`
        : "/api/admin/tours";
      const method = tourId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin/tours");
        router.refresh();
      } else {
        const d = await res.json();
        setError(d.error ?? "Ошибка сохранения");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* ── Basic info ── */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 space-y-5">
        <h2 className="font-semibold text-gray-900 dark:text-white text-base">Основная информация</h2>

        <Field label="Название тура *">
          <input
            type="text"
            required
            value={form.title ?? ""}
            onChange={(e) => set("title", e.target.value)}
            className={inputCls}
            placeholder="Например: Большой каньон Абхазии"
          />
        </Field>

        <Field label="Описание *">
          <textarea
            required
            rows={3}
            value={form.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
            className={inputCls}
            placeholder="Краткое описание тура..."
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Категория">
            <select
              value={form.category ?? ""}
              onChange={(e) => set("category", e.target.value)}
              className={inputCls}
            >
              <option value="">— выберите —</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>

          <Field label="Размер группы">
            <input
              type="text"
              value={form.groupSize ?? ""}
              onChange={(e) => set("groupSize", e.target.value)}
              className={inputCls}
              placeholder="до 12 человек"
            />
          </Field>
        </div>
      </section>

      {/* ── Image ── */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 dark:text-white text-base">Обложка</h2>

        <div
          className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center gap-3 cursor-pointer hover:border-turquoise-400 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          {form.image ? (
            <div className="relative w-full max-w-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.image} alt="preview" className="rounded-xl w-full h-40 object-cover" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); set("image", ""); }}
                className="absolute top-2 right-2 bg-black/50 rounded-full p-0.5 text-white hover:bg-black"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-300" />
              <p className="text-sm text-gray-500">Нажмите, чтобы загрузить фото</p>
              <p className="text-xs text-gray-400">JPG, PNG, WebP — макс. 10 МБ</p>
            </>
          )}
          {uploading && <p className="text-sm text-turquoise-600">Загрузка...</p>}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImageUpload(f);
          }}
        />

        <Field label="или укажите URL вручную">
          <input
            type="text"
            value={form.image ?? ""}
            onChange={(e) => set("image", e.target.value)}
            className={inputCls}
            placeholder="/tours/my-image.jpg"
          />
        </Field>

        <Field label="Папка с галереей (imagesFolder)">
          <input
            type="text"
            value={form.imagesFolder ?? ""}
            onChange={(e) => set("imagesFolder", e.target.value)}
            className={inputCls}
            placeholder="bigfoot-quads"
          />
        </Field>
      </section>

      {/* ── Pricing & Logistics ── */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 space-y-5">
        <h2 className="font-semibold text-gray-900 dark:text-white text-base">Цена и логистика</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          <Field label="Цена (₽) *">
            <input
              type="number"
              required
              min={0}
              value={form.priceRub ?? 0}
              onChange={(e) => set("priceRub", Number(e.target.value))}
              className={inputCls}
            />
          </Field>

          <Field label="Единица цены">
            <input
              type="text"
              value={form.priceUnit ?? ""}
              onChange={(e) => set("priceUnit", e.target.value)}
              className={inputCls}
              placeholder="с человека"
            />
          </Field>

          <Field label="Длительность (ч) *">
            <input
              type="number"
              required
              min={0}
              step={0.5}
              value={form.durationHours ?? 0}
              onChange={(e) => set("durationHours", Number(e.target.value))}
              className={inputCls}
            />
          </Field>

          <Field label="Мест осталось">
            <input
              type="number"
              min={0}
              value={form.seatsLeft ?? 0}
              onChange={(e) => set("seatsLeft", Number(e.target.value))}
              className={inputCls}
            />
          </Field>

          <Field label="Время начала">
            <input
              type="text"
              value={form.startTime ?? ""}
              onChange={(e) => set("startTime", e.target.value)}
              className={inputCls}
              placeholder="09:00"
            />
          </Field>

          <Field label="Примечание к цене">
            <input
              type="text"
              value={form.priceNote ?? ""}
              onChange={(e) => set("priceNote", e.target.value)}
              className={inputCls}
              placeholder="Включая трансфер"
            />
          </Field>
        </div>

        {/* Days */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Дни проведения
          </label>
          <div className="flex flex-wrap gap-2">
            {DAYS_OPTIONS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  (form.days ?? []).includes(day)
                    ? "bg-turquoise-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
          <Field label="Расписание текстом" className="mt-3">
            <input
              type="text"
              value={form.daysText ?? ""}
              onChange={(e) => set("daysText", e.target.value)}
              className={inputCls}
              placeholder="Ежедневно кроме воскресенья"
            />
          </Field>
        </div>
      </section>

      {/* ── Rating ── */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 space-y-5">
        <h2 className="font-semibold text-gray-900 dark:text-white text-base">Рейтинг</h2>
        <div className="grid grid-cols-2 gap-5">
          <Field label="Рейтинг (0–5)">
            <input
              type="number"
              min={0}
              max={5}
              step={0.1}
              value={form.rating ?? 0}
              onChange={(e) => set("rating", Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="Количество отзывов">
            <input
              type="number"
              min={0}
              value={form.reviewCount ?? 0}
              onChange={(e) => set("reviewCount", Number(e.target.value))}
              className={inputCls}
            />
          </Field>
        </div>
      </section>

      {/* ── Lists ── */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 space-y-6">
        <h2 className="font-semibold text-gray-900 dark:text-white text-base">Что включено / не включено</h2>

        <ListEditor
          label="Включено"
          value={form.includes ?? []}
          onChange={(v) => set("includes", v)}
          placeholder="Трансфер от отеля"
        />

        <ListEditor
          label="Не включено"
          value={form.excludes ?? []}
          onChange={(v) => set("excludes", v)}
          placeholder="Личные расходы"
        />
      </section>

      <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 space-y-6">
        <h2 className="font-semibold text-gray-900 dark:text-white text-base">Программа и доп. информация</h2>

        <ListEditor
          label="Программа (по пунктам)"
          value={form.program ?? []}
          onChange={(v) => set("program", v)}
          placeholder="09:00 — встреча у отеля"
        />

        <ListEditor
          label="Варианты цен"
          value={form.prices ?? []}
          onChange={(v) => set("prices", v)}
          placeholder="Взрослый — 2500 ₽"
        />

        <ListEditor
          label="Важная информация"
          value={form.importantInfo ?? []}
          onChange={(v) => set("importantInfo", v)}
          placeholder="Удобная обувь обязательна"
        />
      </section>

      {/* ── Actions ── */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-turquoise-600 hover:bg-turquoise-700 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-60"
        >
          {saving ? "Сохранение..." : tourId ? "Сохранить изменения" : "Создать тур"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/tours")}
          className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl font-semibold text-sm transition-colors"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-turquoise-500 focus:border-transparent";

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
