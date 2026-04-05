"use client";

import { useEffect, useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";

interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  created_at: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
    dragFree: true,
  });

  const [activeIndex, setActiveIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Загружаем отзывы из API
  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch("/api/reviews");
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (error) {
        console.error("Ошибка при загрузке отзывов:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReviews();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    // Auto-scroll только если есть отзывы
    let autoplay: NodeJS.Timeout | null = null;
    if (reviews.length > 1) {
      autoplay = setInterval(() => {
        if (emblaApi.canScrollNext()) {
          emblaApi.scrollNext();
        } else {
          emblaApi.scrollTo(0);
        }
      }, 5000);
    }

    return () => {
      if (autoplay) clearInterval(autoplay);
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect, reviews.length]);

  return (
    <section className="py-20 bg-gradient-to-b from-turquoise-50 to-white dark:from-turquoise-950/20 dark:to-background">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Отзывы наших гостей</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Узнайте, что говорят путешественники о наших турах и экскурсиях
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-turquoise-500"></div>
          </div>
        ) : reviews.length === 0 ? (
          /* Показываем если нет отзывов */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <MessageSquare className="h-16 w-16 text-turquoise-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Пока нет отзывов</h3>
            <p className="text-muted-foreground mb-6">
              Будьте первым, кто оставит отзыв о наших экскурсиях!
            </p>
            <Link href="/reviews">
              <Button className="bg-turquoise-500 hover:bg-turquoise-600">
                Оставить отзыв
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="relative px-4">
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex -ml-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex-[0_0_100%] min-w-0 pl-4 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <Card className="h-full">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <Avatar className="h-12 w-12 bg-turquoise-100 dark:bg-turquoise-900">
                              <AvatarFallback className="text-turquoise-700 dark:text-turquoise-300">
                                {getInitials(review.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{review.name}</p>
                              <p className="text-sm text-muted-foreground">{review.location}</p>
                            </div>
                            <div className="ml-auto flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-gray-300"
                                    }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground italic">"{review.comment}"</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            {reviews.length > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollPrev}
                  className="h-11 w-11 rounded-full"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex gap-2">
                  {reviews.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 rounded-full transition-all ${activeIndex === index ? "w-6 bg-turquoise-500" : "w-2 bg-turquoise-200"
                        }`}
                      onClick={() => emblaApi?.scrollTo(index)}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollNext}
                  className="h-11 w-11 rounded-full"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}