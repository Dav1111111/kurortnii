"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const images = [
  {
    src: "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg",
    alt: "Морской пейзаж",
    category: "Природа"
  },
  {
    src: "https://images.pexels.com/photos/7267852/pexels-photo-7267852.jpeg",
    alt: "Олимпийский парк",
    category: "Архитектура"
  },
  {
    src: "https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg",
    alt: "Горы",
    category: "Природа"
  },
  {
    src: "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg",
    alt: "Пляж",
    category: "Отдых"
  },
  {
    src: "https://images.pexels.com/photos/5257534/pexels-photo-5257534.jpeg",
    alt: "Водопады",
    category: "Природа"
  },
  {
    src: "https://images.pexels.com/photos/5088748/pexels-photo-5088748.jpeg",
    alt: "Экскурсия",
    category: "Активности"
  },
  {
    src: "https://images.pexels.com/photos/6143369/pexels-photo-6143369.jpeg",
    alt: "Закат",
    category: "Природа"
  },
  {
    src: "https://images.pexels.com/photos/2888649/pexels-photo-2888649.jpeg",
    alt: "Сочи Парк",
    category: "Развлечения"
  },
  {
    src: "https://images.pexels.com/photos/5876516/pexels-photo-5876516.jpeg",
    alt: "Дендрарий",
    category: "Парки"
  }
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-b from-turquoise-50 to-white dark:from-turquoise-950/20 dark:to-background">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Галерея</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Фотографии красивейших мест и незабываемых моментов в Сочи
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <motion.div
                key={image.src}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="font-medium">{image.alt}</p>
                      <p className="text-sm text-white/80">{image.category}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}