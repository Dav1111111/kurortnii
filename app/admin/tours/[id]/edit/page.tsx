import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { readTours } from "@/lib/tours";
import { TourEditClient } from "./TourEditClient";

export default async function EditTourPage({ params }: { params: { id: string } }) {
  const data = await readTours();
  const tour = data.tours.find((t) => t.id === params.id);
  if (!tour) notFound();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/tours"
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Редактирование тура</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{tour.title}</p>
        </div>
      </div>

      <TourEditClient tour={tour} />
    </div>
  );
}
