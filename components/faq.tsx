"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    id: "important-rules",
    question: "⚠️ Важные условия участия в экскурсиях",
    answer: "Обращаем ваше внимание на важные правила:\n\n• Экскурсия состоится в любую погоду\n• Возврат билета возможен не менее, чем за 1 сутки (24 часа) до начала экскурсии\n• В день проведения экскурсии билет возврату не подлежит\n• При опоздании на посадку стоимость билета не возвращается, перенос даты экскурсии не производится\n\nПожалуйста, учитывайте эти условия при планировании поездки!"
  },
  {
    id: "payment",
    question: "Какие способы оплаты вы принимаете?",
    answer: "Мы принимаем оплату банковскими картами (Visa, MasterCard, МИР), через СБП, а также наличными в офисе. При бронировании онлайн достаточно внести предоплату 20%, остальную сумму можно оплатить перед началом экскурсии."
  },
  {
    id: "cancellation",
    question: "Какие условия отмены бронирования?",
    answer: "Возврат билета возможен не менее, чем за 1 сутки (24 часа) до начала экскурсии с полным возвратом средств. В день проведения экскурсии билет возврату не подлежит."
  },
  {
    id: "language",
    question: "На каких языках проводятся экскурсии?",
    answer: "Все экскурсии проводятся на русском языке. Для иностранных туристов доступны индивидуальные экскурсии на английском, немецком и китайском языках (требуется предварительное бронирование)."
  },
  {
    id: "preparation",
    question: "Как подготовиться к экскурсии?",
    answer: "Рекомендуем надеть удобную одежду и обувь, взять головной убор, солнцезащитные средства и воду. Для горных маршрутов дополнительно нужна теплая одежда и непромокаемая куртка. Фото- и видеосъемка разрешены на всех экскурсиях без дополнительной платы."
  },
  {
    id: "pickup",
    question: "Откуда начинаются экскурсии?",
    answer: "Мы организуем бесплатный трансфер из любого отеля Большого Сочи. Время и место выезда согласовываются при бронировании. Индивидуальные экскурсии начинаются от вашего отеля."
  },
  {
    id: "group-size",
    question: "Какой размер групп на экскурсиях?",
    answer: "Размер групп варьируется в зависимости от типа экскурсии: обзорные туры - до 15 человек, горные маршруты - до 12 человек, гастрономические туры - до 8 человек. Также доступны индивидуальные экскурсии для вашей компании с персональным гидом."
  }
];

export function FAQ() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-turquoise-50 dark:from-background dark:to-turquoise-950/20">
      <div className="container">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border rounded-lg px-6 shadow-sm bg-white dark:bg-card"
              >
                <AccordionTrigger className="text-left text-lg py-6 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}