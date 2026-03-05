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
        <div className="flex-1 flex flex-col justify-center items-start relative lg:mt-[-4vh]">

          <div
            className="parallax-left absolute top-[4%] md:top-[10%] left-[-15%] md:left-[-20%] w-[35vw] md:w-[20vw] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl animate-fade-in z-10 border border-brand-cream/10 hidden md:block transition-transform duration-700 ease-out group cursor-pointer isolate"
            style={{
              animationDelay: "0.5s",
              transform: "translate(10px, -10px) rotate(-6deg)",
              willChange: "transform",
              WebkitMaskImage: "-webkit-radial-gradient(white, black)" // Force hardware clipping
            }}
            onClick={() => openVideo(heroVideos.left)}
          >
            <img
              src={portfolio2}
              alt=""
              className="w-full h-full object-cover grayscale-[100%] contrast-[110%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
              style={{ backfaceVisibility: "hidden", transform: "translateZ(0)" }}
            />
            <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-brand-cream/40 bg-brand-cream/10 backdrop-blur-sm flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-500">
                <Play size={24} className="text-brand-cream ml-1" fill="currentColor" />
              </div>
            </div>
          </div>

          {/* Right Color Image: Shifted further right */}
          <div
            className="parallax-right absolute top-[5%] md:top-[12%] right-[-10%] md:right-[-20%] w-[45vw] md:w-[28vw] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl animate-fade-in z-10 border border-brand-cream/10 hidden md:block transition-transform duration-700 ease-out group cursor-pointer isolate"
            style={{
              transform: "translate(-15px, 5px) rotate(3deg)",
              willChange: "transform",
              WebkitMaskImage: "-webkit-radial-gradient(white, black)" // Force hardware clipping
            }}
            onClick={() => openVideo(heroVideos.right)}
          >
            <img
              src={portfolio1}
              alt=""
              className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
              style={{ backfaceVisibility: "hidden", transform: "translateZ(0)" }}
            />
            <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border border-brand-cream/40 bg-brand-cream/10 backdrop-blur-sm flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-500">
                <Play size={30} className="text-brand-cream ml-1" fill="currentColor" />
              </div>
            </div>
          </div>

          <div className="relative z-30 w-full flex flex-col pointer-events-none">
            {/* Title stagger effect with softer drop-shadow for overlap readability */}
            <h1
              className="font-serif text-[12vw] md:text-[8.5vw] lg:text-[7.5vw] text-brand-cream font-extrabold leading-[0.82] tracking-tight animate-fade-up drop-shadow-[0_2px_15px_rgba(0,0,0,0.4)] pointer-events-auto"
              style={{ animationDelay: "0.2s" }}
            >
              Cinematic
            </h1>

            <h2
              className="font-serif text-[12vw] md:text-[8.5vw] lg:text-[7.5vw] text-brand-cream font-extrabold leading-[0.82] tracking-tight animate-fade-up mt-1 md:mt-2 ml-[8vw] md:ml-[12vw] drop-shadow-[0_2px_15px_rgba(0,0,0,0.4)] pointer-events-auto"
              style={{ animationDelay: "0.4s" }}
            >
              Wedding
            </h2>

            <div className="flex flex-col items-start animate-fade-up mt-1 md:mt-2 ml-[20vw] md:ml-[35vw] pointer-events-auto" style={{ animationDelay: "0.6s" }}>
              <h2 className="font-serif text-[12vw] md:text-[8.5vw] lg:text-[7.5vw] text-brand-cream font-extrabold leading-[0.82] tracking-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.4)]">
                Films
              </h2>
            </div>

            {/* Script phrase centered horizontally below the cascade */}
            <div className="w-full flex justify-center mt-8 md:mt-12 animate-fade-in pointer-events-auto" style={{ animationDelay: "1.2s" }}>
              <span className="font-script text-brand-sand text-5xl md:text-7xl lg:text-8xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)] block leading-none whitespace-nowrap">
                That Feel Like You
              </span>
            </div>

            {/* Mobile-only Images (simplified layout) */}
            <div className="md:hidden flex gap-4 mt-8">
              <div className="w-1/2 aspect-square rounded-lg overflow-hidden shadow-xl rotate-1 border border-brand-cream/10">
                <img src={portfolio1} alt="" className="w-full h-full object-cover grayscale-[10%]" />
              </div>
              <div className="w-1/2 aspect-square rounded-lg overflow-hidden shadow-xl -rotate-1 mt-4 border border-brand-cream/10">
                <img src={portfolio2} alt="" className="w-full h-full object-cover grayscale-[100%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Clean Layout */}
        <div className="w-full flex flex-col md:flex-row items-end justify-between gap-8 md:gap-0 animate-fade-in" style={{ animationDelay: "1.2s" }}>

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
