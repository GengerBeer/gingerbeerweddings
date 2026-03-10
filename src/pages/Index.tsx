import FeedbackDialog from "@/components/FeedbackDialog";

const videos = [
  { id: "1172102287", title: "Ramon and Marloes" },
  { id: "1171939262", title: "Wedding Film 2" },
  { id: "1172093193", title: "Wedding Film 3" },
];

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-48 h-[500px] w-[500px] rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary/70">
            Portfolio
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Our works
          </h1>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary/40" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, i) => (
            <div
              key={i}
              className="group rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            >
              <div className="aspect-video overflow-hidden rounded-xl">
                <iframe
                  src={`https://player.vimeo.com/video/${video.id}?badge=0&autopause=0&player_id=0&app_id=58479`}
                  title={video.title}
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <FeedbackDialog />
        </div>
      </div>
    </div>
  );
};

export default Index;
