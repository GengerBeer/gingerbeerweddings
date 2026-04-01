import { useState, useEffect, useRef } from "react";

declare global {
  interface Window { Vimeo: any; }
}
type VimeoPlayer = any;

export interface VideoItem {
  /** Vimeo video ID (takes priority if provided) */
  vimeoId?: string;
  /** Local/remote video file URL (used only if vimeoId is absent) */
  videoUrl?: string;
  location?: string;
  title?: string;
}

interface Props {
  videos: VideoItem[];
  startIndex: number;
  onClose: () => void;
}

export default function VideoModal({ videos, startIndex, onClose }: Props) {
  const [index, setIndex] = useState(startIndex);
  const video = videos[index];
  const hasPrev = index > 0;
  const hasNext = index < videos.length - 1;
  const isVimeo = !!video.vimeoId;

  // Vimeo refs & state
  const iframeRef  = useRef<HTMLIFrameElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const playerRef  = useRef<VimeoPlayer | null>(null);
  const cardRef    = useRef<HTMLDivElement>(null);
  const idleTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPlaying,    setIsPlaying]    = useState(false);
  const [progress,     setProgress]     = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [volume,       setVolume]       = useState(1);
  const [qualities,    setQualities]    = useState<{ id: string; label: string; active: boolean }[]>([]);
  const [activeQuality,setActiveQuality] = useState("auto");
  const [showQuality,  setShowQuality]  = useState(false);
  const [isBuffering,  setIsBuffering]  = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // ── Load Vimeo SDK once ──────────────────────────────────────────────────
  useEffect(() => {
    if (document.getElementById("vimeo-player-sdk")) return;
    const script = document.createElement("script");
    script.id  = "vimeo-player-sdk";
    script.src = "https://player.vimeo.com/api/player.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  // ── Vimeo init ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isVimeo) return;
    setProgress(0); setIsPlaying(false);
    playerRef.current = null;
    let cancelled = false;
    let attempts = 0;
    const init = () => {
      if (cancelled) return;
      if (!iframeRef.current || !window.Vimeo?.Player) {
        if (++attempts < 40) setTimeout(init, 300);
        return;
      }
      const player = new window.Vimeo.Player(iframeRef.current);
      playerRef.current = player;
      player.on("play",        () => { if (!cancelled) { setIsPlaying(true);  setIsBuffering(false); } });
      player.on("pause",       () => { if (!cancelled) setIsPlaying(false); });
      player.on("ended",       () => { if (!cancelled) { setIsPlaying(false); setProgress(0); } });
      player.on("timeupdate",  (d: { percent: number }) => { if (!cancelled) setProgress(d.percent * 100); });
      player.on("bufferstart", () => { if (!cancelled) setIsBuffering(true); });
      player.on("bufferend",   () => { if (!cancelled) setIsBuffering(false); });
      player.getDuration().then((d: number) => { if (!cancelled) setDuration(d); }).catch(() => {});
      player.getQualities().then((q: any) => {
        if (!cancelled && q?.length) { setQualities(q); setActiveQuality("auto"); }
      }).catch(() => {});
    };
    // Small delay so iframe is fully mounted before SDK tries to attach
    setTimeout(init, 200);
    return () => {
      cancelled = true;
      playerRef.current?.pause().catch(() => {});
      playerRef.current = null;
    };
  }, [index, isVimeo]);

  // ── HTML5 video sync ─────────────────────────────────────────────────────
  useEffect(() => {
    if (isVimeo) return;
    const el = videoRef.current;
    if (!el) return;
    const onPlay     = () => setIsPlaying(true);
    const onPause    = () => setIsPlaying(false);
    const onEnded    = () => { setIsPlaying(false); setProgress(0); };
    const onTime     = () => setProgress(el.duration ? (el.currentTime / el.duration) * 100 : 0);
    const onMeta     = () => setDuration(el.duration);
    el.addEventListener("play",       onPlay);
    el.addEventListener("pause",      onPause);
    el.addEventListener("ended",      onEnded);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    return () => {
      el.removeEventListener("play",       onPlay);
      el.removeEventListener("pause",      onPause);
      el.removeEventListener("ended",      onEnded);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
    };
  }, [index, isVimeo]);

  // ── Fullscreen ───────────────────────────────────────────────────────────
  useEffect(() => {
    const onChange = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      if (!fs) {
        setShowControls(true);
        if (idleTimer.current) clearTimeout(idleTimer.current);
      } else {
        setShowControls(true);
        idleTimer.current = setTimeout(() => setShowControls(false), 2500);
      }
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // ── Keyboard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.fullscreenElement) { onClose(); return; }
      if (e.key === "ArrowRight" && hasNext && !document.fullscreenElement) { setIndex(i => i + 1); return; }
      if (e.key === "ArrowLeft"  && hasPrev && !document.fullscreenElement) { setIndex(i => i - 1); return; }
      if (e.key === " ") { e.preventDefault(); togglePlay(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNext, hasPrev, onClose, isPlaying]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const togglePlay = () => {
    if (isVimeo) {
      if (!playerRef.current) return;
      isPlaying ? playerRef.current.pause() : playerRef.current.play();
    } else {
      const el = videoRef.current;
      if (!el) return;
      isPlaying ? el.pause() : el.play();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    if (isVimeo) {
      if (!playerRef.current || !duration) return;
      playerRef.current.setCurrentTime(ratio * duration);
    } else {
      const el = videoRef.current;
      if (!el || !duration) return;
      el.currentTime = ratio * duration;
    }
    setProgress(ratio * 100);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (isVimeo) playerRef.current?.setVolume(val);
    else if (videoRef.current) videoRef.current.volume = val;
  };

  const goFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else cardRef.current?.requestFullscreen?.();
  };

  const resetIdle = () => {
    if (!document.fullscreenElement) return;
    setShowControls(true);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setShowControls(false), 2500);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      style={{ background: "rgba(11,44,49,0.92)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl bg-black"
        onClick={(e) => e.stopPropagation()}
        style={{ border: isFullscreen ? "none" : "1px solid rgba(250,238,233,0.08)" }}
      >
        {/* Header — hidden in fullscreen */}
        {!isFullscreen && (
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#0B2C31]/90">
            <span className="inline-flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.18em] text-[#FAEEE9]/70">
              {video.location && (
                <>
                  <svg width="8" height="9" viewBox="0 0 8 10" fill="none" className="shrink-0">
                    <path d="M4 0C2.07 0 0.5 1.57 0.5 3.5 0.5 6.125 4 10 4 10s3.5-3.875 3.5-6.5C7.5 1.57 5.93 0 4 0zm0 4.75a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" fill="currentColor"/>
                  </svg>
                  {video.location}
                </>
              )}
              {!video.location && video.title && <span>{video.title}</span>}
            </span>
            <div className="flex items-center gap-1">
              {videos.length > 1 && (
                <>
                  <button onClick={() => setIndex(i => i - 1)} disabled={!hasPrev} className="w-7 h-7 flex items-center justify-center text-[#FAEEE9]/50 hover:text-[#FAEEE9] disabled:opacity-25 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
                  <span className="font-sans text-[10px] text-[#FAEEE9]/40 mx-1">{index + 1} / {videos.length}</span>
                  <button onClick={() => setIndex(i => i + 1)} disabled={!hasNext} className="w-7 h-7 flex items-center justify-center text-[#FAEEE9]/50 hover:text-[#FAEEE9] disabled:opacity-25 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
                  <div className="w-px h-4 bg-[#FAEEE9]/15 mx-2" />
                </>
              )}
              <button onClick={onClose} className="w-7 h-7 flex items-center justify-center text-[#FAEEE9]/50 hover:text-[#FAEEE9] transition-colors" title="Close">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>
        )}

        {/* Video area */}
        <div
          className="relative bg-black"
          style={{
            aspectRatio: isFullscreen ? undefined : "16/9",
            width:  isFullscreen ? "100vw" : undefined,
            height: isFullscreen ? "100vh" : undefined,
            cursor: isFullscreen && !showControls ? "none" : "default",
          }}
        >
          {/* Vimeo iframe */}
          {isVimeo && (
            <iframe
              ref={iframeRef}
              key={`${video.vimeoId}-${index}`}
              src={`https://player.vimeo.com/video/${video.vimeoId}?autoplay=1&badge=0&autopause=0&app_id=58479&title=0&byline=0&portrait=0&controls=0&dnt=1`}
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          )}

          {/* HTML5 video */}
          {!isVimeo && (
            <video
              ref={videoRef}
              key={`${video.videoUrl}-${index}`}
              src={video.videoUrl}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-contain"
            />
          )}

          {/* Transparent interceptor — captures mouse/dblclick above iframe/video */}
          <div
            className="absolute inset-0 z-10"
            onClick={togglePlay}
            onMouseMove={resetIdle}
            onDoubleClick={goFullscreen}
          />

          {/* Custom controls overlay */}
          <div
            className="absolute inset-x-0 bottom-0 z-20 px-4 pb-4 pt-10 flex flex-col gap-2 transition-opacity duration-500"
            style={{
              background: "linear-gradient(transparent, rgba(0,0,0,0.65))",
              opacity: showControls ? 1 : 0,
              pointerEvents: showControls ? "auto" : "none",
            }}
          >
            {/* Progress bar */}
            <div
              className="w-full h-1 rounded-full overflow-hidden cursor-pointer relative"
              style={{ background: isBuffering ? undefined : "rgba(255,255,255,0.2)" }}
              onClick={handleSeek}
            >
              {isBuffering && (
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute inset-0 animate-shimmer"
                    style={{
                      background: "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.1) 100%)",
                      backgroundSize: "200% 100%",
                    }}
                  />
                </div>
              )}
              <div className="h-full bg-white rounded-full transition-all duration-300 relative z-10" style={{ width: `${progress}%` }} />
            </div>

            {/* Bottom row */}
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button onClick={togglePlay} className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors shrink-0">
                {isPlaying
                  ? <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="3" y="2" width="4" height="12" rx="1" fill="white"/><rect x="9" y="2" width="4" height="12" rx="1" fill="white"/></svg>
                  : <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4 2.5L13 8L4 13.5V2.5Z" fill="white"/></svg>
                }
              </button>

              {/* Volume */}
              <input type="range" min="0" max="1" step="0.05" value={volume} onChange={handleVolume} className="w-16 h-1 accent-white cursor-pointer" />

              {/* Quality (Vimeo only) */}
              {isVimeo && qualities.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowQuality(v => !v)}
                    className="text-white/60 hover:text-white text-[10px] font-sans uppercase tracking-widest px-2 py-0.5 rounded border border-white/20 hover:border-white/40 transition-colors"
                  >
                    {activeQuality === "auto" ? "Auto" : activeQuality.toUpperCase()}
                  </button>
                  {showQuality && (
                    <div className="absolute bottom-8 left-0 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden min-w-[72px] shadow-2xl">
                      {[{ id: "auto", label: "Auto" }, ...qualities].map(q => (
                        <button
                          key={q.id}
                          onClick={() => {
                            playerRef.current?.setQuality(q.id).catch(() => {});
                            setActiveQuality(q.id);
                            setShowQuality(false);
                            setIsBuffering(true);
                          }}
                          className={`block w-full text-left px-3 py-1.5 text-[11px] transition-colors hover:bg-white/10 ${activeQuality === q.id ? "text-white font-semibold" : "text-white/60"}`}
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Fullscreen */}
              <button onClick={goFullscreen} className="ml-auto w-7 h-7 flex items-center justify-center text-white/60 hover:text-white transition-colors" title="Full screen">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M8 3v5H3M21 8h-5V3M3 16h5v5M16 21v-5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
