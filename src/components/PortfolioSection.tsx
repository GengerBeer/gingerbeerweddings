import { useEffect, useState } from "react";
import VideoModal from "@/components/VideoModal";

const vimeoIds = ["1172328822", "1172320048", "1172316545", "1172303225"];

interface VimeoMeta {
  title: string;
  thumb: string;
}

// Define custom thumbnail positions per video ID to control cropping
const videoPositions: Record<string, string> = {
  // "Christy and Zach Highlight" — 3rd video (index 2)
  "1172316545": "center 100%", 
};

/* ── Thumbnail card ─────────────────────────────────────────────── */
const VideoCard = ({ vimeoId, meta, onOpen }: {
  vimeoId: string;
  meta: VimeoMeta | null;
  onOpen: () => void;
}) => (
  <div
    onClick={onOpen}
    className="group relative w-full h-full overflow-hidden rounded-2xl cursor-pointer bg-brand-dark"
  >
    {/* Skeleton while loading */}
    {!meta && (
      <div className="absolute inset-0 bg-brand-dark/60 animate-pulse" />
    )}

    {/* Thumbnail from Vimeo */}
    {meta && (
      <img
        src={meta.thumb}
        alt={meta.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        style={{
          objectPosition: videoPositions[vimeoId] || "center"
        }}
      />
    )}

    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-brand-dark/10 transition-opacity duration-300 group-hover:from-brand-dark/80" />

    {/* Title badge — bottom left */}
    {meta?.title && (
      <div className="absolute bottom-4 left-4 z-10">
        <span className="inline-flex items-center font-sans text-[10px] uppercase tracking-[0.18em] text-brand-cream/90 bg-brand-dark/40 backdrop-blur-md border border-brand-cream/15 px-3 py-1.5 rounded-full">
          {meta.title}
        </span>
      </div>
    )}
  </div>
);

/* ── Section ────────────────────────────────────────────────────── */
export default function PortfolioSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [metas, setMetas] = useState<(VimeoMeta | null)[]>(vimeoIds.map(() => null));

  // Fetch title + thumbnail from Vimeo oEmbed (no auth required)
  useEffect(() => {
    vimeoIds.forEach((id, i) => {
      fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}&width=1280`)
        .then((r) => r.json())
        .then((data) => {
          if (data?.title) {
            setMetas((prev) => {
              const next = [...prev];
              next[i] = {
                title: data.title,
                thumb: data.thumbnail_url ?? "",
              };
              return next;
            });
          }
        })
        .catch(() => {/* silently ignore */});
    });
  }, []);

  // Build VideoItem array for VideoModal (uses vimeoId field)
  const modalVideos = vimeoIds.map((vimeoId, i) => ({
    vimeoId,
    title: metas[i]?.title ?? vimeoId,
  }));

  return (
    <section id="portfolio" className="section-cream py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-12 md:mb-16 animate-fade-up">
          <h2 className="font-serif text-display-md text-brand-dark font-extrabold leading-tight">
            Selected Work.
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
            <VideoCard vimeoId={vimeoIds[0]} meta={metas[0]} onOpen={() => setActiveIndex(0)} />
          </div>
          {/* Card 2 — right col, row 1 */}
          <div style={{ gridColumn: 2, gridRow: 1 }}>
            <VideoCard vimeoId={vimeoIds[1]} meta={metas[1]} onOpen={() => setActiveIndex(1)} />
          </div>
          {/* Card 3 — right col, row 2 */}
          <div style={{ gridColumn: 2, gridRow: 2 }}>
            <VideoCard vimeoId={vimeoIds[2]} meta={metas[2]} onOpen={() => setActiveIndex(2)} />
          </div>
          {/* Card 4 — full width */}
          <div style={{ gridColumn: "1 / span 2", gridRow: 3 }}>
            <VideoCard vimeoId={vimeoIds[3]} meta={metas[3]} onOpen={() => setActiveIndex(3)} />
          </div>
        </div>
      </div>

      {activeIndex !== null && (
        <VideoModal
          videos={modalVideos}
          startIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
        />
      )}
    </section>
  );
}
