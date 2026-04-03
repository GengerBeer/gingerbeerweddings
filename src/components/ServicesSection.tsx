import { useEffect, useRef } from "react";
import { Clapperboard, SlidersHorizontal, Zap, Wand2 } from "lucide-react";

const services = [
  {
    number: "01",
    icon: Clapperboard,
    title: "Wedding Film\nEditing",
    items: [
      { name: "Teaser", desc: "60–90 seconds of the good stuff. The one your couple posts before the bouquet hits the floor. Horizontal, vertical, or both." },
      { name: "Highlight Film", desc: "4–8 minutes, story-driven, music-synced, graded to perfection. The film that gets rewatched every anniversary and still hits." },
      { name: "Full Wedding Film", desc: "Ceremony, speeches, reception — every camera, every angle. Structured, synced, and edited like we actually watched the whole thing. Because we did." },
    ],
  },
  {
    number: "02",
    icon: SlidersHorizontal,
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
    icon: Zap,
    title: "Next-Day &\nSame-Day",
    items: [
      { name: "Next-Day Teaser", desc: "Teaser delivered in 24 hours. Your couple posts while the party's still trending." },
      { name: "Same-Day Recap", desc: "Recap by midnight on the wedding day. Your inbox fills up with \"who edited this?\"" },
    ],
  },
  {
    number: "04",
    icon: Wand2,
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
    <section id="services" ref={sectionRef} className="section-dark py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-2 md:mb-3 reveal">
          <h2 className="font-serif text-display-lg text-brand-cream font-extrabold">What We Do</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 mt-6 md:mt-8">
          {services.map((svc, i) => (
            <div key={svc.number} className={`service-card p-6 md:p-8 reveal ${i === 1 ? "reveal-delay-2" : ""}`}>
              <div className="relative mb-6 pt-10 md:pt-14">
                {/* Number: absolutely at top, bottom half hidden behind title */}
                <div
                  className="absolute top-0 left-0 font-serif font-extrabold leading-none select-none pointer-events-none z-0"
                  style={{ color: "hsl(188 35% 20%)", opacity: 0.2, fontSize: "clamp(80px, 10vw, 110px)" }}
                  aria-hidden="true"
                >
                  {svc.number}
                </div>
                {/* Title row: in front, positioned so top half of number peeks above */}
                <div className="flex items-center justify-between relative z-10">
                  <h3 className="font-serif text-display-sm text-brand-cream font-extrabold whitespace-pre-line">{svc.title}</h3>
                  <svc.icon size={48} strokeWidth={1.5} className="text-brand-cream shrink-0" />
                </div>
              </div>
              <div className="divider-dark mb-5" />
              <ul className="space-y-3">
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
