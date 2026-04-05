"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ChevronRight } from "lucide-react";

interface Category {
  id: string;
  title: string;
  subtitle: string;
  count: number;
  image: string;
  color: string;
  tag: string;
}

const categories: Category[] = [
  {
    id: "city",
    title: "Городские",
    subtitle: "экскурсии",
    count: 3,
    image: "/images/%D0%9E%D0%BB%D0%B8%D0%BC%D0%BF%D0%B8%D0%B9%D1%81%D0%BA%D0%BE%D0%B5%20%D0%BD%D0%B0%D1%81%D0%BB%D0%B5%D0%B4%D0%B8%D0%B5/photo_2025-09-21%2019.35.17.jpeg",
    color: "from-turquoise-900/80",
    tag: "Популярное",
  },
  {
    id: "abkhazia",
    title: "Туры в",
    subtitle: "Абхазию",
    count: 2,
    image: "/images/%D0%93%D0%9E%D0%A1%D0%A2%D0%95%D0%9F%D0%A0%D0%98%D0%98%D0%9C%D0%9D%D0%90%D0%AF%20%D0%90%D0%91%D0%A5%D0%90%D0%97%D0%98%D0%AF/photo_2025-09-21%2018.12.36.jpeg",
    color: "from-emerald-900/80",
    tag: "Хит сезона",
  },
  {
    id: "jeeping",
    title: "Джипинг",
    subtitle: "туры",
    count: 4,
    image: "/images/%D0%94%D0%B6%D0%B8%D0%BF%D0%BF%D0%B8%D0%BD%D0%B3%20%D0%B2%20%D0%90%D0%B1%D1%85%D0%B0%D0%B7%D0%B8%D1%8E/photo_2025-09-21%2018.26.31.jpeg",
    color: "from-orange-900/80",
    tag: "Экстрим",
  },
  {
    id: "nature",
    title: "Горы и",
    subtitle: "водопады",
    count: 3,
    image: "/images/%D0%94%D0%95%D0%9D%D0%AC%20%D0%92%20%D0%93%D0%9E%D0%A0%D0%90%D0%A5/photo_2025-09-21%2019.35.09.jpeg",
    color: "from-blue-900/80",
    tag: "Природа",
  },
  {
    id: "family",
    title: "Для всей",
    subtitle: "семьи",
    count: 2,
    image: "/images/%D0%97%D0%BE%D0%BB%D0%BE%D1%82%D0%BE%D0%B5%20%D0%BA%D0%BE%D0%BB%D1%8C%D1%86%D0%BE%20%D0%B0%D0%B1%D1%85%D0%B0%D0%B7%D0%B8%D0%B8/photo_2025-09-21%2018.00.24.jpeg",
    color: "from-purple-900/80",
    tag: "Семейное",
  },
  {
    id: "adventure",
    title: "Экстрим",
    subtitle: "маршруты",
    count: 1,
    image: "/images/%D0%91%D0%B8%D0%B3%D1%84%D1%83%D1%82%20%D0%9A%D0%B2%D0%B0%D0%B4%D1%80%D1%8B/photo_2025-09-23%2014.04.23.jpeg",
    color: "from-red-900/80",
    tag: "Адреналин",
  },
];

export function Categories() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="section overflow-hidden">
      <div className="container mb-10">
        {/* Header */}
        <div
          ref={ref}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 mb-3"
            >
              <div className="divider" />
              <span className="text-xs font-semibold uppercase tracking-widest text-turquoise-600 dark:text-turquoise-400">
                Направления
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
              className="text-balance"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em" }}
            >
              Выберите своё
              <br />
              <span className="text-gradient">приключение</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
            >
              Все туры
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Horizontal scroll row */}
      <div className="flex gap-4 overflow-x-auto px-4 sm:px-[max(1.25rem,calc((100vw-1400px)/2+1.25rem))] pb-4 scrollbar-none snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.07 }}
            className="flex-shrink-0 snap-start"
          >
            <Link href={`/tours?category=${cat.id}`} className="block">
              <motion.div
                whileHover="hover"
                className="relative w-[260px] sm:w-[300px] h-[380px] rounded-3xl overflow-hidden cursor-pointer group"
              >
                {/* Background image */}
                <motion.div
                  className="absolute inset-0"
                  variants={{ hover: { scale: 1.07 } }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image
                    src={cat.image}
                    alt={cat.title + " " + cat.subtitle}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </motion.div>

                {/* Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} via-black/20 to-transparent`} />

                {/* Tag top-left */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-semibold border border-white/20">
                    {cat.tag}
                  </span>
                </div>

                {/* Count top-right */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs font-bold border border-white/20">
                    {cat.count}
                  </span>
                </div>

                {/* Content bottom */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
                  <p className="text-white/60 text-sm font-medium leading-none mb-1">{cat.title}</p>
                  <p className="text-white text-2xl font-extrabold leading-tight tracking-tight mb-3">
                    {cat.subtitle}
                  </p>

                  {/* Arrow — shows on hover */}
                  <motion.div
                    variants={{
                      hover: { opacity: 1, y: 0 },
                    }}
                    initial={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.3 }}
                    className="inline-flex items-center gap-2 text-white/90 text-xs font-semibold"
                  >
                    Смотреть туры
                    <ChevronRight className="h-3.5 w-3.5" />
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
