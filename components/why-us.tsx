"use client";

import { motion } from "framer-motion";
import { Award, Bus, Calendar, Zap } from "lucide-react";

const features = [
  {
    id: "guides",
    icon: <Award className="h-8 w-8" />,
    title: "Лицензированные гиды",
    description: "Профессиональные гиды с многолетним опытом и глубокими знаниями региона"
  },
  {
    id: "transport",
    icon: <Bus className="h-8 w-8" />,
    title: "Комфортный транспорт",
    description: "Современные автомобили и микроавтобусы с климат-контролем"
  },
  {
    id: "schedule",
    icon: <Calendar className="h-8 w-8" />,
    title: "Гибкое расписание",
    description: "Возможность выбора удобной даты и времени начала тура"
  },
  {
    id: "booking",
    icon: <Zap className="h-8 w-8" />,
    title: "Мгновенное бронирование",
    description: "Быстрое подтверждение заказа и оплата онлайн"
  }
];

export function WhyUs() {
  return (
    <section className="py-20 bg-white dark:bg-background">
      <div className="container">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Почему выбирают нас</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Мы делаем всё, чтобы ваше путешествие было комфортным и запоминающимся
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="p-6 bg-gradient-to-b from-turquoise-50 to-transparent dark:from-turquoise-950/20 dark:to-transparent rounded-2xl">
                <div className="mb-4 inline-block p-3 bg-turquoise-100 dark:bg-turquoise-900/50 rounded-xl text-turquoise-600 dark:text-turquoise-400 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
              
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-turquoise-200 dark:group-hover:border-turquoise-800 rounded-2xl transition-colors duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}