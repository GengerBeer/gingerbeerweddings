/**
 * useHtml5Player
 * ──────────────
 * Encapsulates all HTML5 <video> element event bindings so VideoModal stays clean.
 *
 * Usage:
 *   const player = useHtml5Player(videoRef, { enabled: !isVimeo });
 */

import { useEffect, useRef, useState, useCallback } from "react";

export interface UseHtml5PlayerResult {
  isPlaying: boolean;
  isBuffering: boolean;
  progress: number;    // 0–100
  currentTime: number; // seconds
  duration: number;    // seconds
  buffered: number;    // 0–100 (loaded buffer end)
  volume: number;      // 0–1
  togglePlay: () => void;
  seek: (ratio: number) => void;
  seekSeconds: (delta: number) => void;
  setVolume: (v: number) => void;
  requestPiP: () => void;
}

export function useHtml5Player(
  videoRef: React.RefObject<HTMLVideoElement>,
  options: { enabled: boolean; videoUrl?: string }
): UseHtml5PlayerResult {
  const { enabled, videoUrl } = options;

  const [isPlaying,   setIsPlaying]   = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [progress,    setProgress]    = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration,    setDuration]    = useState(0);
  const [buffered,    setBuffered]    = useState(0);
  const [volume,      setVolumeState] = useState(1);

  // Mirror for seekSeconds (avoids stale closure)
  const durationRef    = useRef(0);
  const currentTimeRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const el = videoRef.current;
    if (!el) return;

    // Reset
    setIsPlaying(false);
    setIsBuffering(true);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setBuffered(0);
    durationRef.current    = 0;
    currentTimeRef.current = 0;

    const onPlay     = () => { setIsPlaying(true);  setIsBuffering(false); };
    const onPause    = () =>   setIsPlaying(false);
    const onEnded    = () => { setIsPlaying(false); setProgress(0); setCurrentTime(0); };
    const onTime     = () => {
      const ct = el.currentTime;
      const dur = el.duration || 0;
      currentTimeRef.current = ct;
      setCurrentTime(ct);
      setProgress(dur ? (ct / dur) * 100 : 0);

      // Update buffered
      if (el.buffered.length > 0) {
        const bufEnd = el.buffered.end(el.buffered.length - 1);
        setBuffered(dur ? (bufEnd / dur) * 100 : 0);
      }
    };
    const onMeta     = () => {
      setDuration(el.duration);
      durationRef.current = el.duration;
    };
    const onWait     = () => setIsBuffering(true);
    const onCanPlay  = () => setIsBuffering(false);
    const onProgress = () => {
      if (!el.buffered.length || !el.duration) return;
      const bufEnd = el.buffered.end(el.buffered.length - 1);
      setBuffered((bufEnd / el.duration) * 100);
    };
    const onVolumeChange = () => setVolumeState(el.volume);

    el.addEventListener("play",            onPlay);
    el.addEventListener("pause",           onPause);
    el.addEventListener("ended",           onEnded);
    el.addEventListener("timeupdate",      onTime);
    el.addEventListener("loadedmetadata",  onMeta);
    el.addEventListener("waiting",         onWait);
    el.addEventListener("canplay",         onCanPlay);
    el.addEventListener("progress",        onProgress);
    el.addEventListener("volumechange",    onVolumeChange);

    return () => {
      el.removeEventListener("play",           onPlay);
      el.removeEventListener("pause",          onPause);
      el.removeEventListener("ended",          onEnded);
      el.removeEventListener("timeupdate",     onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("waiting",        onWait);
      el.removeEventListener("canplay",        onCanPlay);
      el.removeEventListener("progress",       onProgress);
      el.removeEventListener("volumechange",   onVolumeChange);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, videoRef, videoUrl]);

  const togglePlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.paused ? el.play().catch(() => {}) : el.pause();
  }, [videoRef]);

  const seek = useCallback((ratio: number) => {
    const el = videoRef.current;
    if (!el || !durationRef.current) return;
    const t = ratio * durationRef.current;
    el.currentTime = t;
    currentTimeRef.current = t;
    setCurrentTime(t);
    setProgress(ratio * 100);
  }, [videoRef]);

  const seekSeconds = useCallback((delta: number) => {
    const el = videoRef.current;
    if (!el || !durationRef.current) return;
    const next = Math.max(0, Math.min(durationRef.current, currentTimeRef.current + delta));
    el.currentTime = next;
    currentTimeRef.current = next;
    setCurrentTime(next);
    setProgress((next / durationRef.current) * 100);
  }, [videoRef]);

  const setVolume = useCallback((v: number) => {
    const el = videoRef.current;
    if (!el) return;
    el.volume = v;
    setVolumeState(v);
  }, [videoRef]);

  const requestPiP = useCallback(async () => {
    const el = videoRef.current;
    if (!el) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (el.requestPictureInPicture) {
        await el.requestPictureInPicture();
      }
    } catch {
      // PiP not supported or blocked
    }
  }, [videoRef]);

  return {
    isPlaying,
    isBuffering,
    progress,
    currentTime,
    duration,
    buffered,
    volume,
    togglePlay,
    seek,
    seekSeconds,
    setVolume,
    requestPiP,
  };
}
