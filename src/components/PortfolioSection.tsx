import { useEffect, useRef, useState, useCallback } from "react";

declare global {
  interface Window {
    Vimeo: {
      Player: new (iframe: HTMLIFrameElement) => VimeoPlayer;
    };
  }
}

interface VimeoPlayer {
  play(): Promise<void>;
  pause(): Promise<void>;
  on(event: string, callback: (data: any) => void): void;
  getDuration(): Promise<number>;
  setCurrentTime(seconds: number): Promise<number>;
  setVolume(volume: number): Promise<number>;
  getQualities(): Promise<{ id: string; label: string; active: boolean }[]>;
  setQuality(quality: string): Promise<string>;
}

// Global registry of all card players so we can pause them when fullscreen opens
const cardPlayers: Map<number, VimeoPlayer> = new Map();

const videos = [
  { id: "1172328822", title: "Wedding Film 1" },
  { id: "1172320048", title: "Wedding Film 2" },
  { id: "1172316545", title: "Wedding Film 3" },
  { id: "1172303225", title: "Wedding Film 4" },
  { id: "1172323284", title: "Wedding Film 5" },
  { id: "1172335961", title: "Wedding Film 6" },
];

// ── Fullscreen Overlay Player ──────────────────────────────────────────────
interface FullscreenPlayerProps {
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const FullscreenPlayer = ({ index, onClose, onPrev, onNext }: FullscreenPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<VimeoPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [nearEnd, setNearEnd] = useState(false);
  const [qualities, setQualities] = useState<{ id: string; label: string; active: boolean }[]>([]);
  const [activeQuality, setActiveQuality] = useState("auto");
  const [showQuality, setShowQuality] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const video = videos[index];
  const hasPrev = index > 0;
  const hasNext = index < videos.length - 1;

  // Init player on index change
  useEffect(() => {
    setProgress(0);
    setNearEnd(false);
    setIsPlaying(false);

    let attempts = 0;
    const init = () => {
      if (!iframeRef.current || !window.Vimeo) {
        if (++attempts < 30) setTimeout(init, 300);
        return;
      }
      const player = new window.Vimeo.Player(iframeRef.current);
      playerRef.current = player;

      player.on("play", () => setIsPlaying(true));
      player.on("pause", () => setIsPlaying(false));
      player.on("timeupdate", (data: { seconds: number; duration: number; percent: number }) => {
        setProgress(data.percent * 100);
        setNearEnd(data.duration - data.seconds <= 5 && data.duration > 0);
      });
      player.getDuration().then((d) => setDuration(d));
      player.getQualities().then((q) => { if (q?.length) setQualities(q); }).catch(() => {});
    };
    init();

    return () => {
      playerRef.current?.pause().catch(() => {});
      playerRef.current = null;
    };
  }, [index]);

  // Auto-hide controls after 3s
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, [resetHideTimer]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      resetHideTimer();
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowRight" && hasNext) { onNext(); return; }
      if (e.key === "ArrowLeft" && hasPrev) { onPrev(); return; }
      if (e.key === " ") {
        e.preventDefault();
        if (!playerRef.current) return;
        isPlaying ? playerRef.current.pause() : playerRef.current.play();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasNext, hasPrev, isPlaying, onClose, onNext, onPrev, resetHideTimer]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    isPlaying ? playerRef.current.pause() : playerRef.current.play();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    playerRef.current.setCurrentTime(ratio * duration);
    setProgress(ratio * 100);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    playerRef.current?.setVolume(val);
  };

  const handleQuality = (q: string) => {
    playerRef.current?.setQuality(q).catch(() => {});
    setActiveQuality(q);
    setShowQuality(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black"
      onMouseMove={resetHideTimer}
      style={{ cursor: showControls ? "default" : "none" }}
    >
      {/* Iframe */}
      <iframe
        ref={iframeRef}
        key={video.id}
        src={`https://player.vimeo.com/video/${video.id}?controls=0&autopause=0&autoplay=1&badge=0&app_id=58479`}
        title={video.title}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
        allowFullScreen
        className="border-0"
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '177.78vh', height: '100vh', minWidth: '100%', minHeight: '56.25vw' }}
      />

      {/* Controls overlay — fades in/out */}
      <div
        className="absolute inset-0 flex flex-col justify-between transition-opacity duration-300"
        style={{
          opacity: showControls ? 1 : 0,
          background: "linear-gradient(transparent 45%, rgba(0,0,0,0.72))",
          pointerEvents: showControls ? "auto" : "none",
        }}
      >
        {/* Top: close */}
        <div className="flex justify-end px-5 pt-5">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center transition-all border border-white/20 backdrop-blur-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Center: play button */}
        <div className="flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
          >
            {isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="2" width="4" height="12" rx="1" fill="#1a1a1a"/>
                <rect x="9" y="2" width="4" height="12" rx="1" fill="#1a1a1a"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M4 2.5L13 8L4 13.5V2.5Z" fill="#1a1a1a"/>
              </svg>
            )}
          </button>
        </div>

        {/* Bottom controls */}
        <div className="px-4 pb-4 flex flex-col gap-2">
          {/* Near-end hint */}
          {nearEnd && hasNext && (
            <div className="flex justify-end mb-1">
              <span className="text-white/60 text-xs font-sans uppercase tracking-widest animate-pulse">
                Up next →
              </span>
            </div>
          )}

          {/* Progress bar */}
          <div
            className="w-full h-[4px] bg-white/30 rounded-full overflow-hidden cursor-pointer"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between">
            {/* Volume */}
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white/80 flex-shrink-0">
                <path d="M2 5H4.5L7 2.5V11.5L4.5 9H2V5Z" fill="currentColor"/>
                {volume > 0 && <path d="M9 4.5C9.8 5.3 10.3 6.1 10.3 7C10.3 7.9 9.8 8.7 9 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>}
                {volume > 0.5 && <path d="M10.5 3C12 4.2 12.8 5.5 12.8 7C12.8 8.5 12 9.8 10.5 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>}
              </svg>
              <input
                type="range" min="0" max="1" step="0.05" value={volume}
                onChange={handleVolume}
                className="w-20 h-1 accent-white cursor-pointer"
              />
            </div>

            {/* Quality */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowQuality((v) => !v)}
                  className="text-white/80 hover:text-white text-xs font-semibold px-2 py-0.5 rounded border border-white/20 hover:border-white/50 transition-colors"
                >
                  {activeQuality === "auto" ? "AUTO" : activeQuality.toUpperCase()}
                </button>
                {showQuality && (
                  <div className="absolute bottom-8 right-0 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden min-w-[80px] shadow-2xl">
                    {[{ id: "auto", label: "Auto" }, ...qualities].map((q) => (
                      <button key={q.id} onClick={() => handleQuality(q.id)}
                        className={`block w-full text-left px-4 py-2 text-xs transition-colors hover:bg-white/10 ${
                          activeQuality === q.id ? "text-white font-semibold" : "text-white/60"
                        }`}>
                        {q.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prev button — left edge */}
      {hasPrev && (
        <button
          onClick={onPrev}
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/20 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          } ${nearEnd ? "ring-2 ring-white/50 scale-110" : ""}`}
          title="Previous (←)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {/* Next button — right edge */}
      {hasNext && (
        <button
          onClick={onNext}
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/20 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          } ${nearEnd ? "ring-2 ring-white/50 scale-110 animate-pulse" : ""}`}
          title="Next (→)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
};

// ── Original VideoCard with hover overlay ─────────────────────────────────
const VideoCard = ({ video, onClick }: { video: { id: string; title: string }; onClick: () => void }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VimeoPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [qualities, setQualities] = useState<{ id: string; label: string; active: boolean }[]>([]);
  const [activeQuality, setActiveQuality] = useState("auto");
  const [showQuality, setShowQuality] = useState(false);

  useEffect(() => {
    let attempts = 0;
    const init = () => {
      if (!iframeRef.current) return;
      if (!window.Vimeo) {
        attempts++;
        if (attempts < 20) setTimeout(init, 300);
        return;
      }
      const player = new window.Vimeo.Player(iframeRef.current);
      playerRef.current = player;
      cardPlayers.set(index, player);
      player.on("play", () => setIsPlaying(true));
      player.on("pause", () => setIsPlaying(false));
      player.on("timeupdate", ({ percent }: { percent: number }) => setProgress(percent * 100));
      player.getDuration().then((d) => setDuration(d));
      player.getQualities().then((q) => { if (q && q.length) setQualities(q); }).catch(() => {});
      setReady(true);
    };
    init();
    return () => { cardPlayers.delete(index); };
  }, [index]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!playerRef.current) return;
    isPlaying ? playerRef.current.pause() : playerRef.current.play();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!playerRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    playerRef.current.setCurrentTime(ratio * duration);
    setProgress(ratio * 100);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = parseFloat(e.target.value);
    setVolume(val);
    playerRef.current?.setVolume(val);
  };

  const handleQuality = (quality: string) => {
    playerRef.current?.setQuality(quality).catch(() => {});
    setActiveQuality(quality);
    setShowQuality(false);
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <div
      ref={containerRef}
      className="group rounded-xl overflow-hidden relative bg-black transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
      style={{ aspectRatio: "16/9" }}
    >
      <iframe
        ref={iframeRef}
        src={`https://player.vimeo.com/video/${video.id}?controls=0&autopause=0&badge=0&app_id=58479`}
        title={video.title}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
      />

      {/* Original hover overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "linear-gradient(transparent 45%, rgba(0,0,0,0.72))",
          pointerEvents: ready ? "auto" : "none",
        }}
      >
        {/* Play/Pause — center */}
        <button
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="3" y="2" width="4" height="12" rx="1" fill="#1a1a1a" />
              <rect x="9" y="2" width="4" height="12" rx="1" fill="#1a1a1a" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 2.5L13 8L4 13.5V2.5Z" fill="#1a1a1a" />
            </svg>
          )}
        </button>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-2 flex flex-col gap-1.5">
          {/* Progress bar */}
          <div
            className="w-full h-[4px] bg-white/30 rounded-full overflow-hidden cursor-pointer"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between">
            {/* Volume */}
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white/80 flex-shrink-0">
                <path d="M2 5H4.5L7 2.5V11.5L4.5 9H2V5Z" fill="currentColor"/>
                {volume > 0 && <path d="M9 4.5C9.8 5.3 10.3 6.1 10.3 7C10.3 7.9 9.8 8.7 9 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>}
                {volume > 0.5 && <path d="M10.5 3C12 4.2 12.8 5.5 12.8 7C12.8 8.5 12 9.8 10.5 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>}
              </svg>
              <input
                type="range" min="0" max="1" step="0.05" value={volume}
                onChange={handleVolume}
                className="w-14 h-1 accent-white cursor-pointer"
              />
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              {/* Quality — hidden on cards */}
              <div className="relative hidden">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowQuality((v) => !v); }}
                  className="text-white/80 hover:text-white text-xs font-semibold transition-colors px-2 py-0.5 rounded border border-white/20 hover:border-white/50"
                >
                  {activeQuality === "auto" ? "AUTO" : activeQuality.toUpperCase()}
                </button>
                {showQuality && (
                  <div className="absolute bottom-8 right-0 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden min-w-[80px] shadow-2xl">
                    {[{ id: "auto", label: "Auto" }, ...qualities].map((q) => (
                      <button key={q.id} onClick={() => handleQuality(q.id)}
                        className={`block w-full text-left px-4 py-2 text-xs transition-colors hover:bg-white/10 ${
                          activeQuality === q.id ? "text-white font-semibold" : "text-white/60"
                        }`}>
                        {q.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen button */}
              <button
                onClick={handleFullscreen}
                className="text-white/80 hover:text-white transition-colors"
                title="Fullscreen"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9V3h6M15 3h6v6M21 15v6h-6M9 21H3v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Section ────────────────────────────────────────────────────────────────
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

  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? "hidden" : "";
    // Pause all card players when fullscreen opens
    if (activeIndex !== null) {
      cardPlayers.forEach((player) => player.pause().catch(() => {}));
    }
    return () => { document.body.style.overflow = ""; };
  }, [activeIndex]);

  return (
    <section id="portfolio" className="section-cream py-28 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-12 md:mb-16 reveal">
          <p className="text-label uppercase tracking-[0.25em] text-muted-foreground font-sans text-[10px] mb-4">
            Our Work
          </p>
          <h2 className="font-serif text-display-lg text-foreground font-extrabold">
            Selected Work
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 reveal">
          {videos.map((video, i) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      </div>

      {/* Fullscreen player */}
      {activeIndex !== null && (
        <FullscreenPlayer
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onPrev={() => setActiveIndex((i) => Math.max(0, (i ?? 0) - 1))}
          onNext={() => setActiveIndex((i) => Math.min(videos.length - 1, (i ?? 0) + 1))}
        />
      )}
    </section>
  );
}
