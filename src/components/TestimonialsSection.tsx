const testimonials = [
  {
    quote:
      "We've watched our highlight film over a hundred times. Every frame feels like a painting — they captured emotions we didn't even know were on camera. Absolutely stunning work.",
    name: "Sophia & Marcus",
    role: "Couple · Married in Napa Valley, CA",
    type: "couple",
  },
  {
    quote:
      "I've partnered with many editing studios over the years. Ginger Beer is in a different league — fast, communicative, and they truly understand cinematic storytelling. My clients are always blown away.",
    name: "Jordan Lewis",
    role: "Videographer · Lewis Films, NYC",
    type: "videographer",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="section-cream-deep py-28 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <p className="text-label uppercase tracking-[0.2em] text-muted-foreground font-sans text-[10px] mb-4">
            Testimonials
          </p>
          <h2 className="font-serif text-display-lg text-foreground font-light">
            Kind Words
          </h2>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="bg-card p-10 md:p-16 reveal"
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              {/* Quotation mark */}
              <div className="font-serif text-[80px] leading-none text-brand-sand select-none mb-2" aria-hidden="true">
                "
              </div>

              <blockquote className="font-serif text-xl md:text-2xl text-foreground font-light leading-relaxed mb-10 italic">
                {t.quote}
              </blockquote>

              <div className="divider mb-8" />

              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-sans text-[11px] font-medium uppercase ${
                    t.type === "couple"
                      ? "bg-brand-sand text-foreground"
                      : "bg-foreground text-brand-cream"
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
