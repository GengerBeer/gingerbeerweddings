import { useEffect, useRef } from "react";
import { Mail, MapPin } from "lucide-react";
import FeedbackDialog from "@/components/FeedbackDialog";

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="section-dark py-28 md:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">

        {/* Decorative orb */}
        <div
          className="absolute -left-40 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, hsl(188 41% 25% / 0.5) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 relative">

          {/* Left: copy */}
          <div className="reveal">
            <p className="text-label uppercase tracking-[0.25em] text-brand-sand/60 font-sans text-[10px] mb-4">
              Contact
            </p>
            <h2 className="font-serif text-display-md text-brand-cream font-extrabold mb-12 md:mb-16 leading-tight">
              Let's Create Something<br />
              <em className="italic">Timeless</em>
            </h2>
            <p className="font-sans text-brand-cream/55 text-sm leading-relaxed mb-12 max-w-sm">
              Whether you're a couple planning your wedding or a filmmaker looking for a dedicated
              post-production partner — we'd love to hear from you.
            </p>

            <div className="space-y-0">
              <div className="divider-dark" />
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center gap-3">
                  <Mail size={13} className="text-brand-sand/50" />
                  <span className="font-sans text-[11px] uppercase tracking-widest text-brand-cream/40">Email</span>
                </div>
                <a
                  href="mailto:hello@gingerbeerweddings.com"
                  className="font-sans text-sm text-brand-cream hover:text-brand-sand transition-colors"
                >
                  hello@gingerbeerweddings.com
                </a>
              </div>
              <div className="divider-dark" />
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center gap-3">
                  <MapPin size={13} className="text-brand-sand/50" />
                  <span className="font-sans text-[11px] uppercase tracking-widest text-brand-cream/40">Based In</span>
                </div>
                <span className="font-sans text-sm text-brand-cream">United States · Remote Worldwide</span>
              </div>
              <div className="divider-dark" />
            </div>
          </div>

          {/* Right: CTA + Dialog */}
          <div className="reveal reveal-delay-2 flex flex-col justify-center gap-8">
            <p className="font-sans text-brand-cream/55 text-sm leading-relaxed max-w-sm">
              Ready to start? Tell us about your wedding day and we'll get back to you within 24 hours.
            </p>
            <div>
              <FeedbackDialog />
            </div>
            <p className="font-sans text-[11px] uppercase tracking-widest text-brand-cream/25">
              We respond within 24 hours
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
