"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Plus, ChevronRight } from "lucide-react";
import Link from "next/link";

import { faqs } from "@/data/faq-data";

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} className="section bg-[#F7F8FA] dark:bg-[#0d1520]">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 xl:gap-20">

          {/* Left: sticky heading */}
          <div className="lg:sticky lg:top-28 lg:self-start space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <div className="divider" />
              <span className="text-xs font-semibold uppercase tracking-widest text-turquoise-600 dark:text-turquoise-400">
                FAQ
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em" }}
              className="text-balance"
            >
              Часто задаваемые
              <br />
              <span className="text-gradient">вопросы</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.25 }}
              className="text-muted-foreground text-sm leading-relaxed max-w-xs"
            >
              Не нашли ответ? Напишите нам — ответим в течение нескольких минут.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35 }}
              className="flex flex-col gap-3"
            >
              <a
                href="https://wa.me/79891668631"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white w-fit transition-all hover:shadow-[0_6px_24px_rgba(37,211,102,0.4)]"
                style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
              >
                Написать в WhatsApp
              </a>
              <Link
                href="/faq"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
              >
                Все вопросы и ответы
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right: accordion */}
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.07 }}
              >
                <div
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm ${
                    openId === faq.id
                      ? "border-turquoise-200 dark:border-turquoise-800 bg-turquoise-50/50 dark:bg-turquoise-950/20 shadow-md"
                      : "border-border bg-card hover:border-turquoise-200 dark:hover:border-turquoise-800 hover:shadow-md"
                  }`}
                >
                  <button
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-semibold text-sm sm:text-base leading-snug pr-2">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openId === faq.id ? 45 : 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                        openId === faq.id
                          ? "bg-turquoise-500 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openId === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-6 pb-5">
                          <div className="w-full h-px bg-border mb-4" />
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
