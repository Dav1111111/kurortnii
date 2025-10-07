import { Hero } from "@/components/hero";
import { Categories } from "@/components/categories";
import { WhyUs } from "@/components/why-us";
import { AboutSection } from "@/components/about-section";
import { Testimonials } from "@/components/testimonials";
import { FAQ } from "@/components/faq";
import { BookingForm } from "@/components/booking-form";

export default function Home() {
  return (
    <>
      <Hero />
      
      <Categories />
      
      <WhyUs />
      
      <AboutSection />
      
      <FAQ />
      
      <Testimonials />
      
      <BookingForm />
    </>
  );
}