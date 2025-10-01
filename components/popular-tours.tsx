"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight, Clock, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import toursData from "@/data/tours.json";

interface TourItem {
  id: string;
  title: string;
  image: string;
  rating: number;
  reviewCount: number;
  priceRub: number;
  durationHours: number;
  groupSize: string;
  seatsLeft: number;
}

const pickPopular = (): TourItem[] => {
  // простая выборка: берём первые 5 по рейтингу из данных
  return [...toursData.tours]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 5) as unknown as TourItem[];
};
const tours: TourItem[] = pickPopular();

export function PopularTours() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    skipSnaps: false,
    dragFree: true,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-turquoise-50 dark:from-background dark:to-turquoise-950/20">
      <div className="container">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Популярные туры</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Самые востребованные экскурсии и туры по Сочи и окрестностям
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="h-10 w-10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="h-10 w-10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-6">
              {tours.map((tour) => (
                <div
                  key={tour.id}
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_30%]"
                  onMouseEnter={() => setHoveredId(tour.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <Card className="h-full overflow-hidden group">
                    <CardContent className="p-0">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={tour.image}
                          alt={tour.title}
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                          fill
                        />
                        {/* бейдж количества оставшихся мест скрыт по запросу */}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                          {tour.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="ml-1 font-medium">{tour.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            ({tour.reviewCount} отзывов)
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{tour.durationHours} часов</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{tour.groupSize}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-turquoise-500">
                              {tour.priceRub} ₽
                            </span>
                            <span className="text-sm text-muted-foreground ml-1">
                              /чел.
                            </span>
                          </div>
                          <Button className="bg-coral-500 hover:bg-coral-600">
                            Забронировать
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8 md:hidden gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="h-10 w-10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="h-10 w-10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}