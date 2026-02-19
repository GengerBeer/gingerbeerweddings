const steps = [
  {
    number: "01",
    title: "Inquiry",
    desc: "Tell us about your project, vision, and timeline. We'll respond within 48 hours.",
  },
  {
    number: "02",
    title: "File Transfer",
    desc: "Deliver your raw footage securely via our transfer link. We confirm receipt and begin review.",
  },
  {
    number: "03",
    title: "Editing & Review",
    desc: "We craft your film and share a private preview link. Your revisions are handled with care.",
  },
  {
    number: "04",
    title: "Final Delivery",
    desc: "Receive your completed film in high resolution, ready to relive and share forever.",
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="section-dark py-28 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <p className="text-label uppercase tracking-[0.2em] text-brand-sand/60 font-sans text-[10px] mb-4">
            How It Works
          </p>
          <h2 className="font-serif text-display-lg text-brand-cream font-light">
            Our Process
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line (desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-brand-dark -translate-x-px" aria-hidden="true" />

          <div className="space-y-0">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className={`reveal flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-0 py-12 border-b border-brand-dark last:border-0`}
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                {/* Left: number (desktop aligns to left half) */}
                <div className="md:w-1/2 md:pr-16 md:text-right">
                  <span className="font-serif text-[80px] md:text-[120px] font-light text-brand-dark leading-none select-none">
                    {step.number}
                  </span>
                </div>

                {/* Center dot */}
                <div className="hidden md:flex w-0 relative">
                  <div className="absolute -translate-x-1/2 w-3 h-3 rounded-full border-2 border-brand-sand bg-brand-dark" />
                </div>

                {/* Right: content */}
                <div className="md:w-1/2 md:pl-16">
                  <h3 className="font-serif text-display-sm text-brand-cream font-light mb-3">
                    {step.title}
                  </h3>
                  <p className="font-sans text-brand-cream/55 text-sm leading-relaxed max-w-sm">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
