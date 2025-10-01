import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";

interface TourChecklistProps {
  included: string[];
  excluded: string[];
}

export function TourChecklist({ included, excluded }: TourChecklistProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Что включено в тур</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-green-600 dark:text-green-500 mb-3 flex items-center gap-2">
              <Check className="h-5 w-5" />
              Включено в стоимость:
            </h4>
            <ul className="space-y-2">
              {included.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-red-600 dark:text-red-500 mb-3 flex items-center gap-2">
              <X className="h-5 w-5" />
              Не включено в стоимость:
            </h4>
            <ul className="space-y-2">
              {excluded.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <X className="h-4 w-4 text-red-600 dark:text-red-500 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}