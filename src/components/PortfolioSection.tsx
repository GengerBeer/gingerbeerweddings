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
  on(event: string, callback: (data: { percent: number }) => void): void;
  getDuration(): Promise<number>;
  setCurrentTime(seconds: number): Promise<number>;
  setVolume(volume: number): Promise<number>;
  getQualities(): Promise<{ id: string; label: string; active: boolean }[]>;
  setQuality(quality: string): Promise<string>;
}

const videos = [
  { id: "1172328822", title: "Wedding Film 1" },
  { id: "1172320048", title: "Wedding Film 2" },
  { id: "1172316545", title: "Wedding Film 3" },
  { id: "1172303225", title: "Wedding Film 4" },
  { id: "1172323284", title: "Wedding Film 5" },
  { id: "1172335961", title: "Wedding Film 6" },
];

interface VideoCardProps {
  video: { id: string; title: string };
  index: number;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

const VideoCard = ({ video, index, onPrev, onNext, hasPrev, hasNext }: VideoCardProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VimeoPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [qualities, setQualities] = useState<{ id: string; label: string; active: boolean }[]>([]);
  const [activeQuality, setActiveQuality] = useState("auto");
  const [showQuality, setShowQuality] = useState(false);
  const [nearEnd, setNearEnd] = useState(false);

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
      player.on("play", () => setIsPlaying(true));
      player.on("pause", () => setIsPlaying(false));
      player.on("timeupdate", ({ percent }) => {
        setProgress(percent * 100);
        // Show next/prev arrows when 5 seconds remain
        player.getDuration().then((d) => {
          setNearEnd(d > 0 && percent * d >= d - 5);
        });
      });
      player.getDuration().then((d) => setDuration(d));
      player.getQualities().then((q) => { if (q && q.length) setQualities(q); }).catch(() => {});
      setReady(true);
    };
    init();

    const onFsChange = () => {
      const fsActive = !!document.fullscreenElement;
      setIsFullscreen(fsActive);
      // Stop video when exiting fullscreen
      if (!fsActive && playerRef.current) {
        playerRef.current.pause().catch(() => {});
        setIsPlaying(false);
        setNearEnd(false);
      }
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

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

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (isFullscreen) {
      await document.exitFullscreen();
    } else {
      await containerRef.current.requestFullscreen();
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    playerRef.current?.setVolume(val);
  };

  const handleQuality = (quality: string) => {
    playerRef.current?.setQuality(quality).catch(() => {});
    setActiveQuality(quality);
    setShowQuality(false);
  };

  const handlePrev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    playerRef.current?.pause().catch(() => {});
    setIsPlaying(false);
    setNearEnd(false);
    onPrev();
  }, [onPrev]);

  const handleNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    playerRef.current?.pause().catch(() => {});
    setIsPlaying(false);
    setNearEnd(false);
    onNext();
  }, [onNext]);

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

      {/* Overlay */}
      <div
        className={`transition-opacity duration-300 ${
          isFullscreen
            ? "fixed inset-0 z-50 opacity-0 hover:opacity-100"
            : "absolute inset-0 opacity-0 group-hover:opacity-100"
        }`}
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

        {/* Prev / Next arrows — visible in fullscreen near end OR always in fullscreen */}
        {isFullscreen && (
          <>
            {/* Prev */}
            {hasPrev && (
              <button
                onClick={handlePrev}
                className={`absolute left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/20 ${
                  nearEnd ? "opacity-100 scale-100" : "opacity-0 group-hover:opacity-70"
                }`}
                title="Previous video"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}

            {/* Next */}
            {hasNext && (
              <button
                onClick={handleNext}
                className={`absolute right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/20 ${
                  nearEnd ? "opacity-100 scale-100" : "opacity-0 group-hover:opacity-70"
                }`}
                title="Next video"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}

            {/* Near-end label */}
            {nearEnd && hasNext && (
              <div className="absolute top-5 right-5 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
                <span className="text-white/70 text-xs font-sans uppercase tracking-widest">Up next</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </>
        )}

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
              {/* Quality */}
              {isFullscreen && (
                <div className="relative">
                  <button
                    onClick={() => setShowQuality((v) => !v)}
                    className="text-white/80 hover:text-white text-xs font-semibold transition-colors px-2 py-0.5 rounded border border-white/20 hover:border-white/50"
                  >
                    {activeQuality === "auto" ? "AUTO" : activeQuality.toUpperCase()}
                  </button>
                  {showQuality && (
                    <div className="absolute bottom-8 right-0 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden min-w-[80px] shadow-2xl">
                      {[{ id: "auto", label: "Auto" }, ...qualities].map((q) => (
                        <button
                          key={q.id}
                          onClick={() => handleQuality(q.id)}
                          className={`block w-full text-left px-4 py-2 text-xs transition-colors hover:bg-white/10 ${
                            activeQuality === q.id ? "text-white font-semibold" : "text-white/60"
                          }`}
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white/80 hover:text-white transition-colors"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M8 3v5H3M21 8h-5V3M3 16h5v5M16 21v-5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M3 9V3h6M15 3h6v6M21 15v6h-6M9 21H3v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

  // When fullscreen closes, reset activeIndex
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) setActiveIndex(null);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const handlePrev = (index: number) => {
    if (index > 0) setActiveIndex(index - 1);
  };

  const handleNext = (index: number) => {
    if (index < videos.length - 1) setActiveIndex(index + 1);
  };

  return (
    <section id="portfolio" className="section-cream py-28 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="mb-12 md:mb-16 reveal">
          <p className="text-label uppercase tracking-[0.25em] text-muted-foreground font-sans text-[10px] mb-4">
            Our Work
          </p>
          <h2 className="font-serif text-display-lg text-foreground font-extrabold">
            Selected Work
          </h2>
        </div>

        {/* Video grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 reveal">
          {videos.map((video, i) => (
            <VideoCard
              key={video.id}
              video={video}
              index={i}
              onPrev={() => handlePrev(i)}
              onNext={() => handleNext(i)}
              hasPrev={i > 0}
              hasNext={i < videos.length - 1}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
