"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, MapPin, Clock, MessageSquare, CheckCircle2, ChevronRight, User, Send } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Введите имя (мин. 2 символа)" }),
  phone: z
    .string()
    .min(6, { message: "Введите телефон" })
    .regex(/^(\+7|7|8)?[\s-]?\(?[489][0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/, {
      message: "Некорректный российский номер",
    }),
  message: z.string().min(5, { message: "Сообщение слишком короткое" }),
});

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", phone: "", message: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: values.name, phone: values.phone, message: values.message }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Ошибка");
      setSuccess(true);
      form.reset();
      setTimeout(() => setSuccess(false), 6000);
    } catch {
      setErrorMsg("Ошибка отправки. Позвоните: 8 989 166-86-31");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative pt-32 pb-16 bg-[#0A1628] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-turquoise-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-coral-500/15 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-turquoise-400 rounded-full" />
              <span className="text-xs font-semibold uppercase tracking-widest text-turquoise-400">
                Связь
              </span>
            </div>
            <h1
              className="text-white font-extrabold mb-3 text-balance"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
            >
              Свяжитесь{" "}
              <span className="text-gradient">с нами</span>
            </h1>
            <p className="text-white/50 max-w-lg">
              Ответим за 5 минут в рабочее время. Или напишите — перезвоним сами.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Main content ─────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left: contacts info */}
            <div className="space-y-8">
              <FadeIn>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-0.5 bg-turquoise-500 rounded-full" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-turquoise-600 dark:text-turquoise-400">
                    Контакты
                  </span>
                </div>

                <div className="space-y-5">
                  {/* Phone */}
                  <div className="flex items-start gap-4 p-5 rounded-2xl border border-border hover:border-turquoise-300 dark:hover:border-turquoise-700 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-turquoise-100 dark:bg-turquoise-900/40 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-turquoise-600 dark:text-turquoise-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm mb-1">Телефон</p>
                      <a href="tel:89891668631" className="text-muted-foreground text-sm hover:text-foreground transition-colors block">
                        Дианита: 8 989 166-86-31
                      </a>
                      <a href="tel:89885007418" className="text-muted-foreground text-sm hover:text-foreground transition-colors block">
                        Андрей: 8 988 500-74-18
                      </a>
                      <div className="flex gap-2 mt-3">
                        <a
                          href="tel:89891668631"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-border hover:border-[#0A1628]/40 transition-colors"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          Позвонить
                        </a>
                        <a
                          href="https://wa.me/79891668631"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white"
                          style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4 p-5 rounded-2xl border border-border">
                    <div className="w-10 h-10 rounded-xl bg-turquoise-100 dark:bg-turquoise-900/40 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-turquoise-600 dark:text-turquoise-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">Часы работы</p>
                      <p className="text-muted-foreground text-sm">Пн–Пт: 9:00 — 20:00</p>
                      <p className="text-muted-foreground text-sm">Сб–Вс: 10:00 — 18:00</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4 p-5 rounded-2xl border border-border">
                    <div className="w-10 h-10 rounded-xl bg-turquoise-100 dark:bg-turquoise-900/40 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-turquoise-600 dark:text-turquoise-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">Адрес</p>
                      <p className="text-muted-foreground text-sm">Курортный проспект 47</p>
                      <p className="text-muted-foreground text-sm">Сочи, Россия</p>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Map */}
              <FadeIn delay={0.12}>
                <div className="rounded-2xl overflow-hidden border border-border">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d23132.606367647095!2d39.72655661744384!3d43.58481999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sru!2sru!4v1709913439943!5m2!1sru!2sru"
                    width="100%"
                    height="280"
                    style={{ border: 0, display: "block" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Карта офиса Южный Континент"
                  />
                </div>
              </FadeIn>
            </div>

            {/* Right: form */}
            <FadeIn delay={0.1}>
              <div className="bg-white dark:bg-card rounded-3xl p-8 border border-border shadow-card sticky top-24">
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center text-center py-10 gap-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-turquoise-50 dark:bg-turquoise-900/40 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-turquoise-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">Заявка отправлена!</h3>
                        <p className="text-muted-foreground text-sm">
                          Перезвоним в течение 5–15 минут.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="mb-6">
                        <h2 className="text-xl font-bold mb-1">Напишите нам</h2>
                        <p className="text-muted-foreground text-sm">Бесплатная консультация без обязательств</p>
                      </div>

                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="name"
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
                                  <Textarea
                                    placeholder="Какой тур вас интересует? Задайте любой вопрос…"
                                    className="min-h-[120px] rounded-xl border-border/60 focus:border-turquoise-400 focus-visible:ring-turquoise-400/20 resize-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {errorMsg && (
                            <p className="text-sm text-red-500 text-center">{errorMsg}</p>
                          )}

                          <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                            whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
                            className="w-full h-12 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
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
                                <Send className="h-4 w-4" />
                                Отправить сообщение
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

                      {/* WhatsApp alt */}
                      <div className="mt-5 pt-5 border-t border-border text-center">
                        <p className="text-xs text-muted-foreground mb-3">Или напишите напрямую:</p>
                        <a
                          href="https://wa.me/79891668631"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
                          style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
                        >
                          <MessageSquare className="h-4 w-4" />
                          Написать в WhatsApp
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
