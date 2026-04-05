"use client";

import { useState, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Phone, User, ChevronRight, CheckCircle2, MessageSquare } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Введите ваше имя" }),
  phone: z
    .string()
    .min(6, { message: "Введите телефон" })
    .regex(/^(\+7|7|8)?[\s-]?\(?[489][0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/, {
      message: "Некорректный российский номер",
    }),
  message: z.string().optional(),
});

const benefits = [
  "Бесплатный трансфер из отеля",
  "Ответ в течение 5 минут",
  "Предоплата всего 20%",
  "Отмена бесплатно за 24 ч",
];

export function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: "", phone: "", message: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Ошибка");
      setSuccess(true);
      form.reset();
      setTimeout(() => setSuccess(false), 6000);
    } catch {
      // handle error silently — user sees no change
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section ref={ref} className="section bg-[#F5EDD6]/50 dark:bg-ink/50 relative overflow-hidden">
      {/* Decorative */}
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
                  Бронирование
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
                Оставьте заявку — перезвоним за 5 минут и подберём лучший тур под ваши пожелания.
              </motion.p>
            </div>

            {/* Benefits list */}
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

            {/* WhatsApp alternative */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              <p className="text-xs text-muted-foreground mb-3">Или напишите напрямую:</p>
              <a
                href="https://wa.me/79891668631"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
              >
                <MessageSquare className="h-4 w-4" />
                Написать в WhatsApp
              </a>
            </motion.div>
          </div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <div className="bg-white dark:bg-card rounded-3xl p-8 shadow-card border border-border">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center text-center py-8 gap-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-turquoise-50 dark:bg-turquoise-900/40 flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-turquoise-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Заявка отправлена!</h3>
                      <p className="text-muted-foreground text-sm">
                        Мы позвоним вам в течение 5–15 минут для подтверждения.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h3 className="text-xl font-bold mb-1">Оставить заявку</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      Бесплатно, без обязательств
                    </p>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    placeholder="Ваше имя"
                                    className="pl-11 h-12 rounded-xl border-border/60 focus:border-turquoise-400 focus-visible:ring-turquoise-400/20"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative">
                                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    placeholder="+7 (999) 000-00-00"
                                    className="pl-11 h-12 rounded-xl border-border/60 focus:border-turquoise-400 focus-visible:ring-turquoise-400/20"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Какой тур интересует? (необязательно)"
                                  className="h-12 rounded-xl border-border/60 focus:border-turquoise-400 focus-visible:ring-turquoise-400/20"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                          whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
                          className="w-full h-12 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                          style={{
                            background: "linear-gradient(135deg, #FF7F50 0%, #f05d29 100%)",
                            boxShadow: "0 4px 20px rgba(255,127,80,0.35)",
                          }}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Отправляем…
                            </span>
                          ) : (
                            <>
                              Отправить заявку
                              <ChevronRight className="h-4 w-4" />
                            </>
                          )}
                        </motion.button>

                        <p className="text-center text-xs text-muted-foreground">
                          Нажимая кнопку, вы соглашаетесь с{" "}
                          <a href="/privacy" className="underline hover:text-foreground">
                            политикой конфиденциальности
                          </a>
                        </p>
                      </form>
                    </Form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
