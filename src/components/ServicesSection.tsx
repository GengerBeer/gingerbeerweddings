import { useEffect, useRef } from "react";

const services = [
  {
    number: "01",
    title: "Wedding Film\nEditing",
    items: [
      { name: "Teaser Film", desc: "60–90 sec cinematic edit that captures the essence of your day." },
      { name: "Highlight Film", desc: "4–8 min story-driven edit with arc, emotion, and music sync." },
      { name: "Full Wedding Film", desc: "Complete multi-camera edit — ceremony, vows, speeches, reception." },
    ],
  },
  {
    number: "02",
    title: "Photo\nRetouching",
    items: [
      { name: "Skin Retouching", desc: "Natural, refined retouching preserving authentic skin texture." },
      { name: "Color Correction", desc: "Cinematic color grading tailored to your footage and style." },
      { name: "Batch Editing", desc: "Consistent color treatment across large sets of images." },
      { name: "Style Matching", desc: "Matching your preferred preset or reference aesthetic precisely." },
    ],
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );
    sectionRef.current?.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="section-dark py-28 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-2 md:mb-3 reveal">
          <p className="text-label uppercase tracking-[0.25em] text-brand-sand/60 font-sans text-[10px] mb-4">
            Capabilities
          </p>
          <h2 className="font-serif text-display-lg text-brand-cream font-extrabold">
            What We Offer
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((svc, i) => (
            <div
              key={svc.number}
              className={`service-card p-10 md:p-14 reveal ${i === 1 ? "reveal-delay-2" : ""}`}
            >
              {/* Decorative number and title container for overlap */}
              <div className="relative mb-8">
                <div
                  className="font-serif text-[100px] md:text-[140px] font-extrabold opacity-20 leading-none select-none"
                  style={{ color: "hsl(188 35% 20%)" }}
                  aria-hidden="true"
                >
                  {svc.number}
                </div>
                <h3 className="font-serif text-display-sm text-brand-cream font-extrabold -mt-10 md:-mt-14 relative z-10 whitespace-pre-line">
                  {svc.title}
                </h3>
              </div>

              <div className="divider-dark mb-8" />

              <ul className="space-y-6">
                {svc.items.map((item) => (
                  <li key={item.name} className="flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-sand mt-2 shrink-0" />
                    <div>
                      <p className="font-sans text-brand-cream font-medium text-sm mb-1">{item.name}</p>
                      <p className="font-sans text-brand-cream/50 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
