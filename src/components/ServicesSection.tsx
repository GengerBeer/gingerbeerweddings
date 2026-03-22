import { useEffect, useRef } from "react";

const services = [
  {
    number: "01",
    title: "Wedding Film\nEditing",
    items: [
      { name: "Teaser", desc: "60–90 seconds of the good stuff. The one your couple posts before the bouquet hits the floor. Horizontal, vertical, or both." },
      { name: "Highlight Film", desc: "4–8 minutes, story-driven, music-synced, graded to perfection. The film that gets rewatched every anniversary and still hits." },
      { name: "Full Wedding Film", desc: "Ceremony, speeches, reception — every camera, every angle. Structured, synced, and edited like we actually watched the whole thing. Because we did." },
    ],
  },
  {
    number: "02",
    title: "Photo\nRetouching",
    items: [
      { name: "Skin Retouching", desc: "Clean, natural, zero plastic. We enhance — we don't rebuild." },
      { name: "Color Correction", desc: "Cinematic grading matched to your footage. Consistent from getting ready to last dance." },
      { name: "Batch Editing", desc: "One gallery. One look. No rogue warm tones on slide 47." },
      { name: "Style Matching", desc: "Send your preset, your mood board, your vibe — we'll nail it." },
    ],
  },
  {
    number: "03",
    title: "Next-Day &\nSame-Day",
    items: [
      { name: "Next-Day Teaser", desc: "Teaser delivered in 24 hours. Your couple posts while the party's still trending." },
      { name: "Same-Day Recap", desc: "Recap by midnight on the wedding day. Your inbox fills up with \"who edited this?\"" },
    ],
  },
  {
    number: "04",
    title: "Cleanup &\nRestoration",
    items: [
      { name: "Object Removal", desc: "Uncle Steve walking through the first kiss? Gone. Wires, exit signs, that one guy in cargo shorts? All gone." },
      { name: "AI Upscaling", desc: "Low-res archival footage that deserves a second life? Upscaled, sharpened, and brought back from the dead." },
    ],
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }); },
      { threshold: 0.12 }
    );
    sectionRef.current?.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return (
    <section id="services" ref={sectionRef} className="section-dark py-28 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-2 md:mb-3 reveal">
          <p className="text-label uppercase tracking-[0.25em] text-brand-sand/60 font-sans text-[10px] mb-4">Capabilities</p>
          <h2 className="font-serif text-display-lg text-brand-cream font-extrabold">What We Do</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12 md:mt-16">
          {services.map((svc, i) => (
            <div key={svc.number} className={`service-card p-10 md:p-14 reveal ${i === 1 ? "reveal-delay-2" : ""}`}>
              <div className="relative mb-8">
                <div className="font-serif text-[100px] md:text-[140px] font-extrabold opacity-20 leading-none select-none" style={{ color: "hsl(188 35% 20%)" }} aria-hidden="true">{svc.number}</div>
                <h3 className="font-serif text-display-sm text-brand-cream font-extrabold -mt-10 md:-mt-14 relative z-10 whitespace-pre-line">{svc.title}</h3>
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
