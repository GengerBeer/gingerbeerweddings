import { useState, useEffect, useRef } from "react";
import { X, Play } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";

const heroVideos = {
  left: { title: "The Ceremony", videoUrl: "/video/4.mov" },
  right: { title: "Emma & James", videoUrl: "/video/Rider.mp4" }
};



export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<any>(null);

  // Refs for cursor-tracking — avoids React re-renders on every mousemove
  const leftBtnRef = useRef<HTMLDivElement>(null);
  const rightBtnRef = useRef<HTMLDivElement>(null);
  const leftImgRef = useRef<HTMLImageElement>(null);
  const rightImgRef = useRef<HTMLImageElement>(null);

  const handleCardEnter = (side: "left" | "right") => {
    const img = side === "left" ? leftImgRef.current : rightImgRef.current;
    const btn = side === "left" ? leftBtnRef.current : rightBtnRef.current;
    if (img) { img.style.filter = "grayscale(0%)"; img.style.scale = "1.05"; }
    if (btn) btn.style.opacity = "1";
  };

  const handleCardLeave = (side: "left" | "right") => {
    const img = side === "left" ? leftImgRef.current : rightImgRef.current;
    const btn = side === "left" ? leftBtnRef.current : rightBtnRef.current;
    const defaultFilter = side === "left" ? "grayscale(100%) contrast(110%)" : "grayscale(10%)";
    if (img) { img.style.filter = defaultFilter; img.style.scale = "1"; }
    if (btn) btn.style.opacity = "0";
  };

  const handleCardMove = (e: React.MouseEvent<HTMLDivElement>, side: "left" | "right") => {
    // Disable tracking on touch devices so it stays centered
    if (window.matchMedia("(hover: none)").matches) return;

    const btn = side === "left" ? leftBtnRef.current : rightBtnRef.current;
    if (!btn) return;
    const rect = e.currentTarget.getBoundingClientRect();
    btn.style.left = `${e.clientX - rect.left}px`;
    btn.style.top = `${e.clientY - rect.top}px`;
  };

  const openVideo = (video: any) => {
    setActiveVideo(video);
    setLightboxOpen(true);
  };

  const closeVideo = () => {
    setLightboxOpen(false);
    setActiveVideo(null);
  };

  // Parallax on scroll
  useEffect(() => {
    const el = sectionRef.current?.querySelector(".hero-bg") as HTMLElement | null;
    if (!el) return;
    const applyTransform = () => {
      const y = window.scrollY;
      el.style.transform = `translateY(${y * 0.3}px) scale(1.1)`;
    };
    applyTransform();
    window.addEventListener("scroll", applyTransform, { passive: true });
    return () => window.removeEventListener("scroll", applyTransform);
  }, []);

  // Interactive mouse parallax for floating photos
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const leftImg = section.querySelector(".parallax-left") as HTMLElement | null;
    const rightImg = section.querySelector(".parallax-right") as HTMLElement | null;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const xPos = (clientX / innerWidth) - 0.5;
      const yPos = (clientY / innerHeight) - 0.5;

      if (leftImg) {
        // Move left image with a dynamic offset
        leftImg.style.transform = `translate(${xPos * 25}px, ${yPos * 25}px) rotate(-6deg)`;
      }
      if (rightImg) {
        // Move right image in slightly different way
        rightImg.style.transform = `translate(${xPos * -35}px, ${yPos * -15}px) rotate(3deg)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[640px] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background with parallax */}
      <div
        className="hero-bg absolute inset-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />

      {/* Cinematic overlay */}
      <div className="absolute inset-0 hero-overlay" aria-hidden="true" />

      {/* Animated gradient orbs */}
      <div
        className="orb orb-1 absolute w-[500px] h-[500px] -top-24 -left-24 animate-float"
        aria-hidden="true"
      />
      <div
        className="orb orb-2 absolute w-[400px] h-[400px] bottom-32 -right-16 animate-float"
        style={{ animationDelay: "-3s" }}
        aria-hidden="true"
      />
      <div
        className="orb orb-3 absolute w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float"
        style={{ animationDelay: "-6s" }}
        aria-hidden="true"
      />

      {/* Main content grid */}
      <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-between py-12 md:py-20 lg:py-24">

        {/* Top Spacer */}
        <div className="h-10" />

        {/* Center: Editorial Layout Title with Staggered Cascading */}
        <div className="flex-1 flex flex-col justify-center items-center relative lg:mt-[-4vh]">

          <div className="relative z-30 w-full flex flex-col items-center pointer-events-none">

            <div className="relative flex flex-col items-start text-left">

              {/* Left Parallax Card - Anchored internally to the typography container */}
              <div
                className="parallax-left absolute w-[30vw] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl animate-fade-in z-20 border border-brand-cream/10 transition-transform duration-700 ease-out isolate pointer-events-auto"
                style={{
                  top: "0%",
                  left: "-18%",
                  animationDelay: "0.5s",
                  transform: "translate(10px, -10px) rotate(-6deg)",
                  willChange: "transform",
                  WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                  cursor: "none",
                }}
                onClick={() => openVideo(heroVideos.left)}
                onMouseEnter={() => handleCardEnter("left")}
                onMouseLeave={() => handleCardLeave("left")}
                onMouseMove={(e) => handleCardMove(e, "left")}
              >
                <img
                  ref={leftImgRef}
                  src={portfolio2}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "translateZ(0)",
                    transition: "filter 0.5s ease, scale 0.5s ease",
                    filter: "grayscale(100%) contrast(110%)",
                    scale: "1",
                  }}
                />
                <div
                  ref={leftBtnRef}
                  className="absolute pointer-events-none rounded-full"
                  style={{
                    width: "clamp(48px, 5vw, 64px)", height: "clamp(48px, 5vw, 64px)",
                    left: "50%", top: "50%",
                    transform: "translate(-50%, -50%)",
                    opacity: 0.7,
                    transition: "opacity 0.25s ease, left 0.1s ease-out, top 0.1s ease-out",
                    background: "linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 100%)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    border: "1px solid rgba(255,255,255,0.4)",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.2), inset 0 1.5px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(155deg, rgba(255,255,255,0.3) 0%, transparent 40%)" }} />
                  <div className="w-full h-full flex items-center justify-center">
                    <Play size={20} className="text-white relative z-10 drop-shadow" style={{ marginLeft: 2 }} fill="currentColor" />
                  </div>
                </div>
              </div>

              {/* Right Color Image - Anchored internally to the typography container */}
              <div
                className="parallax-right absolute w-[36vw] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl animate-fade-in z-20 border border-brand-cream/10 transition-transform duration-700 ease-out isolate pointer-events-auto"
                style={{
                  top: "20%",
                  right: "-20%",
                  transform: "translate(-15px, 5px) rotate(3deg)",
                  willChange: "transform",
                  WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                  cursor: "none",
                }}
                onClick={() => openVideo(heroVideos.right)}
                onMouseEnter={() => handleCardEnter("right")}
                onMouseLeave={() => handleCardLeave("right")}
                onMouseMove={(e) => handleCardMove(e, "right")}
              >
                <img
                  ref={rightImgRef}
                  src={portfolio1}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "translateZ(0)",
                    transition: "filter 0.5s ease, scale 0.5s ease",
                    filter: "grayscale(10%)",
                    scale: "1",
                  }}
                />
                <div
                  ref={rightBtnRef}
                  className="absolute pointer-events-none rounded-full"
                  style={{
                    width: "clamp(56px, 6vw, 80px)", height: "clamp(56px, 6vw, 80px)",
                    left: "50%", top: "50%",
                    transform: "translate(-50%, -50%)",
                    opacity: 0.7,
                    transition: "opacity 0.25s ease, left 0.1s ease-out, top 0.1s ease-out",
                    background: "linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 100%)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    border: "1px solid rgba(255,255,255,0.4)",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.2), inset 0 1.5px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(155deg, rgba(255,255,255,0.3) 0%, transparent 40%)" }} />
                  <div className="w-full h-full flex items-center justify-center">
                    <Play size={24} className="text-white relative z-10 drop-shadow" style={{ marginLeft: 3 }} fill="currentColor" />
                  </div>
                </div>
              </div>

              {/* Staggered text (Using responsive VW only, no breakpoints) */}
              <h1
                className="font-serif text-[10vw] text-brand-cream font-extrabold leading-[0.82] tracking-tight animate-fade-up drop-shadow-[0_2px_15px_rgba(0,0,0,0.4)] relative z-30 pointer-events-none"
                style={{ animationDelay: "0.2s" }}
              >
                Cinematic
              </h1>

              <h2
                className="font-serif text-[10vw] text-brand-cream font-extrabold leading-[0.82] tracking-tight animate-fade-up mt-1 md:mt-2 ml-[10vw] drop-shadow-[0_2px_15px_rgba(0,0,0,0.4)] relative z-30 pointer-events-none"
                style={{ animationDelay: "0.4s" }}
              >
                Wedding
              </h2>

              <div className="flex flex-col animate-fade-up mt-1 md:mt-2 ml-[35vw] relative z-30 pointer-events-none" style={{ animationDelay: "0.6s" }}>
                <h2 className="font-serif text-[10vw] text-brand-cream font-extrabold leading-[0.82] tracking-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.4)]">
                  Films
                </h2>
              </div>
            </div>

            <div className="w-full flex justify-center mt-8 md:mt-12 animate-fade-in" style={{ animationDelay: "1.2s" }}>
              <span className="font-script text-brand-sand text-[11vw] md:text-7xl lg:text-8xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)] block leading-none whitespace-nowrap">
                That Feel Like You
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Clean Layout */}
        <div className="relative z-30 w-full flex flex-col md:flex-row items-end justify-between gap-4 lg:gap-8 animate-fade-in" style={{ animationDelay: "1.2s" }}>

          <div className="max-w-[320px]">
            <p className="font-sans text-brand-cream/60 text-[10px] uppercase tracking-[0.2em] leading-relaxed">
              We craft emotional, timeless wedding edits for modern couples and filmmakers worldwide.
            </p>
          </div>

          <div className="flex flex-row items-center gap-4">
            <a href="#portfolio" className="btn-primary py-3 px-8 text-[11px]">
              View Our Work
            </a>
            <a href="#contact" className="btn-outline-light py-3 px-8 text-[11px]">
              Get in Touch
            </a>
          </div>
        </div>
      </div>

      {/* Video Lightbox (Reusing styles from Portfolio) */}
      {lightboxOpen && activeVideo && (
        <div
          className="fixed inset-0 z-[100] bg-brand-dark/96 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeVideo}
        >
          <button
            className="absolute top-6 right-6 text-brand-cream/70 hover:text-brand-cream transition-colors z-[110]"
            onClick={closeVideo}
            aria-label="Close"
          >
            <X size={32} />
          </button>

          <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {activeVideo.vimeoId ? (
              <div className="relative aspect-video w-full bg-brand-burgundy overflow-hidden rounded-2xl shadow-2xl border border-brand-cream/10 animate-scale-in">
                <iframe
                  src={`https://player.vimeo.com/video/${activeVideo.vimeoId}?autoplay=1&title=0&byline=0&portrait=0`}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="relative aspect-video w-full bg-black rounded-2xl border border-brand-cream/10 overflow-hidden shadow-2xl animate-scale-in">
                <video
                  src={activeVideo.videoUrl}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  controls
                  playsInline
                />
              </div>
            )}
            <div className="mt-6 text-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <p className="font-serif text-brand-cream text-2xl font-extrabold uppercase tracking-widest">{activeVideo.title}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
