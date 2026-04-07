import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TourForm } from "@/components/admin/TourForm";

export default function NewTourPage() {
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Новый тур</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Заполните данные нового тура</p>
        </div>
      </div>

      <TourForm />
    </div>
  );
}
