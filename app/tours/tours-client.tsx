"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { TourFilter } from "@/components/tour-filter";
import { TourCard } from "@/components/tour-card";
import toursData from "@/data/tours.json";
import { motion, AnimatePresence } from "framer-motion";

interface FilterValues {
  tourType: string;
  duration: number[];
}

const orderAquaparkLast = (list: typeof toursData.tours) =>
  [...list].sort((a, b) => {
    const aIs = a.id === "aquapark-nautilus";
    const bIs = b.id === "aquapark-nautilus";
    return aIs && !bIs ? 1 : bIs && !aIs ? -1 : 0;
  });

export default function ToursClient() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || "all";

  const [filteredTours, setFilteredTours] = useState(orderAquaparkLast(toursData.tours));
  const [isLoading, setIsLoading] = useState(true);
  const [initialCategory, setInitialCategory] = useState(categoryFromUrl);

  useEffect(() => {
    setIsLoading(false);
    if (categoryFromUrl && categoryFromUrl !== "all") {
      setFilteredTours(orderAquaparkLast(toursData.tours.filter((t) => t.category === categoryFromUrl)));
    }
  }, [categoryFromUrl]);

  const handleFilter = (values: FilterValues) => {
    let filtered = toursData.tours;
    if (values.tourType !== "all") {
      filtered = filtered.filter((t) => t.category === values.tourType);
    }
    if (values.duration?.length) {
      filtered = filtered.filter((t) => t.durationHours <= values.duration[0]);
    }
    setFilteredTours(orderAquaparkLast(filtered));
    document.getElementById("tours-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen">
      {/* ── Page hero ──────────────────────────── */}
      <section className="relative pt-32 pb-16 bg-[#0A1628] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-turquoise-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-coral-500/15 rounded-full blur-3xl" />
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
                Каталог
              </span>
            </div>
            <h1
              className="text-white font-extrabold mb-3 text-balance"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
            >
              Все экскурсии{" "}
              <span className="text-gradient">в Сочи</span>
            </h1>
            <p className="text-white/50 max-w-lg">
              {toursData.tours.length} авторских маршрута — горы, море, Абхазия и джипинг
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Filter + Tours grid ─────────────────── */}
      <section className="section">
        <div className="container">
          {/* Filter */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-10"
          >
            <TourFilter onFilter={handleFilter} initialCategory={initialCategory} />
          </motion.div>

          {/* Tours grid */}
          <div id="tours-list">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center py-20"
                >
                  <div className="w-10 h-10 border-2 border-turquoise-400/30 border-t-turquoise-400 rounded-full animate-spin" />
                </motion.div>
              ) : (
                <motion.div
                  key="tours"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredTours.length === 0 ? (
                    <div className="text-center py-20">
                      <p className="text-5xl mb-4">🔍</p>
                      <p className="text-xl font-semibold mb-2">Ничего не найдено</p>
                      <p className="text-muted-foreground text-sm">
                        Попробуйте выбрать другую категорию
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <p className="text-sm text-muted-foreground">
                          Найдено:{" "}
                          <span className="font-semibold text-foreground">{filteredTours.length}</span>{" "}
                          {filteredTours.length === 1 ? "тур" : filteredTours.length < 5 ? "тура" : "туров"}
                        </p>
                      </div>
                      <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      >
                        <AnimatePresence>
                          {filteredTours.map((tour) => (
                            <TourCard key={tour.id} tour={tour} />
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    </>
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
