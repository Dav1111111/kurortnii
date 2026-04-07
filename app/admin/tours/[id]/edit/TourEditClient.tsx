"use client";

import { TourForm } from "@/components/admin/TourForm";
import type { Tour } from "@/lib/tours";

export function TourEditClient({ tour }: { tour: Tour }) {
  return <TourForm initialData={tour} tourId={tour.id} />;
}
