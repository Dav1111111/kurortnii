"use client";

import { motion } from "framer-motion";
import { Users, Award, Clock } from "lucide-react";

export function AboutSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-turquoise-50 dark:from-background dark:to-turquoise-950/20">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">О нас</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            «Курортный Сочи» — экспертное экскурсионное бюро с более чем 10-летним опытом, 
            погружающее гостей в аутентичную атмосферу региона. Мы создаем авторские маршруты 
            по Сочи, Красной Поляне и побережью, сочетая инсайдерские знания, комфорт и гибкость.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="p-6 bg-gradient-to-b from-turquoise-50 to-transparent dark:from-turquoise-950/20 dark:to-transparent rounded-2xl">
              <div className="mb-4 inline-block p-3 bg-turquoise-100 dark:bg-turquoise-900/50 rounded-xl text-turquoise-600 dark:text-turquoise-400">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-turquoise-600 dark:text-turquoise-400">
                Инсайдерский подход
              </h3>
              <p className="text-muted-foreground">
                Наши гиды — местные эксперты, открывающие скрытые жемчужины Сочи и 
                рассказывающие уникальные истории.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="p-6 bg-gradient-to-b from-turquoise-50 to-transparent dark:from-turquoise-950/20 dark:to-transparent rounded-2xl">
              <div className="mb-4 inline-block p-3 bg-turquoise-100 dark:bg-turquoise-900/50 rounded-xl text-turquoise-600 dark:text-turquoise-400">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-turquoise-600 dark:text-turquoise-400">
                Лицензированные гиды
              </h3>
              <p className="text-muted-foreground">
                Все экскурсоводы имеют официальную лицензию и глубокие знания истории и культуры.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="p-6 bg-gradient-to-b from-turquoise-50 to-transparent dark:from-turquoise-950/20 dark:to-transparent rounded-2xl">
              <div className="mb-4 inline-block p-3 bg-turquoise-100 dark:bg-turquoise-900/50 rounded-xl text-turquoise-600 dark:text-turquoise-400">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-turquoise-600 dark:text-turquoise-400">
                Гибкий график
              </h3>
              <p className="text-muted-foreground">
                Широкий выбор дат и времени: групповые, индивидуальные и вечерние туры на ваш вкус.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}