// Серверный layout-компонент: рендерит JSON-LD и передаёт управление
// клиентскому ToursContent через Suspense.
// НЕ добавляйте "use client" в этот файл.

import { Suspense } from "react";
import { ToursItemListSchema } from "@/components/tour-schema";
import toursData from "@/data/tours.json";
import ToursClient from "./tours-client";

export const metadata = {
  title: "Все экскурсии в Сочи | Южный Континент",
  description: "Каталог экскурсий по Сочи, Абхазии и Красной Поляне: групповые и индивидуальные туры от 400 ₽. Джипинг, морские прогулки, семейные туры. Без предоплаты.",
  alternates: {
    canonical: "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/tours"
  }
};

export default function ToursPage() {
  return (
    <>
      {/* ItemList schema — карусель туров в выдаче Google/Яндекс */}
      <ToursItemListSchema tours={toursData.tours} />

      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-turquoise-500"></div>
        </div>
      }>
        <ToursClient />
      </Suspense>
    </>
  );
}
