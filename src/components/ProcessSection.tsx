import { useEffect, useRef } from "react";

const steps = [
  { number: "01", title: "Inquiry", desc: "Tell us about your project, vision, and timeline. We'll respond within 48 hours." },
  { number: "02", title: "File Transfer", desc: "Deliver your raw footage securely via our transfer link. We confirm receipt and begin review." },
  { number: "03", title: "Editing & Review", desc: "We craft your film and share a private preview link. Your revisions are handled with care." },
  { number: "04", title: "Final Delivery", desc: "Receive your completed film in high resolution, ready to relive and share forever." },
];

export default function ProcessSection() {
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
    <section id="process" ref={sectionRef} className="section-dark py-28 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="mb-12 md:mb-16 reveal">
          <p className="text-label uppercase tracking-[0.25em] text-brand-sand/60 font-sans text-[10px] mb-4">
            How It Works
          </p>
          <h2 className="font-serif text-display-lg text-brand-cream font-extrabold">
            Our Process
          </h2>
        </div>

        {/* Horizontal cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`process-card p-8 reveal`}
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <span
                className="font-serif font-extrabold leading-none select-none block mb-6"
                style={{ fontSize: "clamp(3rem, 6vw, 5rem)", color: "hsl(34 89% 89% / 0.25)" }}
                aria-hidden="true"
              >
                {step.number}
              </span>
              <h3 className="font-serif text-display-sm text-brand-cream font-extrabold mb-4">
                {step.title}
              </h3>
              <p className="font-sans text-brand-cream/50 text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
