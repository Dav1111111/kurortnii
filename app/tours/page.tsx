"use client";

import { useState, useEffect } from "react";
import { TourFilter } from "@/components/tour-filter";
import { TourCard } from "@/components/tour-card";
import toursData from "@/data/tours.json";
import { motion, AnimatePresence } from "framer-motion";

interface FilterValues {
  date: Date;
  tourType: string;
  duration: number[];
}

export default function ToursPage() {
  const orderAquaparkLast = (list: typeof toursData.tours) => {
    return [...list].sort((a, b) => {
      const aIs = a.id === "aquapark-nautilus";
      const bIs = b.id === "aquapark-nautilus";
      if (aIs && !bIs) return 1;
      if (bIs && !aIs) return -1;
      return 0;
    });
  };

  const [filteredTours, setFilteredTours] = useState(orderAquaparkLast(toursData.tours));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleFilter = (values: FilterValues) => {
    let filtered = toursData.tours;

    // Filter by category
    if (values.tourType !== "all") {
      filtered = filtered.filter(tour => tour.category === values.tourType);
    }

    // Filter by duration
    if (values.duration?.length) {
      filtered = filtered.filter(tour => tour.durationHours <= values.duration[0]);
    }

    // Filter by date
    if (values.date) {
      const selectedDay = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' }).format(values.date).toLowerCase().replace('.', '');
      filtered = filtered.filter(tour => 
        tour.days.includes("ежедневно") || 
        tour.days.includes(selectedDay)
      );
    }

    setFilteredTours(orderAquaparkLast(filtered));

    // Scroll to results
    const element = document.getElementById("tours-list");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Все экскурсии</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Откройте для себя самые интересные места и впечатления в Сочи с нашими профессиональными гидами
            </p>
          </motion.div>
          
          <TourFilter onFilter={handleFilter} />
          
          <div id="tours-list" className="mt-16">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-turquoise-500 mx-auto"></div>
                </motion.div>
              ) : (
                <motion.div
                  key="tours"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredTours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                  {filteredTours.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <p className="text-lg text-muted-foreground">
                        По вашему запросу ничего не найдено. Попробуйте изменить параметры поиска.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}