import Link from "next/link";
import { ChevronRight, MapPin, Phone } from "lucide-react";

export const metadata = {
  title: "Страница не найдена",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <p className="text-turquoise-400 font-semibold text-sm uppercase tracking-widest mb-4">
          Ошибка 404
        </p>
        <h1
          className="font-extrabold text-white mb-4"
          style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", letterSpacing: "-0.04em", lineHeight: 1 }}
        >
          Страница<br />не найдена
        </h1>
        <p className="text-white/50 mb-10 text-lg">
          Возможно, экскурсия уже завершилась или ссылка устарела.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/tours"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white text-base transition-all"
            style={{ background: "linear-gradient(135deg, #FF7F50 0%, #f05d29 100%)", boxShadow: "0 6px 28px rgba(255,127,80,0.4)" }}
          >
            Смотреть экскурсии
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white text-base border border-white/20 hover:border-white/50 transition-all"
          >
            На главную
          </Link>
        </div>
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center text-white/40 text-sm">
          <a href="tel:89891668631" className="flex items-center gap-2 hover:text-white transition-colors">
            <Phone className="h-3.5 w-3.5" />
            8 989 166-86-31
          </a>
          <span className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" />
            Сочи, Курортный пр. 47
          </span>
        </div>
      </div>
    </div>
  );
}
