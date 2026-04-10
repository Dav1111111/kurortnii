"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, CheckCircle2, ChevronRight, Send } from "lucide-react";

const benefits = [
  "Бесплатный трансфер из отеля",
  "Ответ в течение 5 минут",
  "Предоплата всего 20%",
  "Отмена бесплатно за 24 ч",
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function BookingForm() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} className="section bg-white dark:bg-card relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-turquoise-200/40 dark:bg-turquoise-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-coral-200/30 dark:bg-coral-900/15 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* Left: copy */}
          <div className="space-y-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 mb-4"
              >
                <div className="divider" />
                <span className="text-xs font-semibold uppercase tracking-widest text-turquoise-600 dark:text-turquoise-400">
                  Связаться с нами
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em" }}
                className="text-balance mb-4"
              >
                Забронируйте
                <br />
                <span className="text-gradient">прямо сейчас</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground leading-relaxed"
              >
                Напишите нам в мессенджер или позвоните — ответим за 5 минут и подберём лучший тур.
              </motion.p>
            </div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.28 }}
              className="space-y-3"
            >
              {benefits.map((b, i) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-turquoise-500 flex-shrink-0" />
                  <span>{b}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Right: messenger buttons */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <div className="bg-white dark:bg-card rounded-2xl p-6 sm:p-8 shadow-card border border-border space-y-5">
              <div>
                <h3 className="text-xl font-bold mb-1">Свяжитесь с нами</h3>
                <p className="text-muted-foreground text-sm">
                  Выберите удобный способ связи
                </p>
              </div>

              {/* WhatsApp */}
              <a
                href="https://wa.me/79891668631?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%98%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D1%83%D1%8E%D1%82%20%D1%8D%D0%BA%D1%81%D0%BA%D1%83%D1%80%D1%81%D0%B8%D0%B8."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 w-full p-4 rounded-xl transition-all hover:shadow-[0_6px_24px_rgba(37,211,102,0.3)] group"
                style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <WhatsAppIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 text-white">
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-sm text-white/70">Ответим за 5 минут</p>
                </div>
                <ChevronRight className="h-5 w-5 text-white/50 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/yug_kontinent"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 w-full p-4 rounded-xl transition-all hover:shadow-[0_6px_24px_rgba(0,136,204,0.3)] group"
                style={{ background: "linear-gradient(135deg, #0088cc, #0066aa)" }}
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Send className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 text-white">
                  <p className="font-semibold">Telegram</p>
                  <p className="text-sm text-white/70">@yug_kontinent</p>
                </div>
                <ChevronRight className="h-5 w-5 text-white/50 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Phone: Дианита */}
              <a
                href="tel:89891668631"
                className="flex items-center gap-4 w-full p-4 rounded-xl border border-border hover:border-turquoise-300 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-turquoise-50 dark:bg-turquoise-900/30 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-turquoise-600 dark:text-turquoise-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Дианита</p>
                  <p className="text-sm text-muted-foreground">8 989 166-86-31</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Phone: Андрей */}
              <a
                href="tel:89885007418"
                className="flex items-center gap-4 w-full p-4 rounded-xl border border-border hover:border-turquoise-300 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-turquoise-50 dark:bg-turquoise-900/30 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-turquoise-600 dark:text-turquoise-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Андрей</p>
                  <p className="text-sm text-muted-foreground">8 988 500-74-18</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
