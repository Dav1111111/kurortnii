"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, Users, ChevronDown, ChevronUp, Check, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageGallery } from "@/components/image-gallery";

interface Tour {
  id: string;
  title: string;
  description: string;
  image: string;
  imagesFolder?: string;
  durationHours: number;
  priceRub: number;
  priceUnit?: string;
  priceNote?: string;
  days: string[];
  daysText?: string;
  startTime?: string | { weekday?: string; weekend?: string };
  groupSize: string;
  rating: number;
  reviewCount: number;
  seatsLeft: number;
  category: string;
  includes: string[];
  excludes?: string[];
  slug: string;
}

interface TourCardProps {
  tour: Tour;
}

export function TourCard({ tour }: TourCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([tour.image]);

  useEffect(() => {
    // Загружаем все изображения из папки тура
    if (tour.imagesFolder) {
      const fetchImages = async () => {
        try {
          const response = await fetch(`/api/tour-images?folder=${encodeURIComponent(tour.imagesFolder!)}`);
          if (response.ok) {
            const images = await response.json();
            if (images.length > 0) {
              setGalleryImages(images);
            }
          }
        } catch (error) {
          console.error('Ошибка загрузки изображений:', error);
        }
      };
      fetchImages();
    }
  }, [tour.imagesFolder]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <Card className="h-full overflow-hidden group">
        <CardContent className="p-0">
          <div 
            className="relative h-48 overflow-hidden cursor-pointer group/image"
            onClick={() => setGalleryOpen(true)}
          >
            <Image
              src={tour.image}
              alt={tour.title}
              className="object-cover transition-transform duration-500 group-hover/image:scale-110"
              fill
            />
            {/* Overlay при наведении */}
            <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                <ImageIcon className="h-12 w-12 text-white drop-shadow-lg" />
              </div>
            </div>
            {galleryImages.length > 1 && (
              <Badge className="absolute bottom-2 right-2 bg-black/70 text-white border-none">
                <ImageIcon className="h-3 w-3 mr-1" />
                {galleryImages.length}
              </Badge>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              {tour.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {tour.description}
            </p>
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
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4"
                >
                  <div className="space-y-6 border-t border-b py-4 my-4">
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                      <h4 className="font-semibold mb-3 text-amber-900 dark:text-amber-100 flex items-center gap-2">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Важная информация
                      </h4>
                      <ul className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
                        <li className="flex items-start gap-2">
                          <span className="font-semibold mt-0.5">•</span>
                          <span>Экскурсия состоится в любую погоду</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold mt-0.5">•</span>
                          <span>Возврат билета возможен не менее, чем за 1 сутки до начала экскурсии</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold mt-0.5">•</span>
                          <span>В день проведения экскурсии билет возврату не подлежит</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold mt-0.5">•</span>
                          <span>При опоздании на посадку стоимость билета не возвращается, перенос даты не производится</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">В стоимость входит:</h4>
                      <ul className="space-y-2">
                        {tour.includes.map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Дни проведения:</h4>
                      <p className="text-sm text-muted-foreground">
                        {tour.daysText ?? tour.days.join(", ")}
                      </p>
                    </div>
                    {(() => {
                      const start: any = tour.startTime as any;
                      if (!start) return null;
                      let text: string | null = null;
                      if (typeof start === 'string') {
                        text = start;
                      } else if (start?.weekday && start?.weekend) {
                        text = start.weekday === start.weekend
                          ? start.weekday
                          : `будни ${start.weekday}, выходные ${start.weekend}`;
                      }
                      return text ? (
                        <div>
                          <h4 className="font-semibold mb-2">Время выезда:</h4>
                          <p className="text-sm text-muted-foreground">{text}</p>
                        </div>
                      ) : null;
                    })()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="text-center sm:text-left">
                <div>
                  <span className="text-2xl font-bold text-turquoise-500">
                    {tour.priceRub} ₽
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    /{tour.priceUnit || "чел."}
                  </span>
                </div>
                {tour.priceNote && (
                  <p className="text-xs text-amber-600 dark:text-amber-500 mt-1 font-medium">
                    ⓘ {tour.priceNote}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-11 px-4 flex-shrink-0 font-semibold border-2 hover:bg-turquoise-50 hover:border-turquoise-500 transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Свернуть
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Подробнее
                    </>
                  )}
                </Button>
                <Link href={`/tours/${tour.slug}`} className="flex-1 sm:flex-none">
                  <Button className="w-full bg-coral-500 hover:bg-coral-600 h-11">
                    Забронировать
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Modal */}
      <ImageGallery
        images={galleryImages}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
      />
    </motion.div>
  );
}