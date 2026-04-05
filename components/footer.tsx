import Link from "next/link";
import { Phone, MapPin, Clock, MessageSquare, Instagram, Send } from "lucide-react";

const tourLinks = [
  { href: "/tours?category=city", label: "Городские экскурсии" },
  { href: "/tours?category=abkhazia", label: "Туры в Абхазию" },
  { href: "/tours?category=jeeping", label: "Джипинг туры" },
  { href: "/tours?category=nature", label: "Горы и водопады" },
  { href: "/tours?category=family", label: "Для всей семьи" },
];

const companyLinks = [
  { href: "/about", label: "О компании" },
  { href: "/reviews", label: "Отзывы" },
  { href: "/faq", label: "Вопрос–Ответ" },
  { href: "/contact", label: "Контакты" },
  { href: "/privacy", label: "Политика конфиденциальности" },
  { href: "/terms", label: "Условия использования" },
];

export function Footer() {
  return (
    <footer className="bg-[#0A1628] text-white relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-turquoise-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-coral-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10">
        {/* Top: brand marquee */}
        <div className="py-12 border-b border-white/10 overflow-hidden">
          <div className="marquee-track select-none" aria-hidden="true">
            {["Экскурсии в Сочи", "·", "Абхазия", "·", "Красная Поляна", "·", "Джипинг", "·", "Морские прогулки", "·",
              "Экскурсии в Сочи", "·", "Абхазия", "·", "Красная Поляна", "·", "Джипинг", "·", "Морские прогулки", "·"].map(
              (item, i) => (
                <span
                  key={i}
                  className={item === "·" ? "text-turquoise-500 text-2xl font-bold" : "text-2xl font-bold text-white/20 whitespace-nowrap"}
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">

          {/* Brand */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <p className="text-2xl font-bold tracking-tight">Южный Континент</p>
              <p className="text-white/40 text-sm mt-1">Экскурсионное бюро, Сочи</p>
            </div>
            <p className="text-white/55 text-sm leading-relaxed">
              Авторские экскурсии по Сочи, Абхазии и Красной Поляне с профессиональными гидами с 2014 года.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              <a
                href="https://wa.me/79891668631"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:border-turquoise-400 hover:text-turquoise-400 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:border-coral-400 hover:text-coral-400 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Telegram"
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:border-turquoise-400 hover:text-turquoise-400 transition-colors"
              >
                <Send className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Tours */}
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30">Экскурсии</p>
            <ul className="space-y-3">
              {tourLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 hover:text-white transition-colors link-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30">Компания</p>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 hover:text-white transition-colors link-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30">Контакты</p>
            <ul className="space-y-4">
              <li>
                <a href="tel:89891668631" className="group flex items-start gap-3">
                  <Phone className="h-4 w-4 text-turquoise-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-white/30 mb-0.5">Дианита</p>
                    <p className="text-sm text-white/70 group-hover:text-white transition-colors">8 989 166-86-31</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="tel:89885007418" className="group flex items-start gap-3">
                  <Phone className="h-4 w-4 text-turquoise-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-white/30 mb-0.5">Андрей</p>
                    <p className="text-sm text-white/70 group-hover:text-white transition-colors">8 988 500-74-18</p>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-turquoise-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-white/55">Курортный проспект 47,<br />Сочи, Россия</p>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-turquoise-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-white/55">
                  <p>Пн–Пт: 9:00 — 20:00</p>
                  <p>Сб–Вс: 10:00 — 18:00</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="py-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-white/40 text-sm">
              Есть вопросы? Напишите нам в WhatsApp — ответим быстро.
            </p>
            <a
              href="https://wa.me/79891668631"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
            >
              <MessageSquare className="h-4 w-4" />
              Написать в WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/25">
          <p>© 2026 Южный Континент. Все права защищены.</p>
          <p>Сочи, Краснодарский край, Россия</p>
        </div>
      </div>
    </footer>
  );
}
