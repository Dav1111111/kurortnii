import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import toursData from "@/data/tours.json";
import { TourGallery } from "@/components/tour-gallery";
import { TourChecklist } from "@/components/tour-checklist";
import { BookingForm } from "@/components/booking-form";
import { Button } from "@/components/ui/button";
import { Star, Clock, Users, ChevronLeft, CalendarIcon } from "lucide-react";
import Link from "next/link";

export async function generateStaticParams() {
  return toursData.tours.map((tour) => ({
    slug: tour.slug,
  }));
}


const mockGallery = [
  "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg",
  "https://images.pexels.com/photos/5257534/pexels-photo-5257534.jpeg",
  "https://images.pexels.com/photos/5088748/pexels-photo-5088748.jpeg",
  "https://images.pexels.com/photos/6143369/pexels-photo-6143369.jpeg"
];

export default function TourPage({ params }: { params: { slug: string } }) {
  const tour = toursData.tours.find(t => t.slug === params.slug);

  if (!tour) {
    notFound();
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="container pt-8">
        <Link href="/tours" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Назад к списку
        </Link>

        <div className="space-y-12">
          {(() => {
            const folder: string | undefined = (tour as any).imagesFolder;
            let images: string[] = [];
            if (folder) {
              try {
                const dirPath = path.join(process.cwd(), "public", "images", folder);
                const files = fs.readdirSync(dirPath);
                const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"]; 
                const filtered = files.filter((f) => allowed.some((ext) => f.toLowerCase().endsWith(ext)));
                filtered.sort();
                const encFolder = encodeURIComponent(folder);
                images = filtered.map((f) => `/images/${encFolder}/${encodeURIComponent(f)}`);
              } catch (e) {
                // noop: fallback ниже
              }
            }
            if (!images.length) {
              const gallery = (tour as any).gallery as string[] | undefined;
              if (gallery && gallery.length > 0) {
                images = gallery;
              } else {
                const fallback = [tour.image, ...mockGallery].filter((v): v is string => Boolean(v));
                images = fallback;
              }
            }
            // Start carousel from specific images per tour
            if ((tour as any).slug === 'evening-sochi-boat-riviera' && images.length >= 3) {
              const third = images[2];
              images = [third, ...images.slice(0, 2), ...images.slice(3)];
            }
            if ((tour as any).slug === 'jeep-33-waterfalls-show' && images.length >= 1) {
              const prefer = '/images/' + encodeURIComponent((tour as any).imagesFolder) + '/' + encodeURIComponent('photo_2025-09-21 19.05.58.jpeg');
              const idx = images.indexOf(prefer);
              if (idx > 0) {
                const preferred = images[idx];
                images = [preferred, ...images.slice(0, idx), ...images.slice(idx + 1)];
              }
            }
            if ((tour as any).slug === 'golden-ring-abkhazia' && images.length >= 1) {
              const prefer = '/images/' + encodeURIComponent((tour as any).imagesFolder) + '/' + encodeURIComponent('photo_2025-09-21 18.00.24.jpeg') + '?v=2';
              const idx = images.indexOf(prefer);
              if (idx > 0) {
                const preferred = images[idx];
                images = [preferred, ...images.slice(0, idx), ...images.slice(idx + 1)];
              }
            }
            if ((tour as any).slug === 'olympic-legacy' && images.length >= 1) {
              const prefer = '/images/' + encodeURIComponent((tour as any).imagesFolder) + '/' + encodeURIComponent('photo_2025-09-21 19.47.10.jpeg');
              const idx = images.indexOf(prefer);
              if (idx > 0) {
                const preferred = images[idx];
                images = [preferred, ...images.slice(0, idx), ...images.slice(idx + 1)];
              }
            }
            if ((tour as any).slug === 'witch-gorge-6in1' && images.length >= 1) {
              const prefer = '/images/' + encodeURIComponent((tour as any).imagesFolder) + '/' + encodeURIComponent('photo_2025-09-21 20.11.02.jpeg');
              const idx = images.indexOf(prefer);
              if (idx > 0) {
                const preferred = images[idx];
                images = [preferred, ...images.slice(0, idx), ...images.slice(idx + 1)];
              }
            }
            if ((tour as any).slug === 'vip-tour-polyana' && images.length >= 1) {
              const prefer = '/images/' + encodeURIComponent((tour as any).imagesFolder) + '/' + encodeURIComponent('photo_2025-09-21 19.39.32.jpeg');
              const idx = images.indexOf(prefer);
              if (idx > 0) {
                const preferred = images[idx];
                images = [preferred, ...images.slice(0, idx), ...images.slice(idx + 1)];
              }
            }
            if ((tour as any).slug === 'guest-abkhazia' && images.length >= 1) {
              const prefer = '/images/' + encodeURIComponent((tour as any).imagesFolder) + '/' + encodeURIComponent('photo_2025-09-21 18.12.38.jpeg') + '?v=2';
              const idx = images.indexOf(prefer);
              if (idx > 0) {
                const preferred = images[idx];
                images = [preferred, ...images.slice(0, idx), ...images.slice(idx + 1)];
              }
            }
            if ((tour as any).slug === 'jeeping-abkhazia' && images.length >= 1) {
              const prefer = '/images/' + encodeURIComponent((tour as any).imagesFolder) + '/' + encodeURIComponent('photo_2025-09-21 18.26.31.jpeg') + '?v=2';
              const idx = images.indexOf(prefer);
              if (idx > 0) {
                const preferred = images[idx];
                images = [preferred, ...images.slice(0, idx), ...images.slice(idx + 1)];
              }
            }
            if ((tour as any).slug === 'bigfoot-quads' && images.length >= 1) {
              const prefer = '/images/' + encodeURIComponent((tour as any).imagesFolder) + '/' + encodeURIComponent('photo_2025-09-23 14.04.30.jpeg');
              const idx = images.indexOf(prefer);
              if (idx > 0) {
                const preferred = images[idx];
                images = [preferred, ...images.slice(0, idx), ...images.slice(idx + 1)];
              }
            }
            if ((tour as any).slug === 'witch-gorge' && images.length >= 1) {
              const prefer = '/images/' + encodeURIComponent((tour as any).imagesFolder) + '/' + encodeURIComponent('photo_2025-09-23 14.10.08.jpeg');
              const idx = images.indexOf(prefer);
              if (idx > 0) {
                const preferred = images[idx];
                images = [preferred, ...images.slice(0, idx), ...images.slice(idx + 1)];
              }
            }
            if ((tour as any).slug === 'kids-park-9-in-1' && images.length >= 1) {
              const prefer = '/images/' + encodeURIComponent((tour as any).imagesFolder) + '/' + encodeURIComponent('photo_2025-09-21 18.38.48.jpeg') + '?v=2';
              const idx = images.indexOf(prefer);
              if (idx > 0) {
                const preferred = images[idx];
                images = [preferred, ...images.slice(0, idx), ...images.slice(idx + 1)];
              }
            }
            if ((tour as any).slug === 'bus-33-waterfalls' && images.length >= 1) {
              const prefer = '/images/' + encodeURIComponent((tour as any).imagesFolder) + '/' + encodeURIComponent('photo_2025-09-22 23.53.16.jpeg');
              const idx = images.indexOf(prefer);
              if (idx > 0) {
                const preferred = images[idx];
                images = [preferred, ...images.slice(0, idx), ...images.slice(idx + 1)];
              }
            }
            if ((tour as any).slug === 'aquapark-nautilus' && images.length >= 1) {
              const prefer = '/images/' + encodeURIComponent((tour as any).imagesFolder) + '/' + encodeURIComponent('photo_2025-09-26 13.34.56.jpeg');
              const idx = images.indexOf(prefer);
              if (idx > 0) {
                const preferred = images[idx];
                images = [preferred, ...images.slice(0, idx), ...images.slice(idx + 1)];
              }
            }
            // 33 водопада (без переупорядочивания) — старт с 1-го файла папки
            return <TourGallery images={images} title={tour.title} />;
          })()}

          <div>
            <h1 className="text-4xl font-bold mb-4">{tour.title}</h1>
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="font-medium">{tour.rating}</span>
                <span className="text-muted-foreground">({tour.reviewCount} отзывов)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{tour.durationHours} часов</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{tour.groupSize}</span>
              </div>
            </div>

            {/* Ценовой блок и форма бронирования перенесены вниз */}

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>{tour.description}</p>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 bg-muted/30 dark:bg-muted/20 rounded-lg px-4 py-3">
                <CalendarIcon className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground uppercase">Дни проведения</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {(() => {
                      const days: string[] = (tour as any).days ?? String((tour as any).daysText || '').split(',').map((s: string) => s.trim()).filter(Boolean);
                      return days.map((d: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-sm">{d}</span>
                      ));
                    })()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-muted/30 dark:bg-muted/20 rounded-lg px-4 py-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground uppercase">Время выезда</div>
                  {(() => {
                    const start: any = (tour as any).startTime;
                    if (!start) return <div className="text-sm font-medium">—</div>;
                    let text: string | null = null;
                    if (typeof start === 'string') {
                      text = start;
                    } else if (start.weekday && start.weekend) {
                      text = start.weekday === start.weekend
                        ? start.weekday
                        : `будни ${start.weekday}, выходные ${start.weekend}`;
                    }
                    return <div className="text-sm font-medium">{text}</div>;
                  })()}
                </div>
              </div>
            </div>

            {(tour as any).program && (tour as any).program.length > 0 && (
              <div className="dark:text-white">
                <h2 className="text-2xl font-bold mb-4">Программа</h2>
                <ul className="list-disc pl-6 space-y-2">
                  {(tour as any).program.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {(() => {
              const prices: string[] = (tour as any).prices || [];
              if (!prices.length) return null;

              const isHeading = (line: string) => line.startsWith('Льготные категории на канатную дорогу (');
              const headingIndexes: number[] = prices
                .map((p, i) => (isHeading(p) ? i : -1))
                .filter((i) => i >= 0);

              const firstHeading = headingIndexes.length ? headingIndexes[0] : prices.length;
              const baseItems = prices.slice(0, firstHeading).filter((p) => !isHeading(p));
              const hasParksIncluded = baseItems.some((p) => p.toLowerCase().includes('в стоимость входят все нац. парки'));
              const baseTitle = hasParksIncluded ? 'Стоимость (входят все нац. парки)' : 'Стоимость';

              const sections = headingIndexes.map((startIdx, idx) => {
                const endIdx = idx + 1 < headingIndexes.length ? headingIndexes[idx + 1] : prices.length;
                return {
                  title: prices[startIdx],
                  items: prices.slice(startIdx + 1, endIdx).filter((p) => !isHeading(p)),
                };
              });

              return (
                <div className="dark:text-white space-y-10">
                  {baseItems.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold mb-4">{baseTitle}</h2>
                      <ul className="list-disc pl-6 space-y-2">
                        {baseItems.map((line, idx) => (
                          <li key={idx}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {sections.map((sec, i) => (
                    sec.items.length > 0 ? (
                      <div key={i}>
                        <h2 className="text-2xl font-bold mb-4">{sec.title}</h2>
                        <ul className="list-disc pl-6 space-y-2">
                          {sec.items.map((item, j) => (
                            <li key={j}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null
                  ))}
                </div>
              );
            })()}

            {(tour as any).importantInfo && (tour as any).importantInfo.length > 0 && (
              <div className="dark:text-white">
                <h2 className="text-2xl font-bold mb-4">Важная информация</h2>
                <ul className="list-disc pl-6 space-y-2">
                  {(tour as any).importantInfo.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
                </ul>
              </div>
            )}
          </div>

          <TourChecklist included={(tour as any).includes ?? []} excluded={(tour as any).excludes ?? []} />

          {/* Точки встречи убраны по запросу */}

          {/* Бронирование внизу */}
          <section className="bg-white dark:bg-card rounded-lg shadow-lg p-6">
            <div className="text-3xl font-bold text-primary mb-2">
              {tour.priceRub} ₽
              <span className="text-sm text-muted-foreground ml-1">/чел.</span>
            </div>
            {/* уведомление о количестве оставшихся мест скрыто по запросу */}
            <BookingForm />
            <p className="text-sm text-muted-foreground text-center mt-4">Бесплатная отмена за 24 часа до начала</p>
          </section>
        </div>
      </div>
    </div>
  );
}