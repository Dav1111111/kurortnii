"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import toursData from "@/data/tours.json";

const tourTypes = [
  { value: "all", label: "Все экскурсии" },
  { value: "city", label: "Городские экскурсии" },
  { value: "abkhazia", label: "Туры в Абхазию" },
  { value: "jeeping", label: "Джипинг туры" },
  { value: "nature", label: "Горы и водопады" },
  { value: "adventure", label: "Экстрим" },
  { value: "family", label: "Для всей семьи" },
] as const;

const formSchema = z.object({
  tourType: z.string({
    required_error: "Пожалуйста, выберите тип экскурсии",
  }),
  duration: z.array(z.number()).length(1),
});

type FilterValues = z.infer<typeof formSchema>;

interface TourFilterProps {
  onFilter: (values: FilterValues) => void;
  initialCategory?: string;
}

export function TourFilter({ onFilter, initialCategory = "all" }: TourFilterProps) {
  const allDurations = (toursData.tours.map(t => t.durationHours).filter(Boolean) as number[]);
  const minDuration = Math.max(1, Math.min(...allDurations));
  const maxDuration = Math.max(...allDurations, 1);
  const [duration, setDuration] = useState([maxDuration]);

  const form = useForm<FilterValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tourType: initialCategory,
      duration: [maxDuration],
    },
  });

  // Обновляем форму когда изменяется категория из URL
  useEffect(() => {
    form.setValue('tourType', initialCategory);
  }, [initialCategory, form]);

  function onSubmit(values: FilterValues) {
    onFilter(values);
    const element = document.getElementById("tours-list");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="bg-white dark:bg-card rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Поиск экскурсий</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <FormField
              control={form.control}
              name="tourType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип экскурсии</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип экскурсии" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tourTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Длительность (до, часов)</FormLabel>
                  <div className="flex items-center gap-4">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Slider
                      min={minDuration}
                      max={maxDuration}
                      step={1}
                      value={duration}
                      onValueChange={(value) => {
                        setDuration(value);
                        field.onChange(value);
                      }}
                      className="flex-1"
                    />
                    <span className="min-w-[3ch] text-right">{duration}</span>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-center">
            <Button 
              type="submit" 
              size="lg"
              className="bg-coral-500 hover:bg-coral-600 text-white px-8 h-11 sm:h-12 w-full sm:w-auto"
            >
              Найти
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}