import { useState, useEffect, useRef } from "react";
import { X, Play } from "lucide-react";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";

const projects = [
  { id: 1, title: "Emma & James", type: "Highlight Film", clientType: "Couple", thumbnail: portfolio1, location: "Napa Valley, CA", videoUrl: "/video/Rider.mp4" },
  { id: 2, title: "The Ceremony", type: "Teaser", clientType: "Videographer", thumbnail: portfolio2, location: "New York, NY", videoUrl: "/video/4.mov" },
  { id: 3, title: "Golden Hour", type: "Full Film", clientType: "Couple", thumbnail: portfolio3, location: "Charleston, SC", vimeoId: "319649712" },
  { id: 4, title: "Cliffside Vows", type: "Highlight Film", clientType: "Videographer", thumbnail: portfolio4, location: "Malibu, CA", vimeoId: "883055147" },
];

export default function PortfolioSection() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<typeof projects[0] | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const openLightbox = (project: typeof projects[0]) => {
    setActiveProject(project);
    setLightboxOpen(true);
  };
  const closeLightbox = () => {
    setLightboxOpen(false);
    setActiveProject(null);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="portfolio" ref={sectionRef} className="section-cream py-28 md:py-40">
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

        {/* Asymmetric grid: large left + 2 stacked right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Large feature card */}
          <div
            className="portfolio-card relative group cursor-pointer reveal-left h-full min-h-[500px]"
            onClick={() => openLightbox(projects[0])}
          >
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              <img src={projects[0].thumbnail} alt={projects[0].title} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="card-overlay absolute inset-0 rounded-xl flex flex-col justify-end p-8">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-brand-cream font-serif text-2xl font-extrabold mb-1">{projects[0].title}</p>
                  <p className="text-brand-cream/70 font-sans text-[11px] uppercase tracking-widest">
                    {projects[0].type} · {projects[0].clientType}
                  </p>
                </div>
                <div className="play-btn shrink-0">
                  <Play size={16} className="text-brand-teal ml-0.5" fill="currentColor" />
                </div>
              </div>
            </div>
            {/* Location pill */}
            <div className="absolute top-4 left-4 bg-brand-cream/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center justify-center">
              <span className="font-sans text-[10px] uppercase tracking-widest text-brand-dark/70 leading-none translate-y-[0.5px]">
                {projects[0].location}
              </span>
            </div>
          </div>

          {/* Right: 2 stacked cards */}
          <div className="flex flex-col gap-5 h-full">
            {projects.slice(1, 3).map((project, i) => (
              <div
                key={project.id}
                className={`portfolio-card relative group cursor-pointer reveal-right reveal-delay-${i + 1} flex-1 min-h-[240px]`}
                onClick={() => openLightbox(project)}
              >
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                  <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="card-overlay absolute inset-0 rounded-xl flex flex-col justify-end p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-brand-cream font-serif text-xl font-extrabold mb-1">{project.title}</p>
                      <p className="text-brand-cream/70 font-sans text-[10px] uppercase tracking-widest">
                        {project.type} · {project.clientType}
                      </p>
                    </div>
                    <div className="play-btn shrink-0">
                      <Play size={14} className="text-brand-teal ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-brand-cream/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center justify-center">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-brand-dark/70 leading-none translate-y-[0.5px]">
                    {project.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4th card — full width */}
        <div
          className="portfolio-card relative group cursor-pointer reveal mt-5"
          onClick={() => openLightbox(projects[3])}
        >
          <div className="aspect-[21/7] overflow-hidden rounded-xl">
            <img src={projects[3].thumbnail} alt={projects[3].title} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="card-overlay absolute inset-0 rounded-xl flex items-end p-8">
            <div className="flex items-end justify-between w-full">
              <div>
                <p className="text-brand-cream font-serif text-2xl font-extrabold mb-1">{projects[3].title}</p>
                <p className="text-brand-cream/70 font-sans text-[11px] uppercase tracking-widest">
                  {projects[3].type} · {projects[3].clientType}
                </p>
              </div>
              <div className="play-btn shrink-0">
                <Play size={16} className="text-brand-teal ml-0.5" fill="currentColor" />
              </div>
            </div>
          </div>
          <div className="absolute top-4 left-4 bg-brand-cream/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center justify-center">
            <span className="font-sans text-[10px] uppercase tracking-widest text-brand-dark/70 leading-none translate-y-[0.5px]">
              {projects[3].location}
            </span>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && activeProject && (
        <div
          className="fixed inset-0 z-50 bg-brand-dark/96 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-6 right-6 text-brand-cream/70 hover:text-brand-cream transition-colors"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <X size={28} />
          </button>

          <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {activeProject.videoUrl ? (
              <div className="relative aspect-video w-full bg-black rounded-2xl border border-brand-cream/10 overflow-hidden shadow-2xl transition-all duration-300">
                <video
                  src={activeProject.videoUrl}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  controls
                  playsInline
                />
              </div>
            ) : activeProject.vimeoId ? (
              <div className="relative aspect-video w-full bg-brand-burgundy overflow-hidden rounded-2xl shadow-2xl transition-all duration-300">
                <iframe
                  src={`https://player.vimeo.com/video/${activeProject.vimeoId}?autoplay=1&title=0&byline=0&portrait=0`}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="relative aspect-video w-full bg-brand-teal/90 rounded-2xl border border-brand-cream/10 overflow-hidden shadow-2xl transition-all duration-300">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
                  <div className="w-20 h-20 rounded-full border border-brand-cream/40 flex items-center justify-center mx-auto mb-6">
                    <Play size={28} className="text-brand-cream ml-1" />
                  </div>
                  <p className="font-serif text-brand-cream text-2xl font-extrabold mb-2">{activeProject.title}</p>
                  <p className="font-sans text-brand-cream/50 text-[11px] uppercase tracking-widest leading-none mt-4">
                    {activeProject.type} · {activeProject.clientType}
                  </p>
                  <p className="font-sans text-brand-cream/40 text-xs mt-6">
                    Video content not uploaded yet
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
