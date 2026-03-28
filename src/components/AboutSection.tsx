import { useEffect, useRef, useState } from "react";

const founderImages = [
  {
    src: "https://images.unsplash.com/photo-1542204637-e67bc7d41e48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    alt: "Founder at color grading station",
  },
  {
    src: "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    alt: "DaVinci Resolve color grading",
  },
  {
    src: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    alt: "Video editing timeline",
  },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageBlockRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fillPct, setFillPct] = useState(0);
  const fillRef = useRef(0);
  const indexRef = useRef(0);
  const resettingRef = useRef(false);
  const DURATION = 2800; // ms per image
  const TICK = 50;      // ms per update

  /* Animated fill bar + auto-cycle */
  useEffect(() => {
    const timer = setInterval(() => {
      fillRef.current = Math.min(100, fillRef.current + (TICK / DURATION) * 100);
      setFillPct(fillRef.current);
      if (fillRef.current >= 100) {
        const nextIdx = (indexRef.current + 1) % founderImages.length;
        fillRef.current = 0;
        indexRef.current = nextIdx;
        // If looping back to start, flag a reset so bars clear instantly
        resettingRef.current = nextIdx === 0;
        setFillPct(0);
        setActiveIndex(nextIdx);
        // Clear the reset flag after one tick
        if (nextIdx === 0) setTimeout(() => { resettingRef.current = false; }, TICK + 10);
      }
    }, TICK);
    return () => clearInterval(timer);
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  const goTo = (idx: number) => {
    fillRef.current = 0;
    indexRef.current = idx;
    setFillPct(0);
    setActiveIndex(idx);
  };

  /* Reveal animation */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );
    sectionRef.current
      ?.querySelectorAll(".reveal, .reveal-left, .reveal-right")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-dark py-28 md:py-40 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">

          {/* ── Text column ── */}
          <div className="reveal-left">
            <p className="text-label uppercase tracking-[0.25em] text-brand-sand/70 font-sans text-[10px] mb-4">
              ABOUT
            </p>
            <h2 className="font-serif text-display-lg text-brand-cream font-extrabold mb-10">
              Who We Are
            </h2>

            <div className="space-y-6 font-sans text-brand-cream/80 text-base md:text-lg leading-relaxed">
              <p>
                Ginger Beer was founded by a filmmaker — from superyacht
                productions to brand stories. Over the past four years, we've
                delivered 600+ projects across luxury, commercial, and brand
                clients who don't accept "good enough."
              </p>
              <p>
                Now we're bringing that standard to weddings. We know what a
                clean timeline looks like. We know what proper color science is.
                And we know the difference between an edit that's "done" and one
                that actually makes people feel something. It's time to help
                videographers and studios clear their backlogs — and get their
                weekends back.
              </p>
              <p>
                Our team edits exclusively in DaVinci Resolve. Every project
                gets color grading, licensed music, and AI audio cleanup as
                standard. No corners cut, no excuses.
              </p>
              <p className="font-medium text-brand-sand/90 pt-6 border-t border-brand-sand/20">
                We're based in Europe, working on US time. Small team, fast
                delivery, direct communication. No account managers, no ticket
                systems — you talk to the people who edit your footage.
              </p>
            </div>
          </div>

          {/* ── Stacked image column ── */}
          <div
            ref={imageBlockRef}
            className="reveal-right relative flex flex-col self-center"
          >
            {/* Glow orb */}
            <div className="absolute -z-10 right-0 top-1/2 w-80 h-80 bg-brand-teal/20 rounded-full blur-3xl opacity-60" />

            {/* Stacked images */}
            <div className="relative w-full" style={{ height: 460 }}>
              {founderImages.map((img, i) => {
                let translateY = 0;
                let scale = 1;
                let opacity = 0;
                let zIndex = 0;
                let rotateZ = 0;

                if (i === activeIndex) {
                  translateY = 0; scale = 1; opacity = 1; zIndex = 10; rotateZ = 0;
                } else if (i === (activeIndex + 1) % founderImages.length) {
                  translateY = 18; scale = 0.94; opacity = 0.6; zIndex = 6; rotateZ = 2;
                } else if (i === (activeIndex + 2) % founderImages.length) {
                  translateY = 34; scale = 0.88; opacity = 0.35; zIndex = 3; rotateZ = -2;
                }

                return (
                  <div
                    key={img.src}
                    className="absolute inset-x-0 overflow-hidden rounded-2xl shadow-2xl"
                    style={{
                      top: 0,
                      height: "100%",
                      zIndex,
                      transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotateZ}deg)`,
                      opacity,
                      transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.7s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent" />
                  </div>
                );
              })}
            </div>

            {/* Controls row: fill-bar left, arrows right */}
            <div className="flex items-center justify-between mt-10 px-1">
              {/* Fill-bar progress */}
              <div className="flex items-center gap-1" style={{ width: 80 }}>
                {founderImages.map((_, i) => (
                  <div key={i} className="flex-1 h-[2px] rounded-full bg-brand-cream/15 overflow-hidden">
                    <div
                      className="h-full bg-brand-sand rounded-full"
                      style={{
                        width:
                          i < activeIndex ? "100%"
                          : i === activeIndex ? `${fillPct}%`
                          : "0%",
                        transition: (i === activeIndex || resettingRef.current) ? "none" : "width 0.4s ease",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Arrows */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => goTo((activeIndex - 1 + founderImages.length) % founderImages.length)}
                  className="w-9 h-9 rounded-full border border-brand-cream/30 text-brand-cream/70 flex items-center justify-center hover:border-brand-sand hover:text-brand-sand transition-all duration-300"
                  aria-label="Previous image"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  onClick={() => goTo((activeIndex + 1) % founderImages.length)}
                  className="w-9 h-9 rounded-full border border-brand-cream/30 text-brand-cream/70 flex items-center justify-center hover:border-brand-sand hover:text-brand-sand transition-all duration-300"
                  aria-label="Next image"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
