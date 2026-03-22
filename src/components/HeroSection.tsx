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

          <div
            className="parallax-left absolute top-[15%] md:top-[10%] left-0 lg:left-[-10%] xl:left-[-15%] 2xl:left-[-20%] w-[25vw] md:w-[22vw] lg:w-[20vw] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl animate-fade-in z-20 border border-brand-cream/10 hidden md:block transition-transform duration-700 ease-out isolate"
            style={{
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
                width: 64, height: 64,
                left: 0, top: 0,
                transform: "translate(-50%, -50%)",
                opacity: 0,
                transition: "opacity 0.25s ease",
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

          {/* Right Color Image */}
          <div
            className="parallax-right absolute top-[25%] md:top-[12%] right-0 lg:right-[-10%] xl:right-[-15%] 2xl:right-[-20%] w-[32vw] md:w-[28vw] lg:w-[28vw] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl animate-fade-in z-20 border border-brand-cream/10 hidden md:block transition-transform duration-700 ease-out isolate"
            style={{
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
                width: 80, height: 80,
                left: 0, top: 0,
                transform: "translate(-50%, -50%)",
                opacity: 0,
                transition: "opacity 0.25s ease",
                background: "linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 100%)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.4)",
                boxShadow: "0 2px 16px rgba(0,0,0,0.2), inset 0 1.5px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(255,255,255,0.08)",
              }}
            >
              <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(155deg, rgba(255,255,255,0.3) 0%, transparent 40%)" }} />
              <div className="w-full h-full flex items-center justify-center">
                <Play size={26} className="text-white relative z-10 drop-shadow" style={{ marginLeft: 3 }} fill="currentColor" />
              </div>
            </div>
          </div>

          <div className="relative z-30 w-full flex flex-col items-center pointer-events-none text-left">
            <div className="mx-auto flex flex-col items-start w-fit">
              <h1
                className="font-serif text-[15vw] md:text-[10vw] lg:text-[8.5vw] text-brand-cream font-extrabold leading-[0.82] tracking-tight animate-fade-up drop-shadow-[0_2px_15px_rgba(0,0,0,0.4)]"
                style={{ animationDelay: "0.2s" }}
              >
                Cinematic
              </h1>

              <h2
                className="font-serif text-[15vw] md:text-[10vw] lg:text-[8.5vw] text-brand-cream font-extrabold leading-[0.82] tracking-tight animate-fade-up mt-1 lg:mt-2 ml-[12vw] md:ml-[10vw] lg:ml-[15vw] drop-shadow-[0_2px_15px_rgba(0,0,0,0.4)]"
                style={{ animationDelay: "0.4s" }}
              >
                Wedding
              </h2>

              <h2
                className="font-serif text-[15vw] md:text-[10vw] lg:text-[8.5vw] text-brand-cream font-extrabold leading-[0.82] tracking-tight animate-fade-up mt-1 lg:mt-2 ml-[24vw] md:ml-[26vw] lg:ml-[35vw] drop-shadow-[0_2px_15px_rgba(0,0,0,0.4)]"
                style={{ animationDelay: "0.6s" }}
              >
                Films
              </h2>
            </div>

            <div className="w-full flex justify-center mt-8 lg:mt-12 animate-fade-in" style={{ animationDelay: "1.2s" }}>
              <span className="font-script text-brand-sand text-5xl md:text-6xl lg:text-8xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)] block leading-none whitespace-nowrap">
                we edit. you book another wedding.
              </span>
            </div>

            {/* Mobile-only Images (simplified vertical layout) */}
            <div className="md:hidden flex w-full max-w-sm mx-auto justify-between gap-4 mt-12 pointer-events-auto">
              <div 
                className="w-1/2 aspect-[3/4] rounded-lg overflow-hidden shadow-xl -rotate-2 border border-brand-cream/10 cursor-pointer"
                onClick={() => openVideo(heroVideos.left)}
              >
                <img src={portfolio2} alt="" className="w-full h-full object-cover grayscale-[100%]" />
              </div>
              <div 
                className="w-1/2 aspect-[4/3] rounded-lg overflow-hidden shadow-xl rotate-3 mt-8 border border-brand-cream/10 cursor-pointer"
                onClick={() => openVideo(heroVideos.right)}
              >
                <img src={portfolio1} alt="" className="w-full h-full object-cover grayscale-[10%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Clean Layout */}
        <div className="w-full flex flex-col md:flex-row items-center md:items-end justify-between gap-6 md:gap-0 animate-fade-in text-center md:text-left mt-8 md:mt-0" style={{ animationDelay: "1.2s" }}>

          <div className="max-w-[340px]">
            <p className="font-sans text-brand-cream/60 text-[10px] uppercase tracking-[0.2em] leading-relaxed mx-auto md:mx-0">
              Every wedding you outsource to us is a weekend back with your family — or another $3K booking on your calendar.
            </p>
          </div>

          <div className="flex flex-row items-center justify-center gap-4 w-full md:w-auto">
            <a href="#contact" className="btn-primary py-3 px-6 md:px-8 text-[11px] whitespace-nowrap">
              Get Your Free Test Edit
            </a>
            <a href="#portfolio" className="btn-outline-light py-3 px-6 md:px-8 text-[11px] whitespace-nowrap">
              See Our Work
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
