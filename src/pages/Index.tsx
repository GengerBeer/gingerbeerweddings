import { useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import PortfolioSection from "@/components/PortfolioSection";
import ServicesSection from "@/components/ServicesSection";
import InvestmentSection from "@/components/InvestmentSection";
import ProcessSection from "@/components/ProcessSection";
// import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhyOutsourceSection from "@/components/WhyOutsourceSection";
import AboutSection from "@/components/AboutSection";


function useRevealOnScroll() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

const Index = () => {
  useRevealOnScroll();

  return (
    <main>
      <Navigation />
      <HeroSection />
      <PortfolioSection />
      <ServicesSection />
      <WhyOutsourceSection />
      <AboutSection />
      <InvestmentSection />
      <ProcessSection />
      {/* <TestimonialsSection /> */}
      <FAQSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
