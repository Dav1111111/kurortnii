"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuItem,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Menu, X, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMotionValueEvent, useScroll, motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 0);
  });

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      // Сбросить скролл меню в начало при открытии
      if (mobileMenuRef.current) {
        mobileMenuRef.current.scrollTop = 0;
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "bg-white/80 dark:bg-background/80 backdrop-blur-lg shadow-lg" 
          : "bg-transparent"
      )}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-8 -ml-4 sm:-ml-6"
          >
            <Link href="/" className="relative h-[70px] w-[280px] sm:h-[80px] sm:w-[340px] lg:h-[90px] lg:w-[400px]">
              <Image
                src="/logo-new.png"
                alt="Южный Континент"
                fill
                className="object-contain object-left"
                priority
              />
            </Link>

            <div className="hidden lg:flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-turquoise-500" />
                <span>Сочи, Россия</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-turquoise-500" />
                <a href="tel:89891668631" className="hover:text-foreground transition-colors" aria-label="Позвонить Дианита 8 989 166-86-31">
                  Дианита: 8 989 166-86-31
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-turquoise-500" />
                <a href="tel:89885007418" className="hover:text-foreground transition-colors" aria-label="Позвонить Андрей 8 988 500-74-18">
                  Андрей: 8 988 500-74-18
                </a>
              </div>
            </div>
          </motion.div>
          
          <div className="lg:hidden flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              className="relative z-50"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
          
          <div className="hidden lg:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:bg-turquoise-50 dark:hover:bg-turquoise-950/20"
                    )}>
                      Главная
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link href="/tours" legacyBehavior passHref>
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:bg-turquoise-50 dark:hover:bg-turquoise-950/20"
                    )}>
                      Экскурсии
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link href="/about" legacyBehavior passHref>
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:bg-turquoise-50 dark:hover:bg-turquoise-950/20"
                    )}>
                      О нас
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link href="/reviews" legacyBehavior passHref>
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:bg-turquoise-50 dark:hover:bg-turquoise-950/20"
                    )}>
                      Отзывы
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link href="/faq" legacyBehavior passHref>
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:bg-turquoise-50 dark:hover:bg-turquoise-950/20"
                    )}>
                      FAQ
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-3">
              <Link href="/contact">
                <Button className="bg-coral-500 hover:bg-coral-600">
                  Контакты
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
      
    {/* Mobile menu - вынесено за пределы header */}
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div 
          className="lg:hidden fixed inset-0 top-16 sm:top-18 lg:top-20 bg-background z-[60] flex flex-col"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div ref={mobileMenuRef} className="flex-1 overflow-y-auto p-6">
            <nav className="flex flex-col gap-4">
              <Link 
                href="/" 
                className="text-xl font-semibold py-2 border-b hover:text-turquoise-500 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Главная
              </Link>
              <Link 
                href="/tours" 
                className="text-xl font-semibold py-2 border-b hover:text-turquoise-500 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Экскурсии
              </Link>
              <Link 
                href="/about" 
                className="text-xl font-semibold py-2 border-b hover:text-turquoise-500 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                О нас
              </Link>
              <Link 
                href="/reviews" 
                className="text-xl font-semibold py-2 border-b hover:text-turquoise-500 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Отзывы
              </Link>
              <Link 
                href="/faq" 
                className="text-xl font-semibold py-2 border-b hover:text-turquoise-500 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
            </nav>
          </div>
          
          <div className="p-6 border-t bg-background/95 backdrop-blur-sm">
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-coral-500 hover:bg-coral-600 text-white">
                Контакты
              </Button>
            </Link>
            <div className="flex flex-col items-center gap-2 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-turquoise-500" />
                <span>Сочи, Россия</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-turquoise-500" />
                <a href="tel:89891668631" className="hover:text-foreground" aria-label="Позвонить Дианита 8 989 166-86-31">Дианита: 8 989 166-86-31</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-turquoise-500" />
                <a href="tel:89885007418" className="hover:text-foreground" aria-label="Позвонить Андрей 8 988 500-74-18">Андрей: 8 988 500-74-18</a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}