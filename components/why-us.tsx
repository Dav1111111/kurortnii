"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Bus, Calendar, Zap, Shield, Star } from "lucide-react";

const stats = [
  {
    value: 10,
    suffix: "+",
    label: "лет на рынке",
    description: "Работаем с 2014 года, знаем каждый маршрут",
    icon: <Award className="h-5 w-5" />,
    color: "text-turquoise-500",
    bg: "bg-turquoise-50 dark:bg-turquoise-950/30",
  },
  {
    value: 500,
    suffix: "+",
    label: "туристов в год",
    description: "Принимаем гостей из всех регионов России",
    icon: <Star className="h-5 w-5" />,
    color: "text-coral-500",
    bg: "bg-coral-50 dark:bg-coral-950/30",
  },
  {
    value: 15,
    suffix: "",
    label: "авторских туров",
    description: "Уникальные маршруты, которых нет у других",
    icon: <Zap className="h-5 w-5" />,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    value: 4.9,
    suffix: "",
    label: "средний рейтинг",
    description: "По отзывам реальных участников",
    icon: <Shield className="h-5 w-5" />,
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
];

const features = [
  {
    icon: <Award className="h-6 w-6" />,
    title: "Лицензированные гиды",
    description: "Профессионалы с официальной лицензией и 10+ годами опыта в регионе",
  },
  {
    icon: <Bus className="h-6 w-6" />,
    title: "Комфортный транспорт",
    description: "Современные авто и микроавтобусы с климат-контролем",
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Гибкое расписание",
    description: "Ежедневные групповые и индивидуальные туры в удобное время",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Быстрое бронирование",
    description: "Подтверждение за 5 минут, предоплата 20%",
  },
];

function CountUp({ target, suffix, decimals = 0 }: { target: number; suffix: string; decimals?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const steps = 50;
    const stepTime = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      const progress = current / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (current >= steps) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [inView, target, decimals]);

  return (
    <span ref={ref}>
      {decimals > 0 ? value.toFixed(decimals) : Math.floor(value)}
      {suffix}
    </span>
  );
}

export function WhyUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section ref={sectionRef} className="section bg-[#F5EDD6]/40 dark:bg-ink/40">
      <div className="container">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2 mb-4"
        >
          <div className="divider" />
          <span className="text-xs font-semibold uppercase tracking-widest text-turquoise-600 dark:text-turquoise-400">
            Наши преимущества
          </span>
        </motion.div>

        {/* Headline */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em" }}
          >
            Почему выбирают
            <br />
            <span className="text-gradient">именно нас</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.25 }}
            className="text-muted-foreground max-w-sm text-sm leading-relaxed lg:text-right"
          >
            Мы делаем всё, чтобы ваш отдых в Сочи стал незабываемым — от удобного трансфера до глубоких рассказов о регионе
          </motion.p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.08 }}
              className="group"
            >
              <div className={`${s.bg} rounded-2xl p-5 sm:p-7 h-full border border-black/[0.04] dark:border-white/[0.06] hover:shadow-card transition-all duration-300`}>
                <div className={`inline-flex p-2 rounded-xl ${s.bg} ${s.color} mb-4`}>
                  {s.icon}
                </div>
                <div
                  className={`${s.color} font-extrabold leading-none mb-1`}
                  style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.04em" }}
                >
                  <CountUp
                    target={s.value}
                    suffix={s.suffix}
                    decimals={s.value % 1 !== 0 ? 1 : 0}
                  />
                </div>
                <p className="font-semibold text-sm mb-1">{s.label}</p>
                <p className="text-muted-foreground text-xs leading-relaxed hidden sm:block">{s.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.35 + i * 0.07 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-turquoise-50 dark:bg-turquoise-950/40 flex items-center justify-center text-turquoise-600 dark:text-turquoise-400 mt-0.5">
                {f.icon}
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">{f.title}</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
