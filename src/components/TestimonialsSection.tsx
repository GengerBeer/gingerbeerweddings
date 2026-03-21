import { useEffect, useRef, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    quote: "We've watched our highlight film over a hundred times. Every frame feels like a painting — they captured emotions we didn't even know were on camera. Absolutely stunning work.",
    name: "Sophia & Marcus",
    role: "Couple · Married in Napa Valley, CA",
    type: "couple",
  },
  {
    quote: "I've partnered with many editing studios over the years. Ginger Beer is in a different league — fast, communicative, and they truly understand cinematic storytelling. My clients are always blown away.",
    name: "Jordan Lewis",
    role: "Videographer · Lewis Films, NYC",
    type: "videographer",
  },
];

function Stars() {
  return (
    <div className="flex gap-1 mb-6">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M7 1l1.545 3.13L12 4.635l-2.5 2.435.59 3.437L7 8.885l-3.09 1.622.59-3.437L2 4.635l3.455-.505L7 1z"
            fill="#FCE6CA"
          />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true,
    breakpoints: {
      "(min-width: 1024px)": { active: false }, // Disable carousel on lg screens and up
    },
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="testimonials" ref={sectionRef} className="section-cream-deep py-28 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="mb-12 md:mb-16 reveal">
          <p className="text-label uppercase tracking-[0.25em] text-muted-foreground font-sans text-[10px] mb-4">
            Testimonials
          </p>
          <h2 className="font-serif text-display-lg text-foreground font-extrabold">
            Kind Words
          </h2>
        </div>

        {/* Cards - Carousel on Mobile/Tablet, Grid on Desktop */}
        <div className="overflow-hidden lg:overflow-visible reveal mx-[calc(-50vw+50%)] px-[calc(50vw-50%+1.5rem)] md:px-[calc(50vw-50%+3rem)] lg:mx-0 lg:px-0" ref={emblaRef}>
          <div className="flex lg:grid lg:grid-cols-2 gap-4 md:gap-6 ease-out">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className={`relative bg-card rounded-2xl p-8 md:p-14 overflow-hidden border border-border flex-[0_0_82vw] md:flex-[0_0_75vw] lg:flex-[1_1_0%] min-w-0`}
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                {/* Decorative large quote mark */}
                <div
                  className="absolute top-4 right-6 font-script select-none pointer-events-none"
                  style={{ fontSize: "120px", lineHeight: 1, color: "hsl(34 89% 89% / 0.25)" }}
                  aria-hidden="true"
                >
                  "
                </div>

                <Stars />

                <blockquote className="font-serif text-xl md:text-2xl text-foreground font-extrabold leading-relaxed mb-10 italic relative z-10">
                  {t.quote}
                </blockquote>

                <div className="divider mb-8" />

                <div className="flex items-center gap-4">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-sans text-[11px] font-semibold uppercase shrink-0 ${t.type === "couple"
                      ? "bg-brand-sand text-brand-dark"
                      : "bg-brand-dark text-brand-cream"
                      }`}
                  >
                    {t.name.split(" ")[0][0]}
                    {t.type === "couple" ? t.name.split("& ")[1]?.[0] : t.name.split(" ")[1]?.[0]}
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium text-foreground">{t.name}</p>
                    <p className="font-sans text-[11px] text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Navigation (Hidden on large screens) */}
          <div className="flex lg:hidden items-center justify-between mt-8">
            <div className="flex gap-2">
              <button
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border border-brand-dark/20 hover:border-brand-dark/40 ${!prevBtnEnabled ? "opacity-30 cursor-not-allowed" : "text-brand-dark"}`}
                onClick={scrollPrev}
                disabled={!prevBtnEnabled}
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border border-brand-dark/20 hover:border-brand-dark/40 ${!nextBtnEnabled ? "opacity-30 cursor-not-allowed" : "text-brand-dark"}`}
                onClick={scrollNext}
                disabled={!nextBtnEnabled}
                aria-label="Next testimonial"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="flex gap-2">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === selectedIndex ? "bg-brand-dark w-5" : "bg-brand-dark/20 hover:bg-brand-dark/40"}`}
                  onClick={() => scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
