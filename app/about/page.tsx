'use client';

import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const teamMembers = [
  {
    name: "Анна Петрова",
    role: "Генеральный директор",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    initials: "АП"
  },
  {
    name: "Михаил Иванов",
    role: "Руководитель экскурсионного отдела",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    initials: "МИ"
  },
  {
    name: "Елена Смирнова",
    role: "Главный гид-экскурсовод",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    initials: "ЕС"
  }
];

const licenses = [
  {
    id: "tourism",
    title: "Туроператорская деятельность",
    number: "РТО 123456",
    issueDate: "15.03.2020"
  },
  {
    id: "guide",
    title: "Аккредитация гидов-экскурсоводов",
    number: "АГЭ 789012",
    issueDate: "01.06.2020"
  },
  {
    id: "insurance",
    title: "Страхование ответственности",
    number: "СТР 345678",
    issueDate: "10.01.2024"
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-turquoise-50 to-white dark:from-turquoise-950/20 dark:to-background">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              О нас
            </motion.h1>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Узнайте больше о нашей команде и почему тысячи путешественников выбирают наши экскурсии
            </motion.p>
          </div>

          <motion.div 
            className="prose prose-lg dark:prose-invert mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-center text-xl leading-relaxed">
              Южный Континент - это локальное экскурсионное агентство, основанное в 2010 году группой 
              профессиональных гидов и энтузиастов. Мы специализируемся на авторских экскурсиях, 
              которые раскрывают уникальную красоту и богатую историю Сочи и его окрестностей. 
              Наша миссия - создавать незабываемые впечатления и помогать гостям города увидеть 
              его глазами местных жителей.
            </p>
          </motion.div>

          <div className="mb-20">
            <motion.h2 
              className="text-3xl font-bold text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Наша команда
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                  <Card className="p-6 text-center">
                    <Avatar className="w-32 h-32 mx-auto mb-4">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                    <p className="text-muted-foreground">{member.role}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">Наши лицензии</h2>
            <div className="max-w-2xl mx-auto">
              <Card className="p-6">
                <ul className="space-y-4">
                  {licenses.map((license) => (
                    <li key={license.id} className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold">{license.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">№ {license.number}</Badge>
                          <span className="text-sm text-muted-foreground">
                            от {license.issueDate}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}