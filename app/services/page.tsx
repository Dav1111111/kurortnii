"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Space as Spa, Utensils, Car, Camera, Umbrella, Users } from "lucide-react";

const services = [
  {
    icon: <Spa className="h-8 w-8" />,
    title: "СПА и велнес",
    description: "Расслабляющие процедуры и массажи в лучших спа-салонах города",
    price: "от 3000 ₽"
  },
  {
    icon: <Utensils className="h-8 w-8" />,
    title: "Ресторанный сервис",
    description: "Бронирование столиков в лучших ресторанах Сочи",
    price: "от 2000 ₽"
  },
  {
    icon: <Car className="h-8 w-8" />,
    title: "Трансфер",
    description: "Комфортабельные автомобили с профессиональными водителями",
    price: "от 1500 ₽"
  },
  {
    icon: <Camera className="h-8 w-8" />,
    title: "Фотосессии",
    description: "Профессиональная фотосъемка в живописных локациях",
    price: "от 5000 ₽"
  },
  {
    icon: <Umbrella className="h-8 w-8" />,
    title: "Пляжный сервис",
    description: "Аренда шезлонгов и зонтов на лучших пляжах",
    price: "от 1000 ₽"
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Персональный гид",
    description: "Индивидуальные экскурсии с опытным гидом",
    price: "от 4000 ₽"
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-b from-turquoise-50 to-white dark:from-turquoise-950/20 dark:to-background">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Услуги</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Дополнительные услуги для вашего комфортного отдыха
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="mb-4 text-turquoise-500">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-turquoise-500">{service.price}</span>
                    <Button className="bg-coral-500 hover:bg-coral-600">Заказать</Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}