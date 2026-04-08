"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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

// WhatsApp SVG icon
function WhatsAppIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 40);
  });

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-white/96 dark:bg-[#0A1628]/96 backdrop-blur-xl shadow-sm border-b border-black/[0.06] dark:border-white/[0.06]"
            : "bg-[#0A1628]/55 backdrop-blur-md border-b border-white/10"
        )}
      >
        <div className="container">
          <div className="flex items-center justify-between overflow-hidden" style={{ height: isScrolled ? "4.5rem" : "5rem" }}>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href="/" className="relative block -ml-2" style={{ width: "clamp(21.6rem, 66vw, 26.4rem)", height: "6.6rem" }}>
                <Image
                  src="/logo-new.webp"
                  alt="Южный Континент"
                  width={512}
                  height={512}
                  priority
                  className="h-full w-auto object-contain object-left"
                  style={{ filter: isScrolled ? "none" : "brightness(0) invert(1)" }}
                />
              </Link>
            </motion.div>

            {/* Desktop nav */}
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex items-center gap-0.5"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-[0.9rem] font-semibold rounded-lg transition-colors duration-200 group",
                    pathname === link.href
                      ? isScrolled
                        ? "text-turquoise-600 dark:text-turquoise-400"
                        : "text-turquoise-300"
                      : isScrolled
                        ? "text-[#0A1628]/75 dark:text-white/75 hover:text-[#0A1628] dark:hover:text-white"
                        : "text-white/90 hover:text-white"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute bottom-1 left-4 right-4 h-0.5 rounded-full bg-turquoise-400 scale-x-0 transition-transform duration-300 origin-left",
                      pathname === link.href ? "scale-x-100" : "group-hover:scale-x-100"
                    )}
                  />
                </Link>
              ))}
            </motion.nav>

            {/* Desktop right: phone + WhatsApp icon + CTA */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex items-center gap-4"
            >
              {/* Phone */}
              <a
                href="tel:89891668631"
                className={cn(
                  "flex items-center gap-2 text-sm font-semibold transition-colors",
                  isScrolled
                    ? "text-[#0A1628]/70 dark:text-white/70 hover:text-[#0A1628] dark:hover:text-white"
                    : "text-white/80 hover:text-white"
                )}
              >
                <Phone className="h-3.5 w-3.5" />
                8 989 166-86-31
              </a>

              {/* WhatsApp icon */}
              <a
                href="https://wa.me/79891668631"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Написать в WhatsApp"
                className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-full transition-all",
                  isScrolled
                    ? "bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366]"
                    : "bg-white/15 hover:bg-[#25D366]/80 text-white hover:text-white"
                )}
              >
                <WhatsAppIcon className="h-4.5 w-4.5" style={{ width: "1.1rem", height: "1.1rem" }} />
              </a>

              {/* CTA */}
              <motion.div whileTap={{ scale: 0.97 }}>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all duration-300 hover:shadow-[0_6px_24px_rgba(255,127,80,0.55)]"
                  style={{
                    background: "linear-gradient(135deg, #FF7F50 0%, #f05d29 100%)",
                    boxShadow: "0 4px 16px rgba(255,127,80,0.4)",
                  }}
                >
                  Бронировать
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Mobile right: WhatsApp icon + burger */}
            <div className="lg:hidden flex items-center gap-2">
              <a
                href="https://wa.me/79891668631"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex items-center justify-center w-11 h-11 rounded-full bg-[#25D366]/20 text-[#25D366]"
              >
                <WhatsAppIcon style={{ width: "1.1rem", height: "1.1rem" }} />
              </a>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="relative z-50 w-11 h-11 flex items-center justify-center rounded-full transition-colors"
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
                      <X className="h-5 w-5 text-white" />
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
            <div className="absolute top-0 right-0 w-80 h-80 bg-turquoise-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-coral-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col h-full pt-24 pb-10 px-8">
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
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "group flex items-center justify-between py-4 border-b border-white/10 transition-colors",
                        pathname === link.href ? "text-turquoise-400" : "text-white/80 hover:text-white"
                      )}
                    >
                      <span className="text-3xl font-bold tracking-tight">{link.label}</span>
                      <ChevronRight className="h-5 w-5 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="space-y-4"
              >
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  <button
                    className="w-full py-4 rounded-2xl text-white font-bold text-lg"
                    style={{ background: "linear-gradient(135deg, #FF7F50 0%, #f05d29 100%)" }}
                  >
                    Забронировать тур
                  </button>
                </Link>
                <div className="flex flex-col gap-2 pt-2">
                  <a href="tel:89891668631" className="flex items-center gap-3 text-white/60 hover:text-white transition-colors text-sm">
                    <Phone className="h-4 w-4 text-turquoise-400" />
                    Дианита: 8 989 166-86-31
                  </a>
                  <a href="tel:89885007418" className="flex items-center gap-3 text-white/60 hover:text-white transition-colors text-sm">
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
