"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMotionValueEvent, useScroll, motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/tours", label: "Экскурсии" },
  { href: "/about", label: "О нас" },
  { href: "/reviews", label: "Отзывы" },
  { href: "/faq", label: "FAQ" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-white/90 dark:bg-[#0A1628]/90 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.06]"
            : "bg-transparent"
        )}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href="/" className="relative block h-14 w-52 lg:h-16 lg:w-64 -ml-2">
                <Image
                  src="/logo-new.png"
                  alt="Южный Континент"
                  fill
                  className="object-contain object-left"
                />
              </Link>
            </motion.div>

            {/* Desktop nav */}
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex items-center gap-1"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 group",
                    activeLink === link.href
                      ? "text-turquoise-600 dark:text-turquoise-400"
                      : isScrolled
                        ? "text-[#0A1628]/70 dark:text-white/70 hover:text-[#0A1628] dark:hover:text-white"
                        : "text-white/80 hover:text-white"
                  )}
                  onClick={() => setActiveLink(link.href)}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute bottom-1 left-4 right-4 h-0.5 rounded-full bg-turquoise-400 scale-x-0 transition-transform duration-300 origin-left",
                      activeLink === link.href ? "scale-x-100" : "group-hover:scale-x-100"
                    )}
                  />
                </Link>
              ))}
            </motion.nav>

            {/* Desktop CTA */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex items-center gap-3"
            >
              <a
                href="tel:89891668631"
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  isScrolled
                    ? "text-[#0A1628]/60 dark:text-white/60 hover:text-[#0A1628] dark:hover:text-white"
                    : "text-white/70 hover:text-white"
                )}
              >
                <Phone className="h-3.5 w-3.5" />
                8 989 166-86-31
              </a>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #FF7F50 0%, #f05d29 100%)",
                    boxShadow: "0 4px 16px rgba(255,127,80,0.35)",
                  }}
                >
                  Контакты
                  <ChevronRight className="h-3.5 w-3.5" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Mobile burger */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="lg:hidden relative z-50 w-10 h-10 flex items-center justify-center rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Меню"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className={cn("h-5 w-5", isScrolled ? "text-[#0A1628] dark:text-white" : "text-white")} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className={cn("h-5 w-5", isScrolled ? "text-[#0A1628] dark:text-white" : "text-white")} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

          </div>
        </div>
      </header>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden fixed inset-0 z-40 bg-[#0A1628]"
          >
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-turquoise-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-coral-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col h-full pt-24 pb-10 px-8">
              {/* Nav links */}
              <nav className="flex-1 flex flex-col justify-center gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.35, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => { setMobileMenuOpen(false); setActiveLink(link.href); }}
                      className={cn(
                        "group flex items-center justify-between py-4 border-b border-white/10 transition-colors",
                        activeLink === link.href ? "text-turquoise-400" : "text-white/80 hover:text-white"
                      )}
                    >
                      <span className="text-3xl font-bold tracking-tight">{link.label}</span>
                      <ChevronRight className="h-5 w-5 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Bottom contacts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="space-y-4"
              >
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  <button
                    className="w-full py-4 rounded-2xl text-white font-semibold text-lg"
                    style={{ background: "linear-gradient(135deg, #FF7F50 0%, #f05d29 100%)" }}
                  >
                    Забронировать тур
                  </button>
                </Link>
                <div className="flex flex-col gap-2 pt-2">
                  <a
                    href="tel:89891668631"
                    className="flex items-center gap-3 text-white/60 hover:text-white transition-colors text-sm"
                  >
                    <Phone className="h-4 w-4 text-turquoise-400" />
                    Дианита: 8 989 166-86-31
                  </a>
                  <a
                    href="tel:89885007418"
                    className="flex items-center gap-3 text-white/60 hover:text-white transition-colors text-sm"
                  >
                    <Phone className="h-4 w-4 text-turquoise-400" />
                    Андрей: 8 988 500-74-18
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
