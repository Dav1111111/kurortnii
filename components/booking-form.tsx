"use client";

import { useState, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Phone, User, ChevronRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

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
      toast.error("Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section ref={ref} className="section bg-white dark:bg-card relative overflow-hidden">
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
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:shadow-[0_6px_24px_rgba(37,211,102,0.4)]"
                style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
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
            <div className="bg-white dark:bg-card rounded-2xl p-5 sm:p-8 shadow-card border border-border">
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
                              <FormLabel className="sr-only">Ваше имя</FormLabel>
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
                              <FormLabel className="sr-only">Телефон</FormLabel>
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
                              <FormLabel className="sr-only">Сообщение</FormLabel>
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
                          whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
                          className="w-full h-12 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60 hover:shadow-[0_6px_28px_rgba(255,127,80,0.5)]"
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
