"use client";

import { Card } from "@/components/ui/card";
import { Bean as Beach, Mountain, UtensilsCrossed, Landmark, Bike, Camera } from "lucide-react";
import { motion } from "framer-motion";

interface Category {
  id: string;
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

const categories: Category[] = [
  {
    id: "beach",
    title: "Пляжный отдых",
    count: 24,
    icon: <Beach />,
    color: "text-blue-500",
  },
  {
    id: "mountain",
    title: "Горные туры",
    count: 18,
    icon: <Mountain />,
    color: "text-emerald-500",
  },
  {
    id: "gastronomy",
    title: "Гастротуры",
    count: 12,
    icon: <UtensilsCrossed />,
    color: "text-orange-500",
  },
  {
    id: "cultural",
    title: "Культурные",
    count: 15,
    icon: <Landmark />,
    color: "text-purple-500",
  },
  {
    id: "active",
    title: "Активный отдых",
    count: 21,
    icon: <Bike />,
    color: "text-red-500",
  },
  {
    id: "photo",
    title: "Фототуры",
    count: 9,
    icon: <Camera />,
    color: "text-pink-500",
  },
];

export function Categories() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Категории туров</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Выберите категорию и откройте для себя уникальные туры и экскурсии в Сочи
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="relative overflow-hidden cursor-pointer group">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-turquoise-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                    whileHover={{ opacity: 1 }}
                  />
                  
                  <div className="p-6 flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-background shadow-lg ${category.color}`}>
                      {category.icon}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">{category.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.count} {category.count > 1 && category.count < 5 ? "тура" : "туров"}
                      </p>
                    </div>
                    
                    <motion.div 
                      className="ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0"
                      initial={false}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="h-8 w-8 rounded-full bg-turquoise-400/10 flex items-center justify-center">
                        <svg 
                          className="w-4 h-4 text-turquoise-500" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 5l7 7-7 7" 
                          />
                        </svg>
                      </div>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}