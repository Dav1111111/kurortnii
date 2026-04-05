import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import toursData from "@/data/tours.json";
import { TourGallery } from "@/components/tour-gallery";
import { TourChecklist } from "@/components/tour-checklist";
import { BookingForm } from "@/components/booking-form";
import { TourSchema, BreadcrumbSchema } from "@/components/tour-schema";
import { Star, Clock, Users, ChevronLeft, CalendarIcon, MapPin, Check, AlertTriangle } from "lucide-react";
import Link from "next/link";

export async function generateStaticParams() {
  return toursData.tours.map((tour) => ({ slug: tour.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tour = toursData.tours.find((t) => t.slug === params.slug);
  if (!tour) return { title: "Тур не найден" };

  const baseUrl = "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai";
  const tourUrl = `${baseUrl}/tours/${tour.slug}`;
  const title = `${tour.title} — от ${tour.priceRub} ₽ | Экскурсии Сочи 2026`;
  const ratingPart = tour.reviewCount > 0 ? ` ⭐ Рейтинг ${tour.rating} (${tour.reviewCount} отзывов).` : "";
  const description = `${tour.description}${ratingPart} Бронируйте онлайн. Предоплата 20%, остаток на месте. Длительность ${tour.durationHours} часов.`;
  let ogImage = tour.image;
  if (ogImage && !ogImage.startsWith("http")) ogImage = `${baseUrl}${ogImage}`;

  return {
    title,
    description,
    keywords: [tour.title, "экскурсии в Сочи", "туры Сочи 2026", "бронирование экскурсий", "Абхазия", "Красная Поляна"],
    openGraph: { title, description, url: tourUrl, siteName: "Южный Континент", images: [{ url: ogImage || `${baseUrl}/logo.png`, width: 1200, height: 630, alt: tour.title }], locale: "ru_RU", type: "website" },
    twitter: { card: "summary_large_image", title, description, images: [ogImage || `${baseUrl}/logo.png`] },
    alternates: { canonical: tourUrl },
  };
}

const mockGallery = [
  "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg",
  "https://images.pexels.com/photos/5257534/pexels-photo-5257534.jpeg",
  "https://images.pexels.com/photos/5088748/pexels-photo-5088748.jpeg",
  "https://images.pexels.com/photos/6143369/pexels-photo-6143369.jpeg",
];

// Resolve gallery images from filesystem
function resolveImages(tour: (typeof toursData.tours)[number]): string[] {
  const folder = (tour as any).imagesFolder as string | undefined;
  if (folder) {
    try {
      const dirPath = path.join(process.cwd(), "public", "images", folder);
      const files = fs.readdirSync(dirPath);
      const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
      const filtered = files.filter((f) => allowed.some((ext) => f.toLowerCase().endsWith(ext)));
      filtered.sort();
      const encFolder = encodeURIComponent(folder);
      let images = filtered.map((f) => `/images/${encFolder}/${encodeURIComponent(f)}`);

      // Per-tour preferred first image
      const prefer: Record<string, string> = {
        "evening-sochi-boat-riviera": images[2],
        "jeep-33-waterfalls-show": `/images/${encFolder}/${encodeURIComponent("photo_2025-09-21 19.05.58.jpeg")}`,
        "golden-ring-abkhazia": `/images/${encFolder}/${encodeURIComponent("photo_2025-09-21 18.00.24.jpeg")}?v=2`,
        "olympic-legacy": `/images/${encFolder}/${encodeURIComponent("photo_2025-09-21 19.47.10.jpeg")}`,
        "witch-gorge-6in1": `/images/${encFolder}/${encodeURIComponent("photo_2025-09-21 20.11.02.jpeg")}`,
        "vip-tour-polyana": `/images/${encFolder}/${encodeURIComponent("photo_2025-09-21 19.39.32.jpeg")}`,
        "guest-abkhazia": `/images/${encFolder}/${encodeURIComponent("photo_2025-09-21 18.12.38.jpeg")}?v=2`,
        "jeeping-abkhazia": `/images/${encFolder}/${encodeURIComponent("photo_2025-09-21 18.26.31.jpeg")}?v=2`,
        "bigfoot-quads": `/images/${encFolder}/${encodeURIComponent("photo_2025-09-23 14.04.30.jpeg")}`,
        "witch-gorge": `/images/${encFolder}/${encodeURIComponent("photo_2025-09-23 14.10.08.jpeg")}`,
        "kids-park-9-in-1": `/images/${encFolder}/${encodeURIComponent("photo_2025-09-21 18.38.48.jpeg")}?v=2`,
        "bus-33-waterfalls": `/images/${encFolder}/${encodeURIComponent("photo_2025-09-22 23.53.16.jpeg")}`,
        "aquapark-nautilus": `/images/${encFolder}/${encodeURIComponent("photo_2025-09-26 13.34.56.jpeg")}`,
      };
      const pref = prefer[tour.slug];
      if (pref) {
        const idx = images.indexOf(pref);
        if (idx > 0) images = [images[idx], ...images.slice(0, idx), ...images.slice(idx + 1)];
        else if (idx === -1 && pref) images = [pref, ...images];
      }
      if (images.length) return images;
    } catch {}
  }
  const gallery = (tour as any).gallery as string[] | undefined;
  if (gallery?.length) return gallery;
  return [tour.image, ...mockGallery].filter(Boolean) as string[];
}

export default function TourPage({ params }: { params: { slug: string } }) {
  const tour = toursData.tours.find((t) => t.slug === params.slug);
  if (!tour) notFound();

  const images = resolveImages(tour!);
  const t = tour!;

  const startTime = (() => {
    const s = (t as any).startTime;
    if (!s) return null;
    if (typeof s === "string") return s;
    if (s.weekday && s.weekend)
      return s.weekday === s.weekend ? s.weekday : `будни ${s.weekday}, выходные ${s.weekend}`;
    return null;
  })();

  const days: string[] = (t as any).days ?? String((t as any).daysText || "").split(",").map((s: string) => s.trim()).filter(Boolean);

  return (
    <>
      <TourSchema tour={t} />
      <BreadcrumbSchema
        items={[
          { name: "Главная", url: "/" },
          { name: "Экскурсии", url: "/tours" },
          { name: t.title, url: `/tours/${t.slug}` },
        ]}
      />

      <div className="min-h-screen bg-background">
        {/* ── Gallery hero ─────────────────────────── */}
        <div className="pt-16 lg:pt-20">
          <TourGallery images={images} title={t.title} />
        </div>

        <div className="container py-10 px-4 sm:px-6">
          {/* Back link */}
          <Link
            href="/tours"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Все экскурсии
          </Link>

          {/* ── Main layout: content + sidebar ───────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 xl:gap-16">

            {/* ── LEFT: content ──────────────────────── */}
            <div className="space-y-10">

              {/* Title & meta */}
              <div>
                <h1
                  className="font-extrabold mb-5 text-balance"
                  style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
                >
                  {t.title}
                </h1>

                <div className="flex flex-wrap gap-4 text-sm">
                  {t.reviewCount > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <strong>{t.rating}</strong>
                      <span className="text-muted-foreground">({t.reviewCount} отзывов)</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {t.durationHours} часов
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {t.groupSize}
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    Сочи, Россия
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-muted-foreground leading-relaxed text-base">{t.description}</p>
              </div>

              {/* Schedule info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted/40 dark:bg-muted/20">
                  <CalendarIcon className="h-5 w-5 text-turquoise-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1.5 font-medium">Дни проведения</p>
                    <div className="flex flex-wrap gap-1.5">
                      {days.map((d, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-full bg-turquoise-100 dark:bg-turquoise-900/40 text-turquoise-700 dark:text-turquoise-300 text-xs font-semibold">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {startTime && (
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted/40 dark:bg-muted/20">
                    <Clock className="h-5 w-5 text-turquoise-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1.5 font-medium">Время выезда</p>
                      <p className="text-sm font-semibold">{startTime}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Program */}
              {(t as any).program?.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Программа тура</h2>
                  <ol className="space-y-2.5">
                    {(t as any).program.map((item: string, idx: number) => (
                      <li key={idx} className="flex gap-3 text-sm">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-turquoise-100 dark:bg-turquoise-900/40 text-turquoise-700 dark:text-turquoise-300 text-xs font-bold flex items-center justify-center mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-muted-foreground pt-0.5">{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Prices breakdown */}
              {(() => {
                const prices: string[] = (t as any).prices || [];
                if (!prices.length) return null;
                const isHeading = (line: string) => line.startsWith("Льготные категории");
                const headingIndexes = prices.map((p, i) => (isHeading(p) ? i : -1)).filter((i) => i >= 0);
                const firstHeading = headingIndexes.length ? headingIndexes[0] : prices.length;
                const baseItems = prices.slice(0, firstHeading).filter((p) => !isHeading(p));
                const hasParks = baseItems.some((p) => p.toLowerCase().includes("нац. парки"));
                const sections = headingIndexes.map((startIdx, idx) => ({
                  title: prices[startIdx],
                  items: prices.slice(startIdx + 1, idx + 1 < headingIndexes.length ? headingIndexes[idx + 1] : prices.length).filter((p) => !isHeading(p)),
                }));

                return (
                  <div className="space-y-6">
                    {baseItems.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold mb-3">{hasParks ? "Стоимость (вкл. нац. парки)" : "Стоимость"}</h2>
                        <ul className="space-y-2">
                          {baseItems.map((line, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <Check className="h-4 w-4 text-turquoise-500 mt-0.5 flex-shrink-0" />
                              {line}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {sections.map((sec, i) =>
                      sec.items.length ? (
                        <div key={i}>
                          <h3 className="text-base font-semibold mb-3">{sec.title}</h3>
                          <ul className="space-y-2">
                            {sec.items.map((item, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="h-4 w-4 text-turquoise-500 mt-0.5 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null
                    )}
                  </div>
                );
              })()}

              {/* Important info */}
              {(t as any).importantInfo?.length > 0 && (
                <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <h3 className="font-semibold text-amber-900 dark:text-amber-300 text-sm">Важная информация</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {(t as any).importantInfo.map((item: string, idx: number) => (
                      <li key={idx} className="text-sm text-amber-800 dark:text-amber-400 flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Includes / Excludes */}
              <TourChecklist included={(t as any).includes ?? []} excluded={(t as any).excludes ?? []} />

              {/* Standard rules */}
              <div className="rounded-2xl bg-muted/40 dark:bg-muted/20 p-5">
                <h3 className="font-semibold mb-3 text-sm">Условия участия</h3>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {["Экскурсия состоится в любую погоду", "Возврат билета — не позднее чем за 24 часа", "В день проведения возврат не предусмотрен", "При опоздании на посадку возврат не производится"].map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground/40 flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mobile booking form */}
              <div className="lg:hidden rounded-3xl bg-white dark:bg-card border border-border p-6 shadow-card">
                <div className="mb-4">
                  <span className="text-3xl font-extrabold" style={{ letterSpacing: "-0.04em" }}>
                    {t.priceRub.toLocaleString("ru-RU")} ₽
                  </span>
                  <span className="text-muted-foreground text-sm ml-1">/{t.priceUnit || "чел."}</span>
                  {t.priceNote && <p className="text-xs text-amber-600 mt-1">ⓘ {t.priceNote}</p>}
                </div>
                <BookingForm />
              </div>
            </div>

            {/* ── RIGHT: sticky sidebar ──────────────── */}
            <div className="hidden lg:block">
              <div className="sticky top-24 rounded-3xl bg-white dark:bg-card border border-border shadow-card overflow-hidden">
                {/* Price header */}
                <div className="p-6 border-b border-border bg-[#F5EDD6]/60 dark:bg-ink/40">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-extrabold text-[#0A1628] dark:text-white" style={{ letterSpacing: "-0.04em" }}>
                      {t.priceRub.toLocaleString("ru-RU")} ₽
                    </span>
                    <span className="text-muted-foreground text-sm">/{t.priceUnit || "чел."}</span>
                  </div>
                  {t.priceNote && <p className="text-xs text-amber-600 dark:text-amber-500">ⓘ {t.priceNote}</p>}

                  <div className="flex flex-wrap gap-3 mt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {t.durationHours} ч
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> {t.groupSize}
                    </span>
                  </div>
                </div>

                {/* Form */}
                <div className="p-6">
                  <BookingForm />
                  <p className="text-center text-xs text-muted-foreground mt-4">
                    Бесплатная отмена за 24 часа
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
