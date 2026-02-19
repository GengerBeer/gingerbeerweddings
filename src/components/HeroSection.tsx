import heroBg from "@/assets/hero-bg.jpg";

export default function HeroSection() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background image with fallback gradient */}
      <div
        className="absolute inset-0 bg-brand-dark"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />

      {/* Cinematic overlay */}
      <div className="absolute inset-0 hero-overlay" aria-hidden="true" />




      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p
          className="text-label uppercase tracking-[0.25em] text-brand-sand font-sans text-[10px] mb-8 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          Wedding Post-Production Studio · USA
        </p>

        <h1
          className="font-serif text-display-xl text-brand-cream font-light leading-[1.0] mb-8 animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          Cinematic Wedding Films<br />
          <em className="italic">That Feel Like You</em>
        </h1>

        <p
          className="font-sans text-brand-cream/75 text-base md:text-lg font-light max-w-lg mx-auto mb-12 leading-relaxed animate-fade-up"
          style={{ animationDelay: "0.6s" }}
        >
          We craft emotional, timeless wedding edits for modern couples and filmmakers.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
          style={{ animationDelay: "0.8s" }}
        >
          <a
            href="#portfolio"
            className="inline-flex items-center gap-3 bg-brand-sand text-foreground font-sans text-[11px] uppercase tracking-widest px-8 py-4 hover:bg-brand-sand-dark transition-colors duration-300 font-medium"
          >
            View Work
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-3 border border-brand-cream/60 text-brand-cream font-sans text-[11px] uppercase tracking-widest px-8 py-4 hover:border-brand-cream hover:bg-brand-cream/10 transition-all duration-300 font-medium"
          >
            Check Availability
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-[7vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: "1.2s" }}>
        <span className="text-brand-cream/50 font-sans text-[9px] uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-px h-8 bg-brand-cream/30 animate-pulse" />
      </div>
    </section>
  );
}
