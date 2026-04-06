"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Check, ChevronRight, MapPin } from "lucide-react";

const perks = [
  "Бесплатный трансфер из любого отеля",
  "Лицензированные гиды-местные эксперты",
  "Малые группы — максимум внимания",
  "Фотосопровождение на маршруте",
  "Гибкая отмена за 24 часа",
  "Предоплата только 20%",
];

export function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="section overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* ── Left: images collage ─────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative order-2 lg:order-1"
          >
            {/* Main photo */}
            <div className="relative h-[400px] sm:h-[500px] rounded-3xl overflow-hidden img-zoom">
              <Image
                src="/hero-sochi.jpg"
                alt="Наша команда на экскурсии в Сочи"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/40 to-transparent" />
            </div>

            {/* Floating card — years */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              className="absolute -bottom-6 -right-4 sm:-right-8 glass rounded-2xl p-5 shadow-card"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl font-extrabold text-gradient leading-none" style={{ letterSpacing: "-0.04em" }}>
                  10+
                </div>
                <div>
                  <p className="font-semibold text-sm leading-tight">лет работы</p>
                  <p className="text-muted-foreground text-xs">с 2014 года</p>
                </div>
              </div>
            </motion.div>

            {/* Floating badge — location */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute top-5 -left-4 sm:-left-6 glass rounded-xl px-4 py-2.5 shadow-card"
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-turquoise-500" />
                <span className="text-sm font-semibold">Сочи, Россия</span>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right: content ───────────────────────── */}
          <div className="order-1 lg:order-2 space-y-8">

            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2 mb-4"
              >
                <div className="divider" />
                <span className="text-xs font-semibold uppercase tracking-widest text-turquoise-600 dark:text-turquoise-400">
                  О компании
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em" }}
                className="mb-5 text-balance"
              >
                Мы открываем Сочи
                <br />
                <span className="text-gradient">изнутри</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground leading-relaxed"
              >
                «Южный Континент» — экскурсионное бюро с более чем 10-летним опытом.
                Мы создаём авторские маршруты по Сочи, Красной Поляне, Абхазии и горам —
                сочетая инсайдерские знания, комфорт и живое общение.
              </motion.p>
            </div>

            {/* Perks checklist */}
            <motion.ul
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.28 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3"
            >
              {perks.map((perk, i) => (
                <motion.li
                  key={perk}
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-2.5 text-sm"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-turquoise-100 dark:bg-turquoise-900/50 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-turquoise-600 dark:text-turquoise-400" />
                  </span>
                  <span className="text-foreground/80">{perk}</span>
                </motion.li>
              ))}
            </motion.ul>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.55 }}
            >
              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border-2 border-[#0A1628] dark:border-white text-[#0A1628] dark:text-white hover:bg-[#0A1628] hover:text-white dark:hover:bg-white dark:hover:text-[#0A1628] transition-all duration-300"
                >
                  Подробнее о нас
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
