import { useEffect } from "react";

interface Props { open: boolean; onClose: () => void; }

export default function BookCallDialog({ open, onClose }: Props) {
  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Load Calendly widget script once
  useEffect(() => {
    if (document.getElementById("calendly-script")) return;
    const script = document.createElement("script");
    script.id  = "calendly-script";
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
      style={{ background: "rgba(11,44,49,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #fdf5f0 0%, #FAEEE9 60%, #f5e7df 100%)",
          border: "1px solid rgba(11,44,49,0.07)",
        }}
      >
        {/* Top shimmer */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-dark/10 to-transparent" />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full flex items-center justify-center text-brand-dark/30 hover:text-brand-dark hover:bg-brand-dark/6 transition-all duration-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Header */}
        <div className="px-8 md:px-10 pt-10 pb-4">
          <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-brand-dark/40 mb-2">Schedule</p>
          <h2 className="font-serif text-3xl md:text-4xl text-brand-dark font-extrabold leading-tight">Book a Call</h2>
          <p className="font-sans text-sm text-brand-dark/45 mt-2 leading-relaxed">
            Pick a date and time that works for you.
          </p>
        </div>

        {/* Calendly inline widget */}
        <div
          className="calendly-inline-widget w-full"
          data-url="https://calendly.com/project-gingerbeerweddings/30min?hide_gdpr_banner=1&background_color=fdf5f0&text_color=0B2C31&primary_color=255259"
          style={{ minWidth: "320px", height: "660px" }}
        />

        {/* Bottom shimmer */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-dark/10 to-transparent" />
      </div>
    </div>
  );
}
