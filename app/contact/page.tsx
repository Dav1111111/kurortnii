"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Phone, Mail, MapPin, Clock, MessageSquare, Facebook, Instagram, Instagram as Telegram } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
  name: z.string().min(2, { message: "Имя должно содержать минимум 2 символа" }),
  email: z.string().email({ message: "Введите корректный email адрес" }),
  message: z.string().min(10, { message: "Сообщение должно содержать минимум 10 символов" }),
});

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(values);
    setIsSubmitting(false);
    form.reset();
  }

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-b from-turquoise-50 to-white dark:from-turquoise-950/20 dark:to-background">
        <div className="container">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Контакты</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Свяжитесь с нами любым удобным способом или оставьте заявку, и мы перезвоним вам
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6">Наши контакты</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-turquoise-100 dark:bg-turquoise-900 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-turquoise-600 dark:text-turquoise-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Телефон</h3>
                    <div className="space-y-1 text-muted-foreground">
                      <a href="tel:89891668631" className="hover:text-foreground transition-colors">Дианита: 8 989 166-86-31</a>
                      <div>
                        <a href="tel:89885007418" className="hover:text-foreground transition-colors">Андрей: 8 988 500-74-18</a>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <a href="tel:89891668631">
                        <Button asChild variant="outline" size="sm" className="gap-2">
                          <span className="inline-flex items-center"><Phone className="h-4 w-4 mr-1" /> Позвонить</span>
                        </Button>
                      </a>
                      <a href="https://wa.me/79891668631" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-2">
                          <MessageSquare className="h-4 w-4" />
                          WhatsApp
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Блок Email временно скрыт по запросу */}
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-turquoise-100 dark:bg-turquoise-900 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-turquoise-600 dark:text-turquoise-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Часы работы</h3>
                    <p className="text-muted-foreground">Пн–Пт: 9:00 — 20:00</p>
                    <p className="text-muted-foreground">Сб–Вс: 10:00 — 18:00</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-turquoise-100 dark:bg-turquoise-900 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-turquoise-600 dark:text-turquoise-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Адрес офиса</h3>
                    <p className="text-muted-foreground">Курортный проспект 47,</p>
                    <p className="text-muted-foreground">Сочи, Россия</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-semibold text-lg mb-4">Мы в соцсетях</h3>
                <div className="flex gap-4">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Facebook className="h-5 w-5" />
                    <span className="sr-only">Facebook</span>
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Instagram className="h-5 w-5" />
                    <span className="sr-only">Instagram</span>
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Telegram className="h-5 w-5" />
                    <span className="sr-only">Telegram</span>
                  </Button>
                </div>
              </div>
              
              <div className="mt-8">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2891.5758419455877!2d39.72655661744384!3d43.58481999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40f5bfd15ac66c05%3A0x8f8021d132f97c4f!2z0JrRg9GA0L7RgNGC0L3Ri9C5INC_0YDQvtGB0L_QtdC60YIsINCh0L7Rh9C4!5e0!3m2!1sru!2sru!4v1709913439943!5m2!1sru!2sru"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-6">Напишите нам</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Имя</FormLabel>
                        <FormControl>
                          <Input placeholder="Введите ваше имя" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" type="email" {...field} />
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
                        <FormLabel>Сообщение</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Введите ваше сообщение" 
                            className="min-h-[150px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-coral-500 hover:bg-coral-600 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Отправка..." : "Отправить сообщение"}
                  </Button>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}