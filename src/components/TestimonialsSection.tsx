import { useEffect, useRef } from "react";

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

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`relative bg-card rounded-2xl p-10 md:p-14 overflow-hidden reveal border border-border`}
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
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-sans text-[11px] font-semibold uppercase ${t.type === "couple"
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
      </div>
    </section>
  );
}
