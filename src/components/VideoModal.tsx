import { useState, useEffect, useRef, useCallback } from "react";
import { useVimeoPlayer } from "@/hooks/useVimeoPlayer";
import { useHtml5Player } from "@/hooks/useHtml5Player";
import { useIsMobile } from "@/hooks/use-mobile";

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

const fmt = (s: number) => {
  if (!s || isNaN(s) || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const PLAYER_VOLUME_STORAGE_KEY = "gbw-player-volume";
const PLAYER_MUTED_STORAGE_KEY = "gbw-player-muted";
const DEFAULT_PLAYER_VOLUME = 0.35;

function readInitialPlayerState() {
  if (typeof window === "undefined") {
    return { volume: DEFAULT_PLAYER_VOLUME, muted: false };
  }

  const storedVolumeRaw = window.localStorage.getItem(PLAYER_VOLUME_STORAGE_KEY);
  const storedVolume = storedVolumeRaw === null ? NaN : Number(storedVolumeRaw);
  const volume = Number.isFinite(storedVolume)
    ? Math.max(0, Math.min(1, storedVolume))
    : DEFAULT_PLAYER_VOLUME;

  return {
    volume,
    muted: window.localStorage.getItem(PLAYER_MUTED_STORAGE_KEY) === "true",
  };
}

// ── Icons ────────────────────────────────────────────────────────────────────
const PlayIcon  = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 2.5L13 8 4 13.5V2.5Z" fill="white"/></svg>;
const PauseIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="3" y="2" width="4" height="12" rx="1" fill="white"/><rect x="9" y="2" width="4" height="12" rx="1" fill="white"/></svg>;

const VolumeIcon = ({ level }: { level: number }) => {
  if (level === 0) return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 9l-6 6M11 9l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
  if (level < 0.5) return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
};

const EnterFullscreenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ExitFullscreenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PiPIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="12" y="12" width="8" height="6" rx="1" fill="currentColor"/>
  </svg>
);

const Skip10BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
    <text x="12" y="15" textAnchor="middle" fontSize="5.5" fontWeight="700" fontFamily="system-ui,sans-serif" fill="currentColor">10</text>
  </svg>
);

const Skip10FwdIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.01 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
    <text x="12" y="15" textAnchor="middle" fontSize="5.5" fontWeight="700" fontFamily="system-ui,sans-serif" fill="currentColor">10</text>
  </svg>
);

// ── Component ────────────────────────────────────────────────────────────────
export default function VideoModal({ videos, startIndex, onClose }: Props) {
  const [initialPlayerState] = useState(readInitialPlayerState);
  const [index, setIndex] = useState(startIndex);
  const video   = videos[index];
  const hasPrev = index > 0;
  const hasNext = index < videos.length - 1;
  const isVimeo = !!video.vimeoId;
  const isMobile = useIsMobile();

  const iframeRef  = useRef<HTMLIFrameElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const cardRef    = useRef<HTMLDivElement>(null);
  const idleTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seekingRef = useRef(false); // for drag-seek
  const mountedRef = useRef(false); // for open animation

  const [isMuted,      setIsMuted]      = useState(initialPlayerState.muted);
  const [volume,       setVolumeUI]     = useState(initialPlayerState.volume);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showQuality,  setShowQuality]  = useState(false);
  const [clickAnim,    setClickAnim]    = useState<{ type: "play" | "pause" | "fwd" | "back"; key: number } | null>(null);
  const [isOpen,       setIsOpen]       = useState(false); // mount animation
  const effectiveVolume = isMuted ? 0 : volume;

  // Mount animation
  useEffect(() => {
    const raf = requestAnimationFrame(() => { mountedRef.current = true; setIsOpen(true); });
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleEndEarly = useCallback(() => {
    if (hasNext) {
      setIndex(i => i + 1);
    } else {
      onClose();
    }
  }, [hasNext, onClose]);

  // ── Player hooks ────────────────────────────────────────────────────────────
  const vimeo = useVimeoPlayer(iframeRef, {
    enabled: isVimeo,
    videoId: video.vimeoId,
    onEndEarly: handleEndEarly,
    initialVolume: effectiveVolume,
  });
  const html5 = useHtml5Player(videoRef,  { enabled: !isVimeo, videoUrl: video.videoUrl });

  const isPlaying   = isVimeo ? vimeo.isPlaying   : html5.isPlaying;
  const isBuffering = isVimeo ? vimeo.isBuffering  : html5.isBuffering;
  const progress    = isVimeo ? vimeo.progress     : html5.progress;
  const currentTime = isVimeo ? vimeo.currentTime  : html5.currentTime;
  const duration    = isVimeo ? vimeo.duration     : html5.duration;
  const buffered    = isVimeo ? 0                  : html5.buffered;
  const qualities   = isVimeo ? vimeo.qualities    : [];
  const activeQuality = isVimeo ? vimeo.activeQuality : "auto";

  useEffect(() => {
    setShowQuality(false);
  }, [index]);

  // Body scroll lock
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(PLAYER_VOLUME_STORAGE_KEY, String(volume));
    window.localStorage.setItem(PLAYER_MUTED_STORAGE_KEY, String(isMuted));
  }, [volume, isMuted]);

  useEffect(() => {
    const nextVolume = isMuted ? 0 : volume;

    if (isVimeo) {
      if (!vimeo.isReady) return;
      vimeo.setVolume(nextVolume);
      return;
    }

    html5.setVolume(nextVolume);
  }, [
    html5.setVolume,
    isMuted,
    isVimeo,
    video.videoUrl,
    video.vimeoId,
    vimeo.isReady,
    vimeo.setVolume,
    volume,
  ]);

  // ── Controls auto-hide ───────────────────────────────────────────────────────
  const clearIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
  }, []);

  const scheduleHide = useCallback(() => {
    clearIdle();
    idleTimer.current = setTimeout(() => setShowControls(false), 3000);
  }, [clearIdle]);

  const bumpControls = useCallback(() => {
    setShowControls(true);
    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      clearIdle();
    } else {
      scheduleHide();
    }
    return clearIdle;
  }, [isPlaying, scheduleHide, clearIdle]);

  // ── Fullscreen ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    // Safari
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  const goFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      return;
    }
    // iOS Safari: use native video fullscreen
    if (!isVimeo && videoRef.current) {
      const vid = videoRef.current as any;
      if (vid.webkitEnterFullscreen) { vid.webkitEnterFullscreen(); return; }
    }
    cardRef.current?.requestFullscreen?.().catch(() => {});
  }, [isVimeo]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const doTogglePlay = useCallback(() => {
    const willPlay = !isPlaying;
    if (isVimeo) vimeo.togglePlay();
    else         html5.togglePlay();
    setClickAnim({ type: willPlay ? "play" : "pause", key: Date.now() });
  }, [isPlaying, isVimeo, vimeo, html5]);

  const doSeek = useCallback((ratio: number) => {
    if (isVimeo) vimeo.seek(ratio);
    else         html5.seek(ratio);
    if (isPlaying) bumpControls();
  }, [isVimeo, vimeo, html5, isPlaying, bumpControls]);

  const doSkip = useCallback((delta: number) => {
    if (isVimeo) vimeo.seekSeconds(delta);
    else         html5.seekSeconds(delta);
    setClickAnim({ type: delta > 0 ? "fwd" : "back", key: Date.now() });
    bumpControls();
  }, [isVimeo, vimeo, html5, bumpControls]);

  const doMuteToggle = useCallback(() => {
    const willMute = !isMuted;
    setIsMuted(willMute);
    const vol = willMute ? 0 : (volume > 0 ? volume : 1);
    if (!willMute) setVolumeUI(vol);
    if (isVimeo) vimeo.setVolume(willMute ? 0 : vol);
    else         html5.setVolume(willMute ? 0 : vol);
  }, [isMuted, volume, isVimeo, vimeo, html5]);

  const doVolume = useCallback((val: number) => {
    setVolumeUI(val);
    setIsMuted(val === 0);
    if (isVimeo) vimeo.setVolume(val);
    else         html5.setVolume(val);
  }, [isVimeo, vimeo, html5]);

  // ── Progress bar seek (click + drag + touch) ────────────────────────────────
  const calcRatio = (clientX: number, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  const handleSeekMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    seekingRef.current = true;
    const ratio = calcRatio(e.clientX, e.currentTarget);
    doSeek(ratio);

    const onMove = (me: MouseEvent) => {
      if (!seekingRef.current) return;
      const bar = document.getElementById("player-progress-bar");
      if (bar) doSeek(calcRatio(me.clientX, bar));
    };
    const onUp = () => {
      seekingRef.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [doSeek]);

  const handleSeekTouch = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const touch = e.touches[0] || e.changedTouches[0];
    if (!touch) return;
    doSeek(calcRatio(touch.clientX, e.currentTarget));
  }, [doSeek]);

  // ── Double-tap skip (mobile) ────────────────────────────────────────────────
  const lastTapRef  = useRef(0);
  const lastSideRef = useRef<"left" | "right" | null>(null);
  const handleVideoTap = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const side = e.clientX - rect.left < rect.width / 2 ? "left" : "right";
    const now = Date.now();

    if (now - lastTapRef.current < 300 && lastSideRef.current === side) {
      // Double tap — skip
      doSkip(side === "right" ? 10 : -10);
    } else {
      doTogglePlay();
    }
    lastTapRef.current  = now;
    lastSideRef.current = side;
  }, [doTogglePlay, doSkip]);

  // ── Keyboard ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      switch (e.key) {
        case "Escape":
          if (!document.fullscreenElement) { onClose(); return; }
          break;
        case "ArrowRight":
          if (!document.fullscreenElement && hasNext) { setIndex(i => i + 1); return; }
          if (e.shiftKey) { doSkip(10); e.preventDefault(); }
          break;
        case "ArrowLeft":
          if (!document.fullscreenElement && hasPrev) { setIndex(i => i - 1); return; }
          if (e.shiftKey) { doSkip(-10); e.preventDefault(); }
          break;
        case " ":
          e.preventDefault();
          doTogglePlay();
          break;
        case "f": case "F":
          goFullscreen();
          break;
        case "m": case "M":
          doMuteToggle();
          break;
        default: break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNext, hasPrev, onClose, isPlaying, isMuted, volume]);

  // ── Navigate between videos ─────────────────────────────────────────────────
  const goNext = useCallback(() => { if (hasNext) setIndex(i => i + 1); }, [hasNext]);
  const goPrev = useCallback(() => { if (hasPrev) setIndex(i => i - 1); }, [hasPrev]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 lg:p-10"
      style={{
        background: "rgba(11,44,49,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        opacity: isOpen ? 1 : 0,
        transition: "opacity 0.25s ease",
      }}
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="relative w-full md:max-w-4xl lg:max-w-5xl rounded-none md:rounded-2xl overflow-hidden shadow-2xl bg-black"
        onClick={(e) => e.stopPropagation()}
        style={{
          border: isFullscreen ? "none" : "1px solid rgba(250,238,233,0.08)",
          transform: isOpen ? "scale(1)" : "scale(0.96)",
          transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
          maxHeight: isFullscreen ? "100vh" : "calc(100vh - 2rem)",
        }}
      >
        {/* ── Header (hidden in fullscreen) ── */}
        {!isFullscreen && (
          <div className="flex items-center justify-between px-4 py-3 bg-[#0B2C31]/95 backdrop-blur-sm">
            <span className="inline-flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.18em] text-[#FAEEE9]/70 truncate max-w-[60%]">
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

            <div className="flex items-center gap-1 shrink-0">
              {videos.length > 1 && (
                <>
                  <button onClick={goPrev} disabled={!hasPrev} className="w-8 h-8 flex items-center justify-center text-[#FAEEE9]/50 hover:text-[#FAEEE9] disabled:opacity-20 transition-colors rounded-lg hover:bg-white/5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
                  <span className="font-sans text-[10px] text-[#FAEEE9]/40 px-1 tabular-nums">{index + 1} / {videos.length}</span>
                  <button onClick={goNext} disabled={!hasNext} className="w-8 h-8 flex items-center justify-center text-[#FAEEE9]/50 hover:text-[#FAEEE9] disabled:opacity-20 transition-colors rounded-lg hover:bg-white/5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
                  <div className="w-px h-4 bg-[#FAEEE9]/15 mx-1"/>
                </>
              )}
              <button onClick={onClose} title="Close (Esc)" className="w-8 h-8 flex items-center justify-center text-[#FAEEE9]/50 hover:text-[#FAEEE9] transition-colors rounded-lg hover:bg-white/5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>
        )}

        {/* ── Video area ── */}
        <div
          className="relative bg-black select-none"
          style={{
            aspectRatio: isFullscreen ? undefined : "16/9",
            width:  isFullscreen ? "100vw" : undefined,
            height: isFullscreen ? "100vh" : undefined,
            cursor: isFullscreen && !showControls ? "none" : "default",
          }}
          onMouseMove={() => { if (isPlaying) bumpControls(); }}
          onMouseEnter={() => setShowControls(true)}
        >
          {/* Vimeo iframe */}
          {isVimeo && (
            <iframe
              ref={iframeRef}
              key={`vimeo-${video.vimeoId}-${index}`}
              src={`https://player.vimeo.com/video/${video.vimeoId}?autoplay=1&muted=0&badge=0&autopause=0&app_id=58479&title=0&byline=0&portrait=0&controls=${isMobile ? 1 : 0}&playsinline=1&dnt=1`}
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              allowFullScreen
              // @ts-ignore
              webkit-playsinline="1"
              className="absolute inset-0 w-full h-full border-0"
            />
          )}

          {/* HTML5 video */}
          {!isVimeo && (
            <video
              ref={videoRef}
              key={`html5-${video.videoUrl}-${index}`}
              src={video.videoUrl}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-contain"
            />
          )}

          {/* Buffering spinner */}
          {isBuffering && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <div className="player-spinner"/>
            </div>
          )}

          {/* Click feedback */}
          {clickAnim && (
            <div key={clickAnim.key} className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
              <div className="video-click-anim w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                {clickAnim.type === "play"  && <PlayIcon/>}
                {clickAnim.type === "pause" && <PauseIcon/>}
                {clickAnim.type === "fwd"   && <Skip10FwdIcon/>}
                {clickAnim.type === "back"  && <Skip10BackIcon/>}
              </div>
            </div>
          )}

          {/* Transparent interceptor for click/dblclick */}
          {!(isMobile && isVimeo) && (
          <div
            className="absolute inset-0 z-10"
            onClick={isMobile ? handleVideoTap : doTogglePlay}
            onDoubleClick={isMobile ? undefined : goFullscreen}
            onTouchEnd={(e) => {
              // Single touch tap on mobile → handled by onClick via touch
              if (e.changedTouches.length === 1) e.preventDefault();
            }}
          />
          )}

          {/* ── Controls overlay ── */}
          <div
            className="absolute inset-x-0 bottom-0 z-20 px-3 md:px-4 pb-3 md:pb-4 pt-12 md:pt-16 flex flex-col gap-2 md:gap-3 transition-opacity duration-300"
            style={{
              background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
              opacity: (isMobile && isVimeo) ? 0 : (showControls ? 1 : 0),
              pointerEvents: (isMobile && isVimeo) ? "none" : (showControls ? "auto" : "none"),
            }}
            onMouseMove={(e) => e.stopPropagation()}
          >
            {/* ── Progress bar ── */}
            <div
              id="player-progress-bar"
              className="group w-full relative cursor-pointer flex items-center touch-none"
              style={{ height: "20px" }}
              onMouseDown={handleSeekMouseDown}
              onTouchStart={handleSeekTouch}
              onTouchMove={handleSeekTouch}
            >
              {/* Track */}
              <div
                className="absolute inset-x-0 rounded-full transition-all duration-150 group-hover:scale-y-[1.5] origin-center"
                style={{ top: "50%", transform: "translateY(-50%)", height: "3px", background: "rgba(255,255,255,0.2)" }}
              >
                {/* Buffered */}
                {buffered > 0 && (
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-white/30"
                    style={{ width: `${buffered}%` }}
                  />
                )}
                {/* Played */}
                <div
                  className="absolute inset-y-0 left-0 bg-white rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {/* Thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none z-10 transition-opacity duration-150"
                style={{ left: `calc(${progress}% - 7px)` }}
              />
            </div>

            {/* ── Bottom row ── */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Play/Pause */}
              <button
                onClick={doTogglePlay}
                title={isPlaying ? "Pause (Space)" : "Play (Space)"}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors shrink-0 active:scale-90"
              >
                {isPlaying ? <PauseIcon/> : <PlayIcon/>}
              </button>

              {/* Skip back 10s */}
              <button
                onClick={() => doSkip(-10)}
                title="Back 10s (Shift+←)"
                className="hidden md:flex w-8 h-8 items-center justify-center text-white/60 hover:text-white transition-colors shrink-0"
              >
                <Skip10BackIcon/>
              </button>

              {/* Skip fwd 10s */}
              <button
                onClick={() => doSkip(10)}
                title="Forward 10s (Shift+→)"
                className="hidden md:flex w-8 h-8 items-center justify-center text-white/60 hover:text-white transition-colors shrink-0"
              >
                <Skip10FwdIcon/>
              </button>

              {/* Mute toggle */}
              <button
                onClick={doMuteToggle}
                title={isMuted ? "Unmute (M)" : "Mute (M)"}
                className="flex items-center justify-center text-white/60 hover:text-white transition-colors shrink-0 w-7 h-7"
              >
                <VolumeIcon level={effectiveVolume}/>
              </button>

              {/* Volume slider — hidden on mobile */}
              {!isMobile && (
                <input
                  type="range" min="0" max="1" step="0.02"
                  value={effectiveVolume}
                  onChange={(e) => doVolume(parseFloat(e.target.value))}
                  className="w-16 h-1 accent-white cursor-pointer shrink-0"
                />
              )}

              {/* Time */}
              <span className="font-sans text-[10px] md:text-[11px] text-white/50 tabular-nums select-none">
                {fmt(currentTime)} / {fmt(duration)}
              </span>

              {/* Spacer */}
              <div className="flex-1"/>

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
                    <div className="absolute bottom-9 right-0 bg-black/95 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden min-w-[80px] shadow-2xl">
                      {[{ id: "auto", label: "Auto" }, ...qualities].map(q => (
                        <button
                          key={q.id}
                          onClick={() => { vimeo.setQuality(q.id); setShowQuality(false); }}
                          className={`block w-full text-left px-3 py-2 text-[11px] transition-colors hover:bg-white/10 ${activeQuality === q.id ? "text-white font-semibold" : "text-white/60"}`}
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PiP (HTML5 only, desktop) */}
              {!isVimeo && !isMobile && document.pictureInPictureEnabled && (
                <button
                  onClick={html5.requestPiP}
                  title="Picture-in-Picture"
                  className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <PiPIcon/>
                </button>
              )}

              {/* Fullscreen */}
              <button
                onClick={goFullscreen}
                title={isFullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"}
                className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                {isFullscreen ? <ExitFullscreenIcon/> : <EnterFullscreenIcon/>}
              </button>
            </div>

            {/* Fullscreen close / nav overlays */}
            {isFullscreen && (
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {videos.length > 1 && (
                  <>
                    <button onClick={goPrev} disabled={!hasPrev} className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-20 transition-colors bg-black/40 rounded-full">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </button>
                    <button onClick={goNext} disabled={!hasNext} className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-20 transition-colors bg-black/40 rounded-full">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </button>
                  </>
                )}
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors bg-black/40 rounded-full">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
