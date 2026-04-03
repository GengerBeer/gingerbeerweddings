import { useEffect, useRef } from "react";

const bundles = [
  {
    name: "Teaser + Highlight",
    price: "$620",
    oldPrice: "$720",
    badge: "Save $100",
    tagline: "60–90 sec teaser + 4–8 min highlight",
    features: [
      "Advanced color grading",
      "Licensed music",
      "2 revisions included",
      "14-day delivery",
    ],
    highlight: false,
  },
  {
    name: "Complete Package",
    price: "$1,200",
    oldPrice: "$1,370",
    badge: "Save $170",
    tagline: "Teaser + Highlight + Full Wedding Film",
    features: [
      "Multi-camera edit, full day coverage",
      "Advanced color grading",
      "2 revisions included",
      "14-day delivery",
    ],
    highlight: true,
  },
];

const individuals = [
  {
    num: "01",
    name: "Teaser",
    price: "from $175",
    star: false,
    features: [
      "60–90 sec cinematic edit",
      "Licensed music",
      "Horizontal, vertical, or both ($240)",
      "14-day delivery",
    ],
  },
  {
    num: "02",
    name: "Highlight Film",
    price: "from $545",
    star: true,
    features: [
      "4–8 min story-driven edit",
      "Advanced color grading",
      "2 revisions included",
      "14-day delivery",
    ],
  },
  {
    num: "03",
    name: "Full Wedding Film",
    price: "from $650",
    star: false,
    features: [
      "Multi-camera edit",
      "Ceremony + speeches + reception",
      "Structured timeline",
      "Dedicated review process",
    ],
  },
];

export default function InvestmentSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    sectionRef.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="investment" ref={sectionRef} className="section-cream py-28 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="mb-16 md:mb-20 reveal">
          <h2 className="font-serif text-display-lg text-foreground font-extrabold mb-4">
            Pricing
          </h2>
          <p className="font-sans text-muted-foreground text-base max-w-md">
            No hidden fees. No "it depends." Just the numbers.
          </p>
        </div>

        {/* ── Bundles (top, full-width 2-col) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {bundles.map((b, i) => (
            <div
              key={b.name}
              className={`price-card relative flex flex-col p-10 md:p-14 reveal ${b.highlight ? "price-card-highlight" : "bg-card border border-border"}`}
              style={{ transitionDelay: `${i * 0.12}s` }}
            >

              <div className="flex items-center justify-between mb-4">
                <p className={`font-sans text-[10px] uppercase tracking-[0.2em] ${b.highlight ? "text-brand-sand" : "text-muted-foreground"}`}>
                  Bundle
                </p>
                {b.badge && (
                  <span className={`font-sans text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full ${b.highlight ? "bg-brand-sand/20 text-brand-sand" : "bg-brand-sand text-brand-dark"}`}>
                    {b.badge}
                  </span>
                )}
              </div>
              <h3 className={`font-serif text-display-sm font-extrabold mb-3 ${b.highlight ? "text-brand-cream" : "text-foreground"}`}>
                {b.name}
              </h3>
              <p className={`font-sans text-sm mb-6 ${b.highlight ? "text-brand-cream/60" : "text-muted-foreground"}`}>
                {b.tagline}
              </p>

              <div className="flex items-baseline gap-2 mb-8">
                <p className={`font-sans text-3xl font-bold ${b.highlight ? "text-brand-sand" : "text-brand-teal"}`}>
                  {b.price}
                </p>
                <span className={`font-sans text-sm line-through ${b.highlight ? "text-brand-cream/40" : "text-muted-foreground/60"}`}>
                  {b.oldPrice}
                </span>
              </div>

              <div className={`h-px mb-8 ${b.highlight ? "bg-white/10" : "bg-border"}`} />

              <ul className="space-y-3 flex-1 mb-10">
                {b.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${b.highlight ? "bg-brand-sand" : "bg-brand-teal"}`} />
                    <span className={`font-sans text-sm leading-relaxed ${b.highlight ? "text-brand-cream/80" : "text-muted-foreground"}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`inline-flex items-center justify-center font-sans text-[11px] uppercase tracking-widest rounded-full px-6 py-3.5 transition-all duration-300 font-medium border ${b.highlight ? "border-brand-sand text-brand-sand hover:bg-brand-sand hover:text-brand-dark" : "border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-brand-cream"}`}
              >
                Get Started
              </a>
            </div>
          ))}
        </div>

        {/* Divider with label */}
        <div className="flex items-center gap-4 my-12 md:my-16 reveal">
          <div className="flex-1 h-px bg-border" />
          <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70 whitespace-nowrap">
            Individual Services
          </p>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* ── Individual tiers (bottom, 3-col) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {individuals.map((p, i) => (
            <div
              key={p.name}
              className="price-card relative flex flex-col p-8 bg-card border border-border reveal"
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <p className="font-sans text-[10px] uppercase tracking-[0.2em] mb-4 text-muted-foreground">
                {p.num}
              </p>
              {p.star && (
                <span className="absolute top-8 right-8 text-brand-sand text-base leading-none">
                  ★
                </span>
              )}
              <h3 className="font-serif text-display-sm font-extrabold mb-2 text-foreground">
                {p.name}
              </h3>
              <p className="font-sans text-lg font-semibold text-brand-teal mb-6">
                {p.price}
              </p>

              <div className="h-px bg-border mb-6" />

              <ul className="space-y-3 flex-1 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-brand-teal" />
                    <span className="font-sans text-sm leading-relaxed text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="inline-flex items-center justify-center font-sans text-[11px] uppercase tracking-widest rounded-full px-6 py-3 transition-all duration-300 font-medium border border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-brand-cream"
              >
                Get Started
              </a>
            </div>
          ))}
        </div>

        {/* Footer notes */}
        <div className="mt-14 flex flex-col md:flex-row gap-0 divide-y md:divide-y-0 md:divide-x divide-border/50 reveal">
          {/* Always Included */}
          <div className="flex-1 py-6 md:pr-8">
            <p className="font-serif text-[11px] font-bold text-foreground mb-3 uppercase tracking-widest">
              Always Included
            </p>
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {["Color grading", "Licensed music (MusicBed / Artlist)", "AI audio cleanup", "DaVinci Resolve project files on request", "XML export available"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 font-sans text-sm text-muted-foreground whitespace-nowrap">
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Rush Options */}
          <div className="flex-1 py-6 md:pl-8">
            <p className="font-serif text-[11px] font-bold text-foreground mb-3 uppercase tracking-widest">
              Rush Options
            </p>
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {["Rush (7 days): +30%", "Next Day (24h): +50%", "Same Day: from $400"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 font-sans text-sm text-muted-foreground whitespace-nowrap">
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
