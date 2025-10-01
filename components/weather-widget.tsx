"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets } from "lucide-react";

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulation of weather API fetch
    const fetchWeather = async () => {
      try {
        // This is a mock response - in a real app, you'd fetch from a weather API
        setTimeout(() => {
          setWeather({
            temperature: 27,
            description: "Солнечно",
            humidity: 65,
            windSpeed: 4,
            icon: "sun"
          });
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setLoading(false);
      }
    };
    
    fetchWeather();
  }, []);
  
  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case "sun":
        return <Sun className="h-10 w-10 text-amber-400" />;
      case "cloud":
        return <Cloud className="h-10 w-10 text-gray-400" />;
      case "rain":
        return <CloudRain className="h-10 w-10 text-blue-400" />;
      case "snow":
        return <CloudSnow className="h-10 w-10 text-blue-200" />;
      default:
        return <Sun className="h-10 w-10 text-amber-400" />;
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-turquoise-400 to-turquoise-500 text-white">
        <CardTitle className="text-xl">Погода в Сочи</CardTitle>
        <CardDescription className="text-turquoise-50">Текущие погодные условия</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-12 w-24" />
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-4xl font-bold">{weather?.temperature}°C</span>
                <p className="text-muted-foreground">{weather?.description}</p>
              </div>
              {weather && getWeatherIcon(weather.icon)}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Влажность</p>
                  <p className="font-medium">{weather?.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Ветер</p>
                  <p className="font-medium">{weather?.windSpeed} м/с</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}