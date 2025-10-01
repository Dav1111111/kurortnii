import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface ScheduleItem {
  time: string;
  title: string;
  description: string;
}

interface TourScheduleProps {
  schedule: ScheduleItem[];
}

export function TourSchedule({ schedule }: TourScheduleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Расписание тура
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {schedule.map((item, index) => (
            <div key={index} className="relative pl-8 pb-6 last:pb-0">
              <div className="absolute left-0 top-0 w-px h-full bg-border">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-muted-foreground mb-1">
                  {item.time}
                </p>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}