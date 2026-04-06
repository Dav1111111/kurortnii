import { FAQ } from "@/components/faq";
import { FAQSchema } from "@/components/tour-schema";
import { faqs } from "@/data/faq-data";

export const metadata = {
  title: "Вопрос–Ответ об экскурсиях в Сочи",
  description: "Ответы на часто задаваемые вопросы об экскурсиях в Сочи: оплата, отмена, подготовка, трансфер и размер групп.",
  alternates: {
    canonical: "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/faq"
  }
};

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      <FAQSchema items={faqs} />

      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-[#0A1628] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-turquoise-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-coral-500/15 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-turquoise-400 rounded-full" />
            <span className="text-xs font-semibold uppercase tracking-widest text-turquoise-400">
              Поддержка
            </span>
          </div>
          <h1
            className="text-white font-extrabold mb-3 text-balance"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
          >
            Часто задаваемые{" "}
            <span className="text-gradient">вопросы</span>
          </h1>
          <p className="text-white/50 max-w-lg">
            Не нашли ответ? Напишите нам в WhatsApp — ответим за 5 минут.
          </p>
        </div>
      </section>

      <FAQ />
    </div>
  );
}
