import { Hero } from "@/components/hero";
import { Categories } from "@/components/categories";
import { HotOffers } from "@/components/hot-offers";
import { WhyUs } from "@/components/why-us";
import { AboutSection } from "@/components/about-section";
import { Testimonials } from "@/components/testimonials";
import { FAQ } from "@/components/faq";
import { BookingForm } from "@/components/booking-form";
import { FAQSchema } from "@/components/tour-schema";
import { faqs } from "@/data/faq-data";

export default function Home() {
  return (
    <>
      <FAQSchema items={faqs} />
      <Hero />

      <Categories />

      <HotOffers />

      <WhyUs />
      
      <AboutSection />
      
      <FAQ />
      
      <Testimonials />
      
      <BookingForm />
    </>
  );
}