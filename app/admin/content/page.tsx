"use client";

import { useEffect, useState, useRef } from "react";
import { Save, Plus, Minus, Upload, X } from "lucide-react";

interface Phone { name: string; number: string; raw: string; }
interface WorkHours { days: string; time: string; }
interface FaqItem { id: string; question: string; answer: string; }

interface SiteContent {
  hero: {
    eyebrow: string; headlinePart1: string; headlinePart2: string;
    rotatingWords: string[]; subtitle: string;
    heroImage: string; heroImageWebp: string; heroImageMobile: string;
  };
  about: {
    title: string; titleAccent: string; description: string;
    perks: string[]; image: string;
    yearsCount: string; yearsLabel: string; yearsSublabel: string;
  };
  contacts: {
    phones: Phone[]; whatsapp: string; telegram: string;
    address: string; city: string; hours: WorkHours[];
  };
  faq: FaqItem[];
}

const TABS = ["Hero", "О нас", "Контакты", "FAQ"] as const;

export default function ContentEditorPage() {
  const [data, setData] = useState<SiteContent | null>(null);
  const [tab, setTab] = useState<typeof TABS[number]>("Hero");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<string>("");

  useEffect(() => {
    fetch("/api/admin/site-content")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function update<K extends keyof SiteContent>(section: K, value: SiteContent[K]) {
    setData((prev) => prev ? { ...prev, [section]: value } : prev);
  }

  async function handleSave() {
    if (!data) return;
    setSaving(true); setError(""); setSaved(false);
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
      else { const d = await res.json(); setError(d.error ?? "Ошибка"); }
    } finally { setSaving(false); }
  }

  async function handleImageUpload(file: File, field: string) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "images");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const d = await res.json();
    if (!res.ok) return;

    if (field.startsWith("hero.")) {
      const key = field.replace("hero.", "") as keyof SiteContent["hero"];
      update("hero", { ...data!.hero, [key]: d.url });
    } else if (field === "about.image") {
      update("about", { ...data!.about, image: d.url });
    }
  }

  if (loading) return <div className="p-6 text-center text-gray-400">Загрузка...</div>;
  if (!data) return <div className="p-6 text-center text-red-400">Ошибка загрузки</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Контент сайта</h1>
          <p className="text-sm text-gray-500 mt-0.5">Редактируйте тексты, изображения и контакты</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-turquoise-600 hover:bg-turquoise-700 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? "Сохранение..." : "Сохранить"}
        </button>
      </div>

      {saved && <div className="mb-4 px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm">Сохранено!</div>}
      {error && <div className="mb-4 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === t
                ? "bg-[#0A1628] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f && uploadTarget) handleImageUpload(f, uploadTarget);
          e.target.value = "";
        }}
      />

      {/* ── Hero tab ── */}
      {tab === "Hero" && (
        <div className="space-y-5">
          <Section title="Тексты">
            <Field label="Бейдж (eyebrow)">
              <input className={inputCls} value={data.hero.eyebrow} onChange={(e) => update("hero", { ...data.hero, eyebrow: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Заголовок часть 1">
                <input className={inputCls} value={data.hero.headlinePart1} onChange={(e) => update("hero", { ...data.hero, headlinePart1: e.target.value })} />
              </Field>
              <Field label="Заголовок часть 2">
                <input className={inputCls} value={data.hero.headlinePart2} onChange={(e) => update("hero", { ...data.hero, headlinePart2: e.target.value })} />
              </Field>
            </div>
            <Field label="Подзаголовок">
              <textarea className={inputCls} rows={2} value={data.hero.subtitle} onChange={(e) => update("hero", { ...data.hero, subtitle: e.target.value })} />
            </Field>
            <ListEditor
              label="Меняющиеся слова"
              value={data.hero.rotatingWords}
              onChange={(v) => update("hero", { ...data.hero, rotatingWords: v })}
              placeholder="Сочи"
            />
          </Section>

          <Section title="Изображения Hero">
            <ImageField label="Основное фото" src={data.hero.heroImage} onUpload={() => { setUploadTarget("hero.heroImage"); fileRef.current?.click(); }}
              onClear={() => update("hero", { ...data.hero, heroImage: "" })}
              onChange={(v) => update("hero", { ...data.hero, heroImage: v })} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="WebP (десктоп)">
                <input className={inputCls} value={data.hero.heroImageWebp} onChange={(e) => update("hero", { ...data.hero, heroImageWebp: e.target.value })} />
              </Field>
              <Field label="WebP (мобильный)">
                <input className={inputCls} value={data.hero.heroImageMobile} onChange={(e) => update("hero", { ...data.hero, heroImageMobile: e.target.value })} />
              </Field>
            </div>
          </Section>
        </div>
      )}

      {/* ── About tab ── */}
      {tab === "О нас" && (
        <div className="space-y-5">
          <Section title="Тексты">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Заголовок">
                <input className={inputCls} value={data.about.title} onChange={(e) => update("about", { ...data.about, title: e.target.value })} />
              </Field>
              <Field label="Акцент (цветное слово)">
                <input className={inputCls} value={data.about.titleAccent} onChange={(e) => update("about", { ...data.about, titleAccent: e.target.value })} />
              </Field>
            </div>
            <Field label="Описание">
              <textarea className={inputCls} rows={3} value={data.about.description} onChange={(e) => update("about", { ...data.about, description: e.target.value })} />
            </Field>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Цифра (12+)">
                <input className={inputCls} value={data.about.yearsCount} onChange={(e) => update("about", { ...data.about, yearsCount: e.target.value })} />
              </Field>
              <Field label="Подпись">
                <input className={inputCls} value={data.about.yearsLabel} onChange={(e) => update("about", { ...data.about, yearsLabel: e.target.value })} />
              </Field>
              <Field label="Год">
                <input className={inputCls} value={data.about.yearsSublabel} onChange={(e) => update("about", { ...data.about, yearsSublabel: e.target.value })} />
              </Field>
            </div>
          </Section>
          <Section title="Преимущества">
            <ListEditor label="" value={data.about.perks} onChange={(v) => update("about", { ...data.about, perks: v })} placeholder="Бесплатный трансфер" />
          </Section>
          <Section title="Фото секции">
            <ImageField label="Изображение" src={data.about.image} onUpload={() => { setUploadTarget("about.image"); fileRef.current?.click(); }}
              onClear={() => update("about", { ...data.about, image: "" })}
              onChange={(v) => update("about", { ...data.about, image: v })} />
          </Section>
        </div>
      )}

      {/* ── Contacts tab ── */}
      {tab === "Контакты" && (
        <div className="space-y-5">
          <Section title="Телефоны">
            {data.contacts.phones.map((p, i) => (
              <div key={i} className="flex gap-3 items-end">
                <Field label="Имя" className="flex-1">
                  <input className={inputCls} value={p.name} onChange={(e) => {
                    const phones = [...data.contacts.phones]; phones[i] = { ...p, name: e.target.value };
                    update("contacts", { ...data.contacts, phones });
                  }} />
                </Field>
                <Field label="Номер" className="flex-1">
                  <input className={inputCls} value={p.number} onChange={(e) => {
                    const phones = [...data.contacts.phones]; phones[i] = { ...p, number: e.target.value };
                    update("contacts", { ...data.contacts, phones });
                  }} />
                </Field>
                <Field label="Для ссылки" className="flex-1">
                  <input className={inputCls} value={p.raw} onChange={(e) => {
                    const phones = [...data.contacts.phones]; phones[i] = { ...p, raw: e.target.value };
                    update("contacts", { ...data.contacts, phones });
                  }} />
                </Field>
                <button onClick={() => { const phones = data.contacts.phones.filter((_, j) => j !== i); update("contacts", { ...data.contacts, phones }); }}
                  className="p-2 text-red-400 hover:text-red-600 mb-1"><Minus className="h-4 w-4" /></button>
              </div>
            ))}
            <button onClick={() => update("contacts", { ...data.contacts, phones: [...data.contacts.phones, { name: "", number: "", raw: "" }] })}
              className="inline-flex items-center gap-1.5 text-sm text-turquoise-600 hover:underline"><Plus className="h-3.5 w-3.5" /> Добавить телефон</button>
          </Section>

          <Section title="Мессенджеры">
            <div className="grid grid-cols-2 gap-4">
              <Field label="WhatsApp (номер)">
                <input className={inputCls} value={data.contacts.whatsapp} onChange={(e) => update("contacts", { ...data.contacts, whatsapp: e.target.value })} />
              </Field>
              <Field label="Telegram (username)">
                <input className={inputCls} value={data.contacts.telegram} onChange={(e) => update("contacts", { ...data.contacts, telegram: e.target.value })} />
              </Field>
            </div>
          </Section>

          <Section title="Адрес">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Адрес">
                <input className={inputCls} value={data.contacts.address} onChange={(e) => update("contacts", { ...data.contacts, address: e.target.value })} />
              </Field>
              <Field label="Город">
                <input className={inputCls} value={data.contacts.city} onChange={(e) => update("contacts", { ...data.contacts, city: e.target.value })} />
              </Field>
            </div>
          </Section>

          <Section title="Часы работы">
            {data.contacts.hours.map((h, i) => (
              <div key={i} className="flex gap-3 items-end">
                <Field label="Дни" className="flex-1">
                  <input className={inputCls} value={h.days} onChange={(e) => {
                    const hours = [...data.contacts.hours]; hours[i] = { ...h, days: e.target.value };
                    update("contacts", { ...data.contacts, hours });
                  }} />
                </Field>
                <Field label="Время" className="flex-1">
                  <input className={inputCls} value={h.time} onChange={(e) => {
                    const hours = [...data.contacts.hours]; hours[i] = { ...h, time: e.target.value };
                    update("contacts", { ...data.contacts, hours });
                  }} />
                </Field>
                <button onClick={() => { const hours = data.contacts.hours.filter((_, j) => j !== i); update("contacts", { ...data.contacts, hours }); }}
                  className="p-2 text-red-400 hover:text-red-600 mb-1"><Minus className="h-4 w-4" /></button>
              </div>
            ))}
            <button onClick={() => update("contacts", { ...data.contacts, hours: [...data.contacts.hours, { days: "", time: "" }] })}
              className="inline-flex items-center gap-1.5 text-sm text-turquoise-600 hover:underline"><Plus className="h-3.5 w-3.5" /> Добавить</button>
          </Section>
        </div>
      )}

      {/* ── FAQ tab ── */}
      {tab === "FAQ" && (
        <div className="space-y-4">
          {data.faq.map((item, i) => (
            <div key={item.id || i} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <Field label={`Вопрос ${i + 1}`} className="flex-1">
                  <input className={inputCls} value={item.question} onChange={(e) => {
                    const faq = [...data.faq]; faq[i] = { ...item, question: e.target.value };
                    update("faq", faq as any);
                  }} />
                </Field>
                <button onClick={() => update("faq", data.faq.filter((_, j) => j !== i) as any)}
                  className="p-2 text-red-400 hover:text-red-600 mt-6"><Minus className="h-4 w-4" /></button>
              </div>
              <Field label="Ответ">
                <textarea className={inputCls} rows={3} value={item.answer} onChange={(e) => {
                  const faq = [...data.faq]; faq[i] = { ...item, answer: e.target.value };
                  update("faq", faq as any);
                }} />
              </Field>
            </div>
          ))}
          <button onClick={() => update("faq", [...data.faq, { id: Date.now().toString(), question: "", answer: "" }] as any)}
            className="inline-flex items-center gap-1.5 text-sm text-turquoise-600 hover:underline"><Plus className="h-3.5 w-3.5" /> Добавить вопрос</button>
        </div>
      )}
    </div>
  );
}

// ── Helpers ──

const inputCls = "w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-turquoise-500";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 space-y-4">
      {title && <h2 className="font-semibold text-gray-900 dark:text-white text-base">{title}</h2>}
      {children}
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function ListEditor({ label, value, onChange, placeholder }: { label: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>}
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input className={inputCls + " flex-1"} value={item} placeholder={placeholder}
              onChange={(e) => { const next = [...value]; next[i] = e.target.value; onChange(next); }} />
            <button onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="p-2 text-red-400 hover:text-red-600"><Minus className="h-4 w-4" /></button>
          </div>
        ))}
        <button onClick={() => onChange([...value, ""])}
          className="inline-flex items-center gap-1.5 text-sm text-turquoise-600 hover:underline"><Plus className="h-3.5 w-3.5" /> Добавить</button>
      </div>
    </div>
  );
}

function ImageField({ label, src, onUpload, onClear, onChange }: { label: string; src: string; onUpload: () => void; onClear: () => void; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      {src ? (
        <div className="relative w-full max-w-sm mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="rounded-xl w-full h-32 object-cover" />
          <button onClick={onClear} className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white hover:bg-black"><X className="h-3 w-3" /></button>
        </div>
      ) : (
        <div onClick={onUpload} className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-turquoise-400 transition-colors mb-2">
          <Upload className="h-5 w-5 text-gray-300" />
          <span className="text-sm text-gray-500">Загрузить фото</span>
        </div>
      )}
      <input className={inputCls} value={src} onChange={(e) => onChange(e.target.value)} placeholder="/images/photo.jpg" />
    </div>
  );
}
