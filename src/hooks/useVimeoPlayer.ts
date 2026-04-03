/**
 * useVimeoPlayer
 * ──────────────
 * Encapsulates all Vimeo Player SDK logic so VideoModal stays clean.
 *
 * What it does:
 *  1. Loads the Vimeo SDK script once (idempotent).
 *  2. Attaches a Player instance to the provided iframe ref.
 *  3. Exposes playback state + control callbacks.
 *  4. Cleans up properly on unmount / video change.
 *
 * Usage:
 *   const player = useVimeoPlayer(iframeRef, { enabled: isVimeo });
 */

import { useEffect, useRef, useState, useCallback } from "react";

declare global {
  interface Window {
    Vimeo: {
      Player: new (el: HTMLIFrameElement) => VimeoPlayerInstance;
    };
  }
}

interface VimeoPlayerInstance {
  on(event: string, cb: (data?: any) => void): void;
  off(event: string): void;
  play(): Promise<void>;
  pause(): Promise<void>;
  setCurrentTime(seconds: number): Promise<void>;
  setVolume(volume: number): Promise<void>;
  setQuality(quality: string): Promise<void>;
  getVolume(): Promise<number>;
  getDuration(): Promise<number>;
  getQualities(): Promise<{ id: string; label: string; active: boolean }[]>;
  getQuality(): Promise<string>;
  destroy(): Promise<void>;
}

export interface VimeoQuality {
  id: string;
  label: string;
  active: boolean;
}

export interface UseVimeoPlayerResult {
  isReady: boolean;
  isPlaying: boolean;
  isBuffering: boolean;
  progress: number;      // 0–100
  currentTime: number;   // seconds
  duration: number;      // seconds
  volume: number;        // 0–1
  qualities: VimeoQuality[];
  activeQuality: string;
  togglePlay: () => void;
  seek: (ratio: number) => void;       // ratio 0–1
  seekSeconds: (delta: number) => void; // skip ±N seconds
  setVolume: (v: number) => void;
  setQuality: (id: string) => void;
}

// ── Load SDK once, globally ──────────────────────────────────────────────────
let sdkLoadStarted = false;
const EARLY_ADVANCE_THRESHOLD_SECONDS = 0.25;

function normalizeQualities(list: VimeoQuality[]): VimeoQuality[] {
  const seen = new Set<string>();

  return list.filter((quality) => {
    const id = quality.id.trim().toLowerCase();

    if (!id || id === "auto" || seen.has(id)) return false;

    seen.add(id);
    return true;
  });
}

function loadVimeoSDK(): void {
  if (sdkLoadStarted || window.Vimeo) return;
  sdkLoadStarted = true;
  const script = document.createElement("script");
  script.id    = "vimeo-player-sdk";
  script.src   = "https://player.vimeo.com/api/player.js";
  script.async = true;
  document.head.appendChild(script);
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useVimeoPlayer(
  iframeRef: React.RefObject<HTMLIFrameElement>,
  options: { enabled: boolean; videoId?: string; onEndEarly?: () => void; initialVolume?: number }
): UseVimeoPlayerResult {
  const { enabled, videoId, onEndEarly, initialVolume } = options;

  const playerRef    = useRef<VimeoPlayerInstance | null>(null);
  const cancelledRef = useRef(false);
  const durationRef  = useRef(0); // mirror for seekSeconds without stale closure

  const [isReady,       setIsReady]       = useState(false);
  const [isPlaying,     setIsPlaying]     = useState(false);
  const [isBuffering,   setIsBuffering]   = useState(false);
  const [progress,      setProgress]      = useState(0);
  const [currentTime,   setCurrentTime]   = useState(0);
  const [duration,      setDuration]      = useState(0);
  const [volume,        setVolumeState]   = useState(1);
  const [qualities,     setQualities]     = useState<VimeoQuality[]>([]);
  const [activeQuality, setActiveQuality] = useState("auto");

  // Load SDK as soon as hook is used
  useEffect(() => {
    if (enabled) loadVimeoSDK();
  }, [enabled]);

  // Attach player when enabled / index changes
  useEffect(() => {
    if (!enabled) return;

    cancelledRef.current = false;
    playerRef.current    = null;
    durationRef.current  = 0;

    // Reset state for the new video
    setIsReady(false);
    setIsPlaying(false);
    setIsBuffering(true);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setQualities([]);
    setActiveQuality("auto");

    let attempts = 0;
    const MAX_ATTEMPTS = 50; // 50 × 200ms = 10s max wait
    let hasEndedEarly = false;

    const attach = () => {
      if (cancelledRef.current) return;

      if (!iframeRef.current || !window.Vimeo?.Player) {
        if (++attempts < MAX_ATTEMPTS) {
          setTimeout(attach, 200);
        } else {
          console.warn("[useVimeoPlayer] SDK or iframe not ready after 10s");
        }
        return;
      }

      const player = new window.Vimeo.Player(iframeRef.current);
      const startingVolume = typeof initialVolume === "number"
        ? Math.max(0, Math.min(1, initialVolume))
        : null;

      playerRef.current = player;

      if (startingVolume !== null) {
        setVolumeState(startingVolume);
        player.setVolume(startingVolume).catch(() => {});
      }

      player.on("play",        () => { if (!cancelledRef.current) { setIsPlaying(true);  setIsBuffering(false); } });
      player.on("pause",       () => { if (!cancelledRef.current)   setIsPlaying(false); });
      player.on("ended",       () => {
        if (!cancelledRef.current) {
          setIsPlaying(false);
          setProgress(0);
          setCurrentTime(0);

          if (onEndEarly && !hasEndedEarly) {
            hasEndedEarly = true;
            onEndEarly();
          }
        }
      });
      player.on("timeupdate",  (d: { seconds: number; percent: number }) => {
        if (!cancelledRef.current) {
          setCurrentTime(d.seconds);
          setProgress(d.percent * 100);

          if (onEndEarly && durationRef.current > 0 && !hasEndedEarly) {
            if (durationRef.current - d.seconds <= EARLY_ADVANCE_THRESHOLD_SECONDS) {
              hasEndedEarly = true;
              onEndEarly();
            }
          }
        }
      });
      player.on("volumechange", (d: { volume?: number }) => {
        if (!cancelledRef.current && typeof d?.volume === "number") {
          setVolumeState(d.volume);
        }
      });
      player.on("qualitychange", (d: { quality?: string }) => {
        if (!cancelledRef.current && d?.quality) {
          setActiveQuality(d.quality);
        }
      });
      player.on("bufferstart", () => { if (!cancelledRef.current) setIsBuffering(true);  });
      player.on("bufferend",   () => { if (!cancelledRef.current) setIsBuffering(false); });

      player.getDuration()
        .then((d) => {
          if (!cancelledRef.current) {
            setDuration(d);
            durationRef.current = d;
          }
        })
        .catch(() => {});

      player.getVolume()
        .then((v) => {
          if (!cancelledRef.current && typeof v === "number") {
            setVolumeState(v);
          }
        })
        .catch(() => {});

      player.getQualities()
        .then((q) => {
          if (!cancelledRef.current && q?.length) {
            setQualities(normalizeQualities(q));
          }
        })
        .catch(() => {});

      player.getQuality()
        .then((quality) => {
          if (!cancelledRef.current && quality) {
            setActiveQuality(quality);
          }
        })
        .catch(() => {});

      setIsReady(true);
    };

    // Small delay to ensure the iframe is fully mounted in the DOM
    // iOS Safari needs a longer delay for the SDK to establish postMessage channel
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setTimeout(attach, isSafari ? 800 : 150);

    return () => {
      cancelledRef.current = true;
      playerRef.current?.pause().catch(() => {});
      playerRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, iframeRef, videoId]);

  // ── Controls ───────────────────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    isPlaying ? p.pause().catch(() => {}) : p.play().catch(() => {});
  }, [isPlaying]);

  const seek = useCallback((ratio: number) => {
    const p = playerRef.current;
    if (!p || !durationRef.current) return;
    const t = ratio * durationRef.current;
    p.setCurrentTime(t).catch(() => {});
    setProgress(ratio * 100);
    setCurrentTime(t);
  }, []);

  const seekSeconds = useCallback((delta: number) => {
    const p = playerRef.current;
    if (!p || !durationRef.current) return;
    setCurrentTime((prev) => {
      const next = Math.max(0, Math.min(durationRef.current, prev + delta));
      p.setCurrentTime(next).catch(() => {});
      setProgress((next / durationRef.current) * 100);
      return next;
    });
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    playerRef.current?.setVolume(v).catch(() => {});
  }, []);

  const setQuality = useCallback((id: string) => {
    setActiveQuality(id);
    setIsBuffering(true);
    playerRef.current?.setQuality(id).catch(() => {});
  }, []);

  return {
    isReady,
    isPlaying,
    isBuffering,
    progress,
    currentTime,
    duration,
    volume,
    qualities,
    activeQuality,
    togglePlay,
    seek,
    seekSeconds,
    setVolume,
    setQuality,
  };
}
