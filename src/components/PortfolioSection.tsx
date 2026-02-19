import { useState } from "react";
import { X, Play } from "lucide-react";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";

const projects = [
  {
    id: 1,
    title: "Emma & James",
    type: "Highlight Film",
    clientType: "Couple",
    thumbnail: portfolio1,
    location: "Napa Valley, CA",
  },
  {
    id: 2,
    title: "The Ceremony",
    type: "Teaser",
    clientType: "Videographer",
    thumbnail: portfolio2,
    location: "New York, NY",
  },
  {
    id: 3,
    title: "Golden Hour",
    type: "Full Film",
    clientType: "Couple",
    thumbnail: portfolio3,
    location: "Charleston, SC",
  },
  {
    id: 4,
    title: "Cliffside Vows",
    type: "Highlight Film",
    clientType: "Videographer",
    thumbnail: portfolio4,
    location: "Malibu, CA",
  },
];

export default function PortfolioSection() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<typeof projects[0] | null>(null);

  const openLightbox = (project: typeof projects[0]) => {
    setActiveProject(project);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setActiveProject(null);
    document.body.style.overflow = "";
  };

  return (
    <section id="portfolio" className="section-cream py-28 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <p className="text-label uppercase tracking-[0.2em] text-muted-foreground font-sans text-[10px] mb-4">
            Our Work
          </p>
          <h2 className="font-serif text-display-lg text-foreground font-light">
            Selected Work
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          {projects.map((project, i) => (
            <div
              key={project.id}
              className="portfolio-card relative bg-background group reveal"
              style={{ transitionDelay: `${i * 0.1}s` }}
              onClick={() => openLightbox(project)}
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Overlay */}
              <div className="card-overlay absolute inset-0 flex flex-col justify-end p-8">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-brand-cream font-serif text-2xl font-light mb-1">{project.title}</p>
                    <p className="text-brand-cream/70 font-sans text-[11px] uppercase tracking-widest">
                      {project.type} · {project.clientType}
                    </p>
                  </div>
                  <div className="play-btn shrink-0">
                    <Play size={18} className="text-brand-cream ml-0.5" fill="currentColor" />
                  </div>
                </div>
              </div>

              {/* Static label */}
              <div className="absolute top-5 left-5 bg-background/90 px-3 py-1.5">
                <span className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground">
                  {project.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && activeProject && (
        <div
          className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-6 right-6 text-brand-cream/70 hover:text-brand-cream transition-colors"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <X size={28} />
          </button>

          <div
            className="w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Placeholder video frame */}
            <div className="aspect-video bg-brand-dark flex items-center justify-center border border-brand-dark">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full border border-brand-cream/40 flex items-center justify-center mx-auto mb-6">
                  <Play size={28} className="text-brand-cream ml-1" />
                </div>
                <p className="font-serif text-brand-cream text-2xl font-light mb-2">{activeProject.title}</p>
                <p className="font-sans text-brand-cream/50 text-[11px] uppercase tracking-widest">
                  {activeProject.type} · {activeProject.clientType}
                </p>
                <p className="font-sans text-brand-cream/40 text-xs mt-6">Video player — embed your Vimeo or YouTube link here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
