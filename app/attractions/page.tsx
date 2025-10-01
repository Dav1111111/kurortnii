"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { MapPin, Clock, Star } from "lucide-react";

const attractions = [
  {
    title: "Олимпийский парк",
    description: "Главный объект зимней Олимпиады 2014 года с впечатляющими спортивными аренами",
    image: "https://images.pexels.com/photos/7267852/pexels-photo-7267852.jpeg",
    location: "Адлерский район",
    duration: "2-3 часа",
    rating: 4.8,
    reviews: 1250,
    type: "Спортивный объект"
  },
  {
    title: "Сочи Парк",
    description: "Первый тематический парк развлечений в России с современными аттракционами",
    image: "https://images.pexels.com/photos/2888649/pexels-photo-2888649.jpeg",
    location: "Адлерский район",
    duration: "4-6 часов",
    rating: 4.7,
    reviews: 980,
    type: "Парк развлечений"
  },
  {
    title: "Дендрарий",
    description: "Уникальный парк-музей с коллекцией субтропической флоры со всего мира",
    image: "https://images.pexels.com/photos/5876516/pexels-photo-5876516.jpeg",
    location: "Центральный район",
    duration: "2-3 часа",
    rating: 4.9,
    reviews: 850,
    type: "Парк"
  },
  {
    title: "Роза Хутор",
    description: "Современный горнолыжный курорт с развитой инфраструктурой",
    image: "https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg",
    location: "Красная Поляна",
    duration: "Весь день",
    rating: 4.8,
    reviews: 1480,
    type: "Горный курорт"
  },
  {
    title: "Агурские водопады",
    description: "Каскад живописных водопадов в окружении реликтового леса",
    image: "https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg",
    location: "Хостинский район",
    duration: "3-4 часа",
    rating: 4.7,
    reviews: 670,
    type: "Природный объект"
  },
  {
    title: "Морской порт",
    description: "Главные морские ворота города с красивой набережной",
    image: "https://images.pexels.com/photos/1998439/pexels-photo-1998439.jpeg",
    location: "Центральный район",
    duration: "1-2 часа",
    rating: 4.6,
    reviews: 520,
    type: "Архитектура"
  }
];

export default function AttractionsPage() {
  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-b from-turquoise-50 to-white dark:from-turquoise-950/20 dark:to-background">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Достопримечательности</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Самые интересные места и достопримечательности Сочи
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((attraction, index) => (
              <motion.div
                key={attraction.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={attraction.image}
                      alt={attraction.title}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-4 right-4 bg-white/90">
                      {attraction.type}
                    </Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{attraction.title}</h3>
                    <p className="text-muted-foreground mb-4">{attraction.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-turquoise-500" />
                        <span>{attraction.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-turquoise-500" />
                        <span>{attraction.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span>{attraction.rating}</span>
                        <span className="text-muted-foreground">
                          ({attraction.reviews} отзывов)
                        </span>
                      </div>
                    </div>
                    <Button className="w-full bg-coral-500 hover:bg-coral-600">
                      Подробнее
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}