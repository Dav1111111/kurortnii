"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronRight, ArrowDown, Star, MapPin, Phone } from "lucide-react";

const WORDS = ["Сочи", "Абхазию", "Поляну", "горы"];

const stats = [
  { value: "12+", label: "лет опыта" },
  { value: "500+", label: "довольных туристов" },
  { value: "4.9", label: "средний рейтинг", icon: <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> },
];

const quickLinks = [
  { href: "/tours?category=city", label: "Обзорные", icon: <MapPin className="h-3.5 w-3.5" /> },
  { href: "/tours?category=jeeping", label: "Джипинг", icon: <ChevronRight className="h-3.5 w-3.5" /> },
  { href: "/tours?category=abkhazia", label: "Абхазия", icon: <ChevronRight className="h-3.5 w-3.5" /> },
];

export function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const id = setInterval(() => {
      setWordIndex((i) => (i + 1) % WORDS.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[640px] max-h-[1000px] flex items-end overflow-hidden"
    >
      {/* ── Background photo with parallax ──────────── */}
      <motion.div className="absolute inset-0 z-0" style={{ y: imgY }}>
        <picture>
          <source media="(max-width: 828px)" srcSet="/hero-828.webp" type="image/webp" />
          <source srcSet="/hero-1920.webp" type="image/webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-sochi.jpg"
            alt="Экскурсии в Сочи"
            fetchPriority="high"
            decoding="async"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          />
        </picture>
      </motion.div>

      {/* ── Gradient overlays ───────────────────────── */}
      {/* Top gradient — makes header always readable */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0A1628]/70 via-transparent to-transparent" style={{ height: "45%" }} />
      {/* Bottom gradient — hero content area */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/55 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0A1628]/50 via-transparent to-transparent" />

      {/* ── Content ─────────────────────────────────── */}
      <motion.div
        className="container relative z-20 pb-14 sm:pb-20"
        style={{ y: contentY, opacity }}
      >
        <div className="max-w-4xl">

          {/* Eyebrow tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-turquoise-400/20 border border-turquoise-400/30 text-turquoise-300 text-xs font-semibold tracking-widest uppercase backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-turquoise-400 animate-pulse" />
              Экскурсионное бюро · Сочи
            </span>
          </motion.div>

          {/* Headline */}
          <div className="overflow-hidden mb-4">
            <motion.h1
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="font-bold text-white leading-none"
              style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)", letterSpacing: "-0.03em" }}
            >
              Узнай{" "}
              <span className="relative inline-block">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{ y: 40, opacity: 0, filter: "blur(8px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -40, opacity: 0, filter: "blur(8px)" }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block text-gradient"
                    style={{
                      fontSize: WORDS[wordIndex].length > 8
                        ? "clamp(2rem, 5.5vw, 5.2rem)"
                        : undefined
                    }}
                  >
                    {WORDS[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <br />
              <motion.span
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
                className="inline-block text-white/90 leading-none"
              >
                как местный
              </motion.span>
            </motion.h1>
          </div>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            className="text-white/60 text-lg max-w-lg mb-10 leading-relaxed"
          >
            15 авторских маршрутов по Сочи, Абхазии и горам. Бесплатный трансфер из любого отеля.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
            className="flex flex-wrap items-center gap-3 mb-12"
          >
            <Link href="/tours">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-white text-base transition-all"
                style={{
                  background: "linear-gradient(135deg, #FF7F50 0%, #f05d29 100%)",
                  boxShadow: "0 6px 28px rgba(255,127,80,0.45)",
                }}
              >
                Выбрать экскурсию
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            </Link>

            <a href="tel:89891668631">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-white text-base border border-white/25 backdrop-blur-sm hover:border-white/50 transition-all"
              >
                <Phone className="h-4 w-4" />
                Позвонить
              </motion.button>
            </a>
          </motion.div>

          {/* Quick category pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
            className="flex flex-wrap gap-2 mb-12"
          >
            {quickLinks.map((q) => (
              <Link key={q.href} href={q.href}>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white/80 border border-white/20 hover:border-white/50 hover:text-white backdrop-blur-sm transition-all cursor-pointer"
                >
                  {q.icon}
                  {q.label}
                </motion.span>
              </Link>
            ))}
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="flex flex-wrap gap-8"
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 + i * 0.08 }}
                className="flex items-baseline gap-1.5"
              >
                <span className="text-2xl sm:text-3xl font-extrabold text-white leading-none tracking-tight">
                  {s.value}
                </span>
                <span className="text-white/45 text-xs flex items-center gap-1">
                  {s.icon}
                  {s.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Scroll indicator ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{ opacity }}
        className="absolute bottom-8 right-8 z-20 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-[10px] font-semibold tracking-widest uppercase rotate-90 origin-center mb-2">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center"
        >
          <ArrowDown className="h-3.5 w-3.5 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
