"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, Users, ChevronDown, ChevronUp, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Tour {
  id: string;
  title: string;
  description: string;
  image: string;
  durationHours: number;
  priceRub: number;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <Card className="h-full overflow-hidden group">
        <CardContent className="p-0">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={tour.image}
              alt={tour.title}
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              fill
            />
            {/* бейдж количества оставшихся мест скрыт по запросу */}
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
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-turquoise-500">
                  {tour.priceRub} ₽
                </span>
                <span className="text-sm text-muted-foreground ml-1">
                  /чел.
                </span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  size="icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-9 w-9"
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                <Link href={`/tours/${tour.slug}`}>
                  <Button className="bg-coral-500 hover:bg-coral-600">
                    Забронировать
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}