// Серверный компонент: рендерит JSON-LD, hero с H1 (SSR), передаёт клиенту фильтр+сетку.
// НЕ добавляйте "use client" в этот файл.

import { Suspense } from "react";
import { ToursItemListSchema } from "@/components/tour-schema";
import toursData from "@/data/tours.json";
import ToursClient from "./tours-client";


export default function ToursPage() {
  return (
    <>
      <ToursItemListSchema tours={toursData.tours} />

      {/* Hero — SSR, H1 видна поисковикам */}
      <section className="relative pt-32 pb-16 bg-[#0A1628] overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-turquoise-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-coral-500/15 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
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
        </div>
      </section>

      {/* Фильтр + сетка туров (Client Component) */}
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-turquoise-500" />
        </div>
      }>
        <ToursClient />
      </Suspense>
    </>
  );
}
