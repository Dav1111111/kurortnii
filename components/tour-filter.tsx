"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { value: "all", label: "Все туры" },
  { value: "city", label: "Городские" },
  { value: "abkhazia", label: "Абхазия" },
  { value: "jeeping", label: "Джипинг" },
  { value: "nature", label: "Горы" },
  { value: "family", label: "Семейные" },
  { value: "adventure", label: "Экстрим" },
];

interface TourFilterProps {
  onFilter: (values: { tourType: string; duration: number[] }) => void;
  initialCategory?: string;
}

export function TourFilter({ onFilter, initialCategory = "all" }: TourFilterProps) {
  const [selected, setSelected] = useState(initialCategory);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSelected(initialCategory);
  }, [initialCategory]);

  function handleCategory(value: string) {
    setSelected(value);
    onFilter({ tourType: value, duration: [999] });
    const el = document.getElementById("tours-list");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    onFilter({ tourType: selected, duration: [999] });
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Поиск по экскурсиям…"
          value={search}
          onChange={handleSearch}
          className="w-full h-12 pl-11 pr-10 rounded-2xl border border-border bg-background text-sm outline-none focus:border-turquoise-400 focus:ring-2 focus:ring-turquoise-400/20 transition-all placeholder:text-muted-foreground"
        />
        {search && (
          <button
            onClick={() => { setSearch(""); onFilter({ tourType: selected, duration: [999] }); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat, i) => (
          <motion.button
            key={cat.value}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.35 }}
            onClick={() => handleCategory(cat.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border",
              selected === cat.value
                ? "bg-[#0A1628] text-white border-[#0A1628] dark:bg-white dark:text-[#0A1628] dark:border-white shadow-sm"
                : "bg-background text-muted-foreground border-border hover:border-[#0A1628]/40 hover:text-foreground dark:hover:border-white/30"
            )}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
