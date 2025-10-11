"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageGalleryProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export function ImageGallery({ images, isOpen, onClose, initialIndex = 0 }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0 bg-black/95 border-none">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 z-40 text-white hover:bg-white/20 rounded-full h-12 w-12"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 z-40 text-white hover:bg-white/20 rounded-full h-12 w-12"
                onClick={goToNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* Main image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full flex items-center justify-center px-4"
            >
              <div className="relative w-full h-full max-h-[calc(90vh-120px)]">
                <Image
                  src={images[currentIndex]}
                  alt={`Фото ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  quality={95}
                  priority
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Counter and thumbnails */}
          <div className="absolute bottom-6 left-0 right-0 z-40">
            {/* Counter */}
            <div className="text-center mb-4">
              <span className="text-white text-lg font-medium bg-black/60 px-4 py-2 rounded-full">
                {currentIndex + 1} / {images.length}
              </span>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 justify-center overflow-x-auto px-4 pb-2 scrollbar-thin scrollbar-thumb-white/30">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative flex-shrink-0 h-16 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? "border-coral-500 scale-110"
                      : "border-white/30 hover:border-white/60"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Миниатюра ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
