import { FAQ } from "@/components/faq";
import { FAQSchema } from "@/components/tour-schema";

const faqItems = [
  {
    question: "Важные условия участия в экскурсиях",
    answer: "Экскурсия состоится в любую погоду. Возврат билета возможен не менее чем за 1 сутки (24 часа) до начала экскурсии. В день проведения экскурсии билет возврату не подлежит. При опоздании на посадку стоимость билета не возвращается, перенос даты экскурсии не производится."
  },
  {
    question: "Какие способы оплаты вы принимаете?",
    answer: "Мы принимаем оплату банковскими картами (Visa, MasterCard, МИР), через СБП, а также наличными в офисе. При бронировании онлайн достаточно внести предоплату 20%, остальную сумму можно оплатить перед началом экскурсии."
  },
  {
    question: "Какие условия отмены бронирования?",
    answer: "Возврат билета возможен не менее чем за 1 сутки (24 часа) до начала экскурсии с полным возвратом средств. В день проведения экскурсии билет возврату не подлежит."
  },
  {
    question: "На каких языках проводятся экскурсии?",
    answer: "Все экскурсии проводятся на русском языке. Для иностранных туристов доступны индивидуальные экскурсии на английском, немецком и китайском языках (требуется предварительное бронирование)."
  },
  {
    question: "Как подготовиться к экскурсии?",
    answer: "Рекомендуем надеть удобную одежду и обувь, взять головной убор, солнцезащитные средства и воду. Для горных маршрутов дополнительно нужна теплая одежда и непромокаемая куртка. Фото- и видеосъемка разрешены на всех экскурсиях без дополнительной платы."
  },
  {
    question: "Откуда начинаются экскурсии?",
    answer: "Мы организуем бесплатный трансфер из любого отеля Большого Сочи. Время и место выезда согласовываются при бронировании. Индивидуальные экскурсии начинаются от вашего отеля."
  },
  {
    question: "Какой размер групп на экскурсиях?",
    answer: "Размер групп варьируется в зависимости от типа экскурсии: обзорные туры — до 50 человек, джип-туры — 8–10 человек, VIP-экскурсии — до 6 человек. Также доступны индивидуальные экскурсии для вашей компании с персональным гидом."
  }
];

export const metadata = {
  title: "Вопрос–Ответ | Южный Континент",
  description: "Ответы на часто задаваемые вопросы об экскурсиях в Сочи: оплата, отмена, подготовка, трансфер и размер групп.",
  alternates: {
    canonical: "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/faq"
  }
};

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      <FAQSchema items={faqItems} />

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
