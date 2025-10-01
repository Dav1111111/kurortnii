import { Hero } from "@/components/hero";
import { Categories } from "@/components/categories";
import { WhyUs } from "@/components/why-us";
import { AboutSection } from "@/components/about-section";
import { Testimonials } from "@/components/testimonials";
import { FAQ } from "@/components/faq";
import { BookingForm } from "@/components/booking-form";
import { WeatherWidget } from "@/components/weather-widget";

export default function Home() {
  return (
    <>
      <Hero />
      
      <Categories />
      
      <WhyUs />
      
      <AboutSection />
      
      {/* Additional section with weather widget */}
      <section className="py-16 bg-white dark:bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">Погода и климат Сочи</h2>
              <p className="text-lg mb-4">
                Сочи славится своим мягким субтропическим климатом. Лето здесь тёплое, а зима мягкая. 
                Благодаря защите Кавказских гор с севера, в Сочи формируется уникальный микроклимат, 
                позволяющий наслаждаться отдыхом практически круглый год.
              </p>
              <p className="text-lg mb-4">
                Летние месяцы (июнь-август) характеризуются стабильно тёплой и солнечной погодой с средней 
                температурой воздуха +26...+28°C и температурой воды в море +24...+26°C. 
                Это идеальное время для пляжного отдыха и водных видов спорта.
              </p>
              <p className="text-lg">
                Бархатный сезон (сентябрь-октябрь) отличается комфортной температурой воздуха +22...+25°C и 
                тёплым морем +22...+23°C при меньшем количестве отдыхающих, что делает его особенно привлекательным 
                для тех, кто предпочитает спокойный отдых.
              </p>
            </div>
            <div className="lg:col-span-1">
              <WeatherWidget />
            </div>
          </div>
        </div>
      </section>
      
      <FAQ />
      
      <Testimonials />
      
      <BookingForm />
    </>
  );
}