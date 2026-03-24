import { useEffect, useState } from "react";
import VideoModal from "@/components/VideoModal";

const videos = [
  { vimeoId: "1172328822", title: "Wedding Film 1", location: "Santorini, Greece",   thumb: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" },
  { vimeoId: "1172320048", title: "Wedding Film 2", location: "Tuscany, Italy",      thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" },
  { vimeoId: "1172316545", title: "Wedding Film 3", location: "Malibu, CA",          thumb: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" },
  { vimeoId: "1172303225", title: "Wedding Film 4", location: "Amalfi Coast, Italy", thumb: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" },
];

/* ── Thumbnail card ─────────────────────────────────────────────── */
const VideoCard = ({ video, onOpen }: {
  video: typeof videos[0];
  onOpen: () => void;
}) => (
  <div
    onClick={onOpen}
    className="group relative w-full h-full overflow-hidden rounded-2xl cursor-pointer bg-brand-dark"
  >
    {/* Thumbnail */}
    <img
      src={video.thumb}
      alt={video.title}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />

    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-brand-dark/10 transition-opacity duration-300 group-hover:from-brand-dark/80" />

    {/* Location badge — bottom left, aligned with play button */}
    <div className="absolute bottom-4 left-4 z-10">
      <span className="inline-flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.18em] text-brand-cream/90 bg-brand-dark/40 backdrop-blur-md border border-brand-cream/15 px-3 py-1.5 rounded-full">
        <svg width="8" height="9" viewBox="0 0 8 10" fill="none" className="shrink-0">
          <path d="M4 0C2.07 0 0.5 1.57 0.5 3.5 0.5 6.125 4 10 4 10s3.5-3.875 3.5-6.5C7.5 1.57 5.93 0 4 0zm0 4.75a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" fill="currentColor"/>
        </svg>
        {video.location}
      </span>
    </div>

    {/* Glass play button — bottom right */}
    <div
      className="absolute bottom-4 right-4 z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
      style={{
        background: "linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 100%)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.35)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.25), inset 0 1.5px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.08)",
      }}
    >
      <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(155deg, rgba(255,255,255,0.28) 0%, transparent 40%)" }} />
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="relative z-10 translate-x-0.5 text-white drop-shadow">
        <path d="M6 4.5L19.5 12 6 19.5V4.5Z" fill="currentColor"/>
      </svg>
    </div>
  </div>
);

/* ── Section ────────────────────────────────────────────────────── */
export default function PortfolioSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!document.querySelector('script[src*="vimeo.com/api/player"]')) {
      const script = document.createElement("script");
      script.src = "https://player.vimeo.com/api/player.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <section id="portfolio" className="section-cream py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-12 md:mb-16 animate-fade-up">
          <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-brand-dark/40 mb-3">Our Work</p>
          <h2 className="font-serif text-display-md text-brand-dark font-extrabold leading-tight">
            Real Weddings.<br />Real Editing.
          </h2>
        </div>

        {/* Bento grid */}
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "260px 260px 360px",
          }}
        >
          {/* Card 1 — left col, rows 1-2 */}
          <div style={{ gridColumn: 1, gridRow: "1 / span 2" }}>
            <VideoCard video={videos[0]} onOpen={() => setActiveIndex(0)} />
          </div>
          {/* Card 2 — right col, row 1 */}
          <div style={{ gridColumn: 2, gridRow: 1 }}>
            <VideoCard video={videos[1]} onOpen={() => setActiveIndex(1)} />
          </div>
          {/* Card 3 — right col, row 2 */}
          <div style={{ gridColumn: 2, gridRow: 2 }}>
            <VideoCard video={videos[2]} onOpen={() => setActiveIndex(2)} />
          </div>
          {/* Card 4 — full width */}
          <div style={{ gridColumn: "1 / span 2", gridRow: 3 }}>
            <VideoCard video={videos[3]} onOpen={() => setActiveIndex(3)} />
          </div>
        </div>
      </div>

      {activeIndex !== null && (
        <VideoModal
          videos={videos}
          startIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
        />
      )}
    </section>
  );
}
