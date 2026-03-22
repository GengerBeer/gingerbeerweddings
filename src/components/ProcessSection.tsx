import { useEffect, useRef } from "react";

const steps = [
  { number: "01", title: "Send Us Your Footage", desc: "Drag, drop, done. Upload via our link — no special software, no FTP, no nonsense. Organized by camera? Great. A total mess? We'll sort it. We confirm receipt and start reviewing same day." },
  { number: "02", title: "We Edit", desc: "Fill out a 5-minute brief — style, pacing, mood, references. That's it. We study your portfolio and deliver an edit that feels like yours. Not ours. You won't explain your style twice." },
  { number: "03", title: "You Review", desc: "Private Frame.io link. Timestamped comments. Two revision rounds on us. Feedback goes in as one list — not a week of DMs." },
  { number: "04", title: "You Deliver", desc: "Approved and paid? Files are yours. High-res, graded, export-ready. We keep your masters backed up. Your footage is safer with us than on your own drives. Probably." },
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
        <div className="mb-12 md:mb-16 reveal">
          <p className="text-label uppercase tracking-[0.25em] text-brand-sand/60 font-sans text-[10px] mb-4">How It Works</p>
          <h2 className="font-serif text-display-lg text-brand-cream font-extrabold">Our Process</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <div key={step.number} className="process-card p-8 reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
              <span className="font-serif font-extrabold leading-none select-none block mb-6" style={{ fontSize: "clamp(3rem, 6vw, 5rem)", color: "hsl(34 89% 89% / 0.25)" }} aria-hidden="true">{step.number}</span>
              <h3 className="font-serif text-display-sm text-brand-cream font-extrabold mb-4">{step.title}</h3>
              <p className="font-sans text-brand-cream/50 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
