import { Testimonials } from "@/components/testimonials";

export default function ReviewsPage() {
  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-b from-turquoise-50 to-white dark:from-turquoise-950/20 dark:to-background">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Отзывы</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Узнайте, что говорят наши клиенты о путешествиях с нами
            </p>
          </div>
        </div>
      </section>
      
      <Testimonials />
    </div>
  );
}