'use client';

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Check, MapPin, Award, Users, Star, ChevronRight, Quote } from "lucide-react";
import { AboutPageSchema } from "@/components/tour-schema";

const stats = [
  { number: "10+", label: "лет на рынке" },
  { number: "500+", label: "туристов в год" },
  { number: "4.9", label: "рейтинг" },
  { number: "15+", label: "маршрутов" },
];

const timeline = [
  { year: "2014", title: "Основание компании", text: "Начали с двух маршрутов по Сочи. Первые 50 туристов — и мы поняли, что это дело всей жизни." },
  { year: "2016", title: "Расширение в Абхазию", text: "Открыли направление Абхазия — озеро Рица, Новый Афон. Спрос превзошёл все ожидания." },
  { year: "2019", title: "Запуск джипинг-туров", text: "Добавили внедорожные маршруты в горы. 33 водопада, Красная Поляна, плато Лагонаки." },
  { year: "2022", title: "500+ туристов в год", text: "Вышли на новый уровень. Наняли дополнительных гидов, обновили автопарк." },
  { year: "2024", title: "Рейтинг 4.9/5", text: "Более 200 отзывов на Яндексе и Google. Для нас это главная награда." },
];

const values = [
  { icon: MapPin, title: "Местные эксперты", text: "Живём в Сочи, знаем каждый уголок. Не читаем по скрипту — рассказываем то, что знаем сами." },
  { icon: Star, title: "Авторские маршруты", text: "Ни одна экскурсия не повторяет другую. Подбираем программу под запросы группы." },
  { icon: Users, title: "Малые группы", text: "Максимум 8–12 человек. Индивидуальный подход, живое общение, без толпы." },
  { icon: Award, title: "10 лет опыта", text: "Провели тысячи туров. Умеем работать с любыми ситуациями на маршруте." },
];

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <AboutPageSchema />

      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative pt-32 pb-20 bg-[#0A1628] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-turquoise-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-coral-500/15 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-turquoise-400 rounded-full" />
              <span className="text-xs font-semibold uppercase tracking-widest text-turquoise-400">
                О компании
              </span>
            </div>
            <h1
              className="text-white font-extrabold mb-6 text-balance"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
            >
              Южный Континент —{" "}
              <span className="text-gradient">10 лет</span>{" "}
              в Сочи
            </h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-xl">
              Локальное экскурсионное агентство. Авторские маршруты, малые группы,
              гиды — местные жители. С 2014 года помогаем туристам открывать настоящий Сочи.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-px mt-16 border border-white/10 rounded-2xl overflow-hidden"
          >
            {stats.map((s, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm px-6 py-5 text-center">
                <p className="text-white font-extrabold" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", letterSpacing: "-0.04em" }}>
                  {s.number}
                </p>
                <p className="text-white/50 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Story / Mission ──────────────────────── */}
      <section className="section bg-[#F5EDD6]/40 dark:bg-ink/40">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div className="relative">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden">
                  <Image
                    src="/images/%D0%91%D0%B8%D0%B3%D1%84%D1%83%D1%82%20%D0%9A%D0%B2%D0%B0%D0%B4%D1%80%D1%8B/photo_2025-09-23%2014.04.23.jpeg"
                    alt="Команда Южный Континент"
                    fill
                    className="object-cover img-zoom"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-6 -right-4 bg-white dark:bg-card rounded-2xl shadow-card p-4 min-w-[150px]">
                  <p className="text-3xl font-extrabold text-[#0A1628] dark:text-white" style={{ letterSpacing: "-0.04em" }}>10+</p>
                  <p className="text-xs text-muted-foreground mt-0.5">лет опыта</p>
                </div>
                <div className="absolute -top-4 -left-4 bg-[#0A1628] text-white rounded-2xl px-4 py-3 text-xs font-semibold">
                  📍 Сочи, Россия
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-turquoise-500 rounded-full" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-turquoise-600 dark:text-turquoise-400">
                    Наша история
                  </span>
                </div>
                <h2
                  className="font-extrabold text-balance"
                  style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
                >
                  Не туристический бизнес —<br />
                  <span className="text-gradient">образ жизни</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Мы начинали с простой идеи: показать Сочи так, как его видят местные.
                  Не стандартные автобусные туры, а живые маршруты с историями, которые
                  не найти в путеводителях.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  За 10 лет провели тысячи экскурсий, объездили горы и побережье Абхазии,
                  собрали команду гидов, которые влюблены в свою работу. Каждый маршрут —
                  это личный опыт, а не чужой сценарий.
                </p>

                <ul className="space-y-2.5 pt-2">
                  {["Официально зарегистрированный туроператор", "Страхование ответственности", "Аккредитованные гиды-экскурсоводы", "Трансфер из любого отеля Сочи"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-turquoise-100 dark:bg-turquoise-900/40 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-turquoise-600 dark:text-turquoise-400" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>

                <Link href="/tours">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #FF7F50 0%, #f05d29 100%)", boxShadow: "0 4px 20px rgba(255,127,80,0.3)" }}
                  >
                    Смотреть экскурсии
                    <ChevronRight className="h-4 w-4" />
                  </motion.button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────── */}
      <section className="section">
        <div className="container">
          <FadeIn className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-turquoise-500 rounded-full" />
              <span className="text-xs font-semibold uppercase tracking-widest text-turquoise-600 dark:text-turquoise-400">
                История
              </span>
              <div className="w-8 h-0.5 bg-turquoise-500 rounded-full" />
            </div>
            <h2
              className="font-extrabold text-balance"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
            >
              Как мы росли
            </h2>
          </FadeIn>

          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-[68px] sm:left-[88px] top-0 bottom-0 w-px bg-border" />

            <div className="space-y-10">
              {timeline.map((item, i) => (
                <FadeIn key={item.year} delay={i * 0.08}>
                  <div className="flex gap-6 sm:gap-10 items-start">
                    {/* Year */}
                    <div className="flex-shrink-0 w-[60px] sm:w-[80px] text-right">
                      <span className="text-sm font-bold text-turquoise-600 dark:text-turquoise-400">{item.year}</span>
                    </div>
                    {/* Dot */}
                    <div className="relative flex-shrink-0 mt-1">
                      <div className="w-4 h-4 rounded-full bg-[#0A1628] dark:bg-turquoise-400 border-2 border-white dark:border-card ring-2 ring-turquoise-400/30" />
                    </div>
                    {/* Content */}
                    <div className="flex-1 pb-2">
                      <h3 className="font-bold text-base mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────── */}
      <section className="section bg-[#0A1628] overflow-hidden relative">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-turquoise-500/20 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          <FadeIn className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-turquoise-400 rounded-full" />
              <span className="text-xs font-semibold uppercase tracking-widest text-turquoise-400">
                Принципы
              </span>
              <div className="w-8 h-0.5 bg-turquoise-400 rounded-full" />
            </div>
            <h2
              className="text-white font-extrabold text-balance"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
            >
              Почему выбирают нас
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.08}>
                <div className="glass-dark rounded-2xl p-6 h-full">
                  <div className="w-10 h-10 rounded-xl bg-turquoise-500/20 flex items-center justify-center mb-4">
                    <v.icon className="h-5 w-5 text-turquoise-400" />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-2">{v.title}</h3>
                  <p className="text-white/50 text-xs leading-relaxed">{v.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quote / CTA ──────────────────────────── */}
      <section className="section">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <Quote className="h-10 w-10 text-turquoise-400/40 mx-auto mb-6" />
              <blockquote
                className="font-extrabold text-balance mb-8"
                style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", lineHeight: 1.3, letterSpacing: "-0.02em" }}
              >
                Мы не продаём туры — мы дарим воспоминания, которые остаются с вами навсегда.
              </blockquote>
              <p className="text-muted-foreground text-sm mb-8">— Команда Южный Континент</p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/tours">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-3.5 rounded-xl text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #FF7F50 0%, #f05d29 100%)", boxShadow: "0 4px 20px rgba(255,127,80,0.3)" }}
                  >
                    Выбрать экскурсию
                  </motion.button>
                </Link>
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-3.5 rounded-xl text-sm font-semibold border border-border hover:border-[#0A1628]/40 transition-colors"
                  >
                    Связаться с нами
                  </motion.button>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
