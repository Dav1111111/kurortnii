import React from "react";
import Link from "next/link";
import { Phone, MapPin, Clock, Send } from "lucide-react";

function WhatsAppIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

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
                className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:border-turquoise-400 hover:text-turquoise-400 transition-colors"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
              <a
                href="https://t.me/yug_kontinent"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:border-turquoise-400 hover:text-turquoise-400 transition-colors"
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
              <WhatsAppIcon className="h-4 w-4" />
              Написать в WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/25">
          <p>© {new Date().getFullYear()} Южный Континент. Все права защищены.</p>
          <p>Сочи, Краснодарский край, Россия</p>
        </div>
      </div>
    </footer>
  );
}
