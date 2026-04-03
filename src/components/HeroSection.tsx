import { useState, useEffect, useRef } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import VideoModal from "@/components/VideoModal";

const heroVideos = [
  { vimeoId: "1172328822", title: "Sophie & Sean - Teaser", fallbackThumb: portfolio2 },
  { vimeoId: "1172303225", title: "Dewi & Melvin", fallbackThumb: portfolio1 },
];

interface HeroVideoMeta {
  thumb: string;
  title: string;
}

const HERO_HOVER_BUTTON_SIZE = 64;

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [heroMetas, setHeroMetas] = useState<(HeroVideoMeta | null)[]>(heroVideos.map(() => null));

  const leftBtnRef = useRef<HTMLDivElement>(null);
  const rightBtnRef = useRef<HTMLDivElement>(null);
  const leftImgRef = useRef<HTMLImageElement>(null);
  const rightImgRef = useRef<HTMLImageElement>(null);

  const handleCardEnter = (side: "left" | "right") => {
    const img = side === "left" ? leftImgRef.current : rightImgRef.current;
    const btn = side === "left" ? leftBtnRef.current : rightBtnRef.current;
    if (img) { img.style.filter = "grayscale(0%)"; img.style.scale = "1.05"; }
    if (btn) { btn.style.opacity = "1"; btn.style.scale = "1.1"; }
  };

  const handleCardLeave = (side: "left" | "right") => {
    const img = side === "left" ? leftImgRef.current : rightImgRef.current;
    const btn = side === "left" ? leftBtnRef.current : rightBtnRef.current;
    const defaultFilter = side === "left" ? "grayscale(100%) contrast(110%)" : "grayscale(10%)";
    if (img) { img.style.filter = defaultFilter; img.style.scale = "1"; }
    if (btn) { btn.style.opacity = "0"; btn.style.scale = "1"; }
  };

  const handleCardMove = (e: React.MouseEvent<HTMLDivElement>, side: "left" | "right") => {
    const btn = side === "left" ? leftBtnRef.current : rightBtnRef.current;
    if (!btn) return;
    const rect = e.currentTarget.getBoundingClientRect();
    btn.style.left = `${e.clientX - rect.left}px`;
    btn.style.top = `${e.clientY - rect.top}px`;
  };

  const openVideo = (idx: number) => setActiveIndex(idx);

  useEffect(() => {
    heroVideos.forEach((video, i) => {
      fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${video.vimeoId}&width=1280`)
        .then((r) => r.json())
        .then((data) => {
          if (data?.thumbnail_url) {
            setHeroMetas((prev) => {
              const next = [...prev];
              next[i] = {
                thumb: data.thumbnail_url,
                title: data.title ?? video.title,
              };
              return next;
            });
          }
        })
        .catch(() => {});
    });
  }, []);

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

    const leftImg  = section.querySelector(".parallax-left")  as HTMLElement | null;
    const rightImg = section.querySelector(".parallax-right") as HTMLElement | null;

    const handleMouseMove = (e: MouseEvent) => {
      const xPos = (e.clientX / window.innerWidth)  - 0.5;
      const yPos = (e.clientY / window.innerHeight) - 0.5;
      if (leftImg)  leftImg.style.transform  = `translate(${xPos * 25}px, ${yPos * 25}px) rotate(-6deg)`;
      if (rightImg) rightImg.style.transform = `translate(${xPos * -35}px, ${yPos * -15}px) rotate(3deg)`;
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
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        aria-hidden="true"
      />

      {/* Cinematic overlay */}
      <div className="absolute inset-0 hero-overlay" aria-hidden="true" />

      {/* Animated gradient orbs */}
      <div className="orb orb-1 absolute w-[500px] h-[500px] -top-24 -left-24 animate-float" aria-hidden="true" />
      <div className="orb orb-2 absolute w-[400px] h-[400px] bottom-32 -right-16 animate-float" style={{ animationDelay: "-3s" }} aria-hidden="true" />
      <div className="orb orb-3 absolute w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float" style={{ animationDelay: "-6s" }} aria-hidden="true" />

      {/* Main content grid */}
      <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-between py-12 md:py-20 lg:py-24">

        <div className="h-10" />

        <div className="flex-1 flex flex-col justify-center items-center relative lg:mt-[-4vh]">

          {/* Left floating card */}
          <div
            className="parallax-left absolute top-[15%] md:top-[10%] left-0 lg:left-[-10%] xl:left-[-15%] 2xl:left-[-20%] w-[25vw] md:w-[22vw] lg:w-[20vw] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl animate-fade-in z-20 border border-brand-cream/10 hidden md:block transition-transform duration-700 ease-out isolate"
            style={{ animationDelay: "0.5s", transform: "translate(10px, -10px) rotate(-6deg)", willChange: "transform", WebkitMaskImage: "-webkit-radial-gradient(white, black)", cursor: "none" }}
            onClick={() => openVideo(0)}
            onMouseEnter={() => handleCardEnter("left")}
            onMouseLeave={() => handleCardLeave("left")}
            onMouseMove={(e) => handleCardMove(e, "left")}
          >
            <img ref={leftImgRef} src={heroMetas[0]?.thumb ?? heroVideos[0].fallbackThumb} alt={heroMetas[0]?.title ?? heroVideos[0].title} className="w-full h-full object-cover"
              style={{ backfaceVisibility: "hidden", transform: "translateZ(0)", transition: "filter 0.5s ease, scale 0.5s ease", filter: "grayscale(100%) contrast(110%)", scale: "1" }}
            />
            <div ref={leftBtnRef} className="absolute pointer-events-none rounded-full"
              style={{ width: HERO_HOVER_BUTTON_SIZE, height: HERO_HOVER_BUTTON_SIZE, left: 0, top: 0, transform: "translate(-50%, -50%)", opacity: 0, transition: "opacity 0.25s ease", background: "linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 100%)", backdropFilter: "blur(20px) saturate(180%)", WebkitBackdropFilter: "blur(20px) saturate(180%)", border: "1px solid rgba(255,255,255,0.4)", boxShadow: "0 2px 16px rgba(0,0,0,0.2), inset 0 1.5px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(255,255,255,0.08)" }}
            >
              <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(155deg, rgba(255,255,255,0.3) 0%, transparent 40%)" }} />
              <div className="w-full h-full flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="relative z-10 translate-x-0.5 text-white drop-shadow"><path d="M6 4.5L19.5 12 6 19.5V4.5Z" fill="currentColor"/></svg>
              </div>
            </div>
          </div>

          {/* Right floating card */}
          <div
            className="parallax-right absolute top-[25%] md:top-[12%] right-0 lg:right-[-10%] xl:right-[-15%] 2xl:right-[-20%] w-[32vw] md:w-[28vw] lg:w-[28vw] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl animate-fade-in z-20 border border-brand-cream/10 hidden md:block transition-transform duration-700 ease-out isolate"
            style={{ transform: "translate(-15px, 5px) rotate(3deg)", willChange: "transform", WebkitMaskImage: "-webkit-radial-gradient(white, black)", cursor: "none" }}
            onClick={() => openVideo(1)}
            onMouseEnter={() => handleCardEnter("right")}
            onMouseLeave={() => handleCardLeave("right")}
            onMouseMove={(e) => handleCardMove(e, "right")}
          >
            <img ref={rightImgRef} src={heroMetas[1]?.thumb ?? heroVideos[1].fallbackThumb} alt={heroMetas[1]?.title ?? heroVideos[1].title} className="w-full h-full object-cover"
              style={{ backfaceVisibility: "hidden", transform: "translateZ(0)", transition: "filter 0.5s ease, scale 0.5s ease", filter: "grayscale(10%)", scale: "1" }}
            />
            <div ref={rightBtnRef} className="absolute pointer-events-none rounded-full"
              style={{ width: HERO_HOVER_BUTTON_SIZE, height: HERO_HOVER_BUTTON_SIZE, left: 0, top: 0, transform: "translate(-50%, -50%)", opacity: 0, transition: "opacity 0.25s ease", background: "linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 100%)", backdropFilter: "blur(20px) saturate(180%)", WebkitBackdropFilter: "blur(20px) saturate(180%)", border: "1px solid rgba(255,255,255,0.4)", boxShadow: "0 2px 16px rgba(0,0,0,0.2), inset 0 1.5px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(255,255,255,0.08)" }}
            >
              <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(155deg, rgba(255,255,255,0.3) 0%, transparent 40%)" }} />
              <div className="w-full h-full flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="relative z-10 translate-x-0.5 text-white drop-shadow"><path d="M6 4.5L19.5 12 6 19.5V4.5Z" fill="currentColor"/></svg>
              </div>
            </div>
          </div>

          <div className="relative z-30 w-full flex flex-col items-center pointer-events-none text-left">
            <div className="mx-auto flex flex-col items-center w-full px-4 mb-2 lg:mb-4">
              <h1
                className="font-serif text-[9.5vw] sm:text-[8.5vw] md:text-[7vw] lg:text-[5.5vw] xl:text-[5vw] text-brand-cream font-extrabold leading-[1.1] md:leading-[1] tracking-tight animate-fade-up drop-shadow-[0_2px_15px_rgba(0,0,0,0.4)] whitespace-nowrap -translate-x-[4vw] md:-translate-x-[6vw] lg:-translate-x-[8vw]"
                style={{ animationDelay: "0.2s" }}
              >
                Your Editing Team.
              </h1>
              <h2
                className="font-serif text-[9.5vw] sm:text-[8.5vw] md:text-[7vw] lg:text-[5.5vw] xl:text-[5vw] text-brand-cream font-extrabold leading-[1] tracking-tight animate-fade-up mt-1 md:mt-2 translate-x-[4vw] md:translate-x-[6vw] lg:translate-x-[8vw] drop-shadow-[0_2px_15px_rgba(0,0,0,0.4)] whitespace-nowrap"
                style={{ animationDelay: "0.4s" }}
              >
                Without the Salary.
              </h2>
            </div>

            <div className="w-full flex justify-center mt-8 lg:mt-12 animate-fade-in" style={{ animationDelay: "1.2s" }}>
              <span className="font-script text-brand-sand text-4xl sm:text-5xl md:text-6xl lg:text-[4.8rem] drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)] block leading-[1.25] md:leading-none text-center whitespace-normal md:whitespace-nowrap">
                We edit. <br className="block md:hidden" /> You book another wedding.
              </span>
            </div>

            {/* Mobile-only images */}
            <div className="md:hidden flex w-full max-w-sm mx-auto justify-between gap-4 mt-12 pointer-events-auto">
              <div className="relative w-1/2 aspect-[3/4] rounded-lg overflow-hidden shadow-xl -rotate-2 border border-brand-cream/10 cursor-pointer group" onClick={() => openVideo(0)}>
                <img src={heroMetas[0]?.thumb ?? heroVideos[0].fallbackThumb} alt={heroMetas[0]?.title ?? heroVideos[0].title} className="w-full h-full object-cover grayscale-[100%] transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-brand-dark/20 transition-opacity duration-300 group-hover:opacity-0" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 100%)", backdropFilter: "blur(20px) saturate(180%)", WebkitBackdropFilter: "blur(20px) saturate(180%)", border: "1px solid rgba(255,255,255,0.35)", boxShadow: "0 2px 16px rgba(0,0,0,0.25), inset 0 1.5px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.08)" }}
                >
                  <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(155deg, rgba(255,255,255,0.28) 0%, transparent 40%)" }} />
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="relative z-10 translate-x-0.5 text-white drop-shadow"><path d="M6 4.5L19.5 12 6 19.5V4.5Z" fill="currentColor"/></svg>
                </div>
              </div>
              <div className="relative w-1/2 aspect-[4/3] rounded-lg overflow-hidden shadow-xl rotate-3 mt-8 border border-brand-cream/10 cursor-pointer group" onClick={() => openVideo(1)}>
                <img src={heroMetas[1]?.thumb ?? heroVideos[1].fallbackThumb} alt={heroMetas[1]?.title ?? heroVideos[1].title} className="w-full h-full object-cover grayscale-[10%] transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-brand-dark/20 transition-opacity duration-300 group-hover:opacity-0" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 100%)", backdropFilter: "blur(20px) saturate(180%)", WebkitBackdropFilter: "blur(20px) saturate(180%)", border: "1px solid rgba(255,255,255,0.35)", boxShadow: "0 2px 16px rgba(0,0,0,0.25), inset 0 1.5px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.08)" }}
                >
                  <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(155deg, rgba(255,255,255,0.28) 0%, transparent 40%)" }} />
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="relative z-10 translate-x-0.5 text-white drop-shadow"><path d="M6 4.5L19.5 12 6 19.5V4.5Z" fill="currentColor"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="w-full flex flex-col md:flex-row items-center md:items-end justify-between gap-6 md:gap-0 animate-fade-in text-center md:text-left mt-8 md:mt-0" style={{ animationDelay: "1.2s" }}>
          <div className="max-w-[340px]">
            <p className="font-sans text-brand-cream/60 text-[10px] uppercase tracking-[0.2em] leading-relaxed mx-auto md:mx-0">
              Every wedding you outsource to us is a weekend back with your family — or another $3K booking on your calendar.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full md:w-auto">
            <a href="#contact" className="btn-primary py-3 px-6 md:px-8 text-[11px] w-full sm:w-auto justify-center">
              Get Your Free Test Edit
            </a>
            <a href="#portfolio" className="btn-outline-light py-3 px-6 md:px-8 text-[11px] w-full sm:w-auto justify-center">
              See Our Work
            </a>
          </div>
        </div>
      </div>

      {activeIndex !== null && (
        <VideoModal
          videos={heroVideos}
          startIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
        />
      )}
    </section>
  );
}
