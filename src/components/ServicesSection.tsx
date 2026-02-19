export default function ServicesSection() {
  return (
    <section id="services" className="section-dark py-28 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <p className="text-label uppercase tracking-[0.2em] text-brand-sand/60 font-sans text-[10px] mb-4">
            Capabilities
          </p>
          <h2 className="font-serif text-display-lg text-brand-cream font-light">
            What We Offer
          </h2>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Column 1: Wedding Film Editing */}
          <div className="border-brand-dark border md:border-r-0 p-10 md:p-16 reveal">
            <p className="text-label uppercase tracking-[0.2em] text-brand-sand font-sans text-[10px] mb-8">
              01
            </p>
            <h3 className="font-serif text-display-sm text-brand-cream font-light mb-8">
              Wedding Film Editing
            </h3>
            <div className="divider-dark mb-8" />
            <ul className="space-y-6">
              {[
                { name: "Teaser Film", desc: "60–90 sec cinematic edit that captures the essence of your day." },
                { name: "Highlight Film", desc: "4–8 min story-driven edit with arc, emotion, and music sync." },
                { name: "Full Wedding Film", desc: "Complete multi-camera edit — ceremony, vows, speeches, reception." },
              ].map((item) => (
                <li key={item.name} className="flex gap-5">
                  <div className="w-1 h-1 rounded-full bg-brand-sand mt-2.5 shrink-0" />
                  <div>
                    <p className="font-sans text-brand-cream font-medium text-sm mb-1">{item.name}</p>
                    <p className="font-sans text-brand-cream/50 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Photo Retouching */}
          <div className="border border-brand-dark p-10 md:p-16 reveal reveal-delay-2">
            <p className="text-label uppercase tracking-[0.2em] text-brand-sand font-sans text-[10px] mb-8">
              02
            </p>
            <h3 className="font-serif text-display-sm text-brand-cream font-light mb-8">
              Photo Retouching
            </h3>
            <div className="divider-dark mb-8" />
            <ul className="space-y-6">
              {[
                { name: "Skin Retouching", desc: "Natural, refined retouching preserving authentic skin texture." },
                { name: "Color Correction", desc: "Cinematic color grading tailored to your footage and style." },
                { name: "Batch Editing", desc: "Consistent color treatment across large sets of images." },
                { name: "Style Matching", desc: "Matching your preferred preset or reference aesthetic precisely." },
              ].map((item) => (
                <li key={item.name} className="flex gap-5">
                  <div className="w-1 h-1 rounded-full bg-brand-sand mt-2.5 shrink-0" />
                  <div>
                    <p className="font-sans text-brand-cream font-medium text-sm mb-1">{item.name}</p>
                    <p className="font-sans text-brand-cream/50 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
