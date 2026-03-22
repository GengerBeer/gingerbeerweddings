import { useEffect, useRef } from "react";

const plans = [
  {
    name: "Teaser Film",
    price: "Starting from $499",
    features: ["60–90 sec cinematic edit", "Licensed music selection", "1 revision included", "7–14 day delivery"],
    highlight: false,
    cta: "Get Started",
  },
  {
    name: "Highlight Film",
    price: "Starting from $1,299",
    features: ["4–8 min story-driven edit", "Advanced color grading", "2 revisions included", "3–4 week delivery"],
    highlight: true,
    badge: "Most Popular",
    cta: "Get Started",
  },
  {
    name: "Full Wedding Film",
    price: "Custom Quote",
    features: ["Multi-camera edit", "Ceremony + speeches", "Structured timeline", "Dedicated review process"],
    highlight: false,
    cta: "Request Quote",
  },
];

export default function InvestmentSection() {
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
    <section id="investment" ref={sectionRef} className="section-cream py-28 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="mb-12 md:mb-16 reveal">
          <p className="text-label uppercase tracking-[0.25em] text-muted-foreground font-sans text-[10px] mb-4">
            Pricing
          </p>
          <h2 className="font-serif text-display-lg text-foreground font-extrabold mb-4">
            Investment
          </h2>
          <p className="font-sans text-muted-foreground text-base max-w-md">
            Transparent pricing tailored to your project.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`price-card relative flex flex-col p-10 reveal ${plan.highlight
                ? "price-card-highlight"
                : "bg-card border border-border"
                }`}
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              {plan.badge && (
                <span className="absolute top-5 right-5 font-sans text-[9px] uppercase tracking-widest bg-brand-sand text-brand-dark px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}

              <p className={`font-sans text-[10px] uppercase tracking-[0.2em] mb-6 ${plan.highlight ? "text-brand-sand" : "text-muted-foreground"}`}>
                0{i + 1}
              </p>

              <h3 className={`font-serif text-display-sm font-extrabold mb-3 ${plan.highlight ? "text-brand-cream" : "text-foreground"}`}>
                {plan.name}
              </h3>

              <p className={`font-sans text-lg font-semibold mb-8 ${plan.highlight ? "text-brand-sand" : "text-brand-teal"}`}>
                {plan.price}
              </p>

              <div className={`h-px mb-8 ${plan.highlight ? "bg-white/10" : "bg-border"}`} />

              <ul className="space-y-4 flex-1 mb-10">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${plan.highlight ? "bg-brand-sand" : "bg-brand-teal"}`} />
                    <span className={`font-sans text-sm leading-relaxed ${plan.highlight ? "text-brand-cream/80" : "text-muted-foreground"}`}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`inline-flex items-center justify-center font-sans text-[11px] uppercase tracking-widest rounded-full px-6 py-3.5 transition-all duration-300 font-medium border ${plan.highlight
                  ? "border-brand-sand text-brand-sand hover:bg-brand-sand hover:text-brand-dark"
                  : "border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-brand-cream"
                  }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="font-sans text-muted-foreground text-sm mt-10 text-center italic">
          Custom rates available for videographers and long-term collaborations.
        </p>
      </div>
    </section>
  );
}
