"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ReviewForm() {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, location, rating, comment }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Ошибка при отправке отзыва");
            }

            setIsSuccess(true);
            setName("");
            setLocation("");
            setRating(5);
            setComment("");

            // Скрыть сообщение об успехе через 5 секунд
            setTimeout(() => setIsSuccess(false), 5000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Произошла ошибка");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Оставить отзыв</CardTitle>
            </CardHeader>
            <CardContent>
                <AnimatePresence mode="wait">
                    {isSuccess ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center justify-center py-8 text-center"
                        >
                            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Спасибо за ваш отзыв!</h3>
                            <p className="text-muted-foreground">
                                Ваш отзыв отправлен на модерацию и скоро появится на сайте.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Ваше имя *</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Иван Иванов"
                                        required
                                        minLength={2}
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Город *</Label>
                                    <Input
                                        id="location"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Москва"
                                        required
                                        minLength={2}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Оценка *</Label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            className="p-1 transition-transform hover:scale-110"
                                            disabled={isSubmitting}
                                        >
                                            <Star
                                                className={`h-8 w-8 transition-colors ${star <= (hoveredRating || rating)
                                                        ? "text-amber-400 fill-amber-400"
                                                        : "text-gray-300"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="comment">Ваш отзыв *</Label>
                                <Textarea
                                    id="comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Расскажите о вашем опыте... (минимум 10 символов)"
                                    required
                                    minLength={10}
                                    rows={4}
                                    disabled={isSubmitting}
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-turquoise-500 hover:bg-turquoise-600"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                fill="none"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Отправка...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Send className="h-4 w-4" />
                                        Отправить отзыв
                                    </span>
                                )}
                            </Button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}
