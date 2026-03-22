import { useState, useEffect, useRef } from "react";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

const SERVICES = [
  {
    category: "Individual Services",
    items: [
      { id: "teaser", label: "Teaser", desc: "Up to 45 sec — Instagram, TikTok, Reels" },
      { id: "highlight", label: "Highlight Film", desc: "Cinematic day recap, up to 15 min" },
      { id: "full_film", label: "Full Wedding Film", desc: "Full chronological documentary, 20–60 min" },
      { id: "ceremony", label: "Ceremony Edit", desc: "Full ceremony, no cuts" },
      { id: "speeches", label: "Speeches & Toasts", desc: "All toasts and speeches, edited" },
      { id: "reception", label: "Reception Edit", desc: "First dance, cake, party highlights" },
      { id: "same_day", label: "Same Day Recap", desc: "Delivered on your wedding day (proxy edit)" },
    ],
  },
  {
    category: "Bundles",
    items: [
      { id: "bundle_1", label: "Teaser + Highlight", desc: "Best value combo" },
      { id: "bundle_2", label: "Teaser + Highlight + Full Film", desc: "Complete wedding package" },
    ],
  },
  {
    category: "Add-ons",
    items: [
      { id: "artistic_cut", label: "Artistic Cut", desc: "Non-chronological edit in Highlight style" },
      { id: "ai_4k", label: "AI Upscale to 4K", desc: "Detail restoration, sharpening, artifact removal" },
      { id: "cleanup", label: "Object Cleanup", desc: "Remove people, wires, logos from video/photo" },
    ],
  },
];

type FormData = {
  name: string;
  email: string;
  wedding_date: string;
  message: string;
};

const initialForm: FormData = { name: "", email: "", wedding_date: "", message: "" };

export default function ContactSection() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleService = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.length === 0) {
      toast.error("Please select at least one service.");
      return;
    }

    setLoading(true);

    const packageLabel = SERVICES.flatMap((g) => g.items)
      .filter((item) => selected.includes(item.id))
      .map((item) => item.label)
      .join(", ");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, package: packageLabel }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="section-dark py-28 md:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">

        {/* Decorative orb */}
        <div
          className="absolute -left-40 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(188 41% 25% / 0.5) 0%, transparent 70%)", filter: "blur(60px)" }}
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 relative">

          {/* ── Left: copy ── */}
          <div className="reveal">
            <p className="text-label uppercase tracking-[0.25em] text-brand-sand/60 font-sans text-[10px] mb-4">
              Contact
            </p>
            <h2 className="font-serif text-display-md text-brand-cream font-extrabold mb-12 md:mb-16 leading-tight">
              Let's Create Something<br />
              <em className="italic">Timeless</em>
            </h2>
            <p className="font-sans text-brand-cream/55 text-sm leading-relaxed mb-12 max-w-sm">
              Whether you're a couple planning your wedding or a filmmaker looking for a dedicated
              post-production partner — we'd love to hear from you.
            </p>

            <div className="space-y-0">
              <div className="divider-dark" />
              <div className="flex justify-between items-center py-4">
                <span className="font-sans text-[11px] uppercase tracking-widest text-brand-cream/40">Email</span>
                <a href="mailto:hello@gingerbeerweddings.com"
                  className="font-sans text-sm text-brand-cream hover:text-brand-sand transition-colors">
                  hello@gingerbeerweddings.com
                </a>
              </div>
              <div className="divider-dark" />
              <div className="flex justify-between items-center py-4">
                <span className="font-sans text-[11px] uppercase tracking-widest text-brand-cream/40">Based In</span>
                <span className="font-sans text-sm text-brand-cream">United States · Remote Worldwide</span>
              </div>
              <div className="divider-dark" />
            </div>
          </div>

          {/* ── Right: form ── */}
          <div className="reveal reveal-delay-2">
            {submitted ? (
              <div className="h-full flex flex-col items-start justify-center gap-6 py-12">
                <CheckCircle size={40} className="text-brand-sand" />
                <h3 className="font-serif text-display-sm text-brand-cream font-extrabold">
                  We've received your inquiry.
                </h3>
                <p className="font-sans text-brand-cream/55 text-sm leading-relaxed max-w-sm">
                  Thank you for reaching out. We'll be in touch within 24 hours to discuss your project.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm(initialForm); setSelected([]); }}
                  className="font-sans text-[11px] uppercase tracking-widest text-brand-sand border-b border-brand-sand/40 pb-0.5 hover:border-brand-sand transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input type="text" name="name" placeholder="Your Names" required
                    value={form.name} onChange={handleChange} className="form-input" />
                  <input type="email" name="email" placeholder="Email Address" required
                    value={form.email} onChange={handleChange} className="form-input" />
                </div>

                {/* Wedding Date */}
                <input type="text" name="wedding_date" placeholder="Wedding Date (if known)"
                  value={form.wedding_date} onChange={handleChange} className="form-input" />

                {/* Services */}
                <div className="space-y-3">
                  <p className="font-sans text-[10px] uppercase tracking-widest text-brand-cream/40">
                    What are you looking for? *
                  </p>
                  {SERVICES.map((group) => (
                    <div key={group.category} className="space-y-2">
                      <p className="font-sans text-[9px] uppercase tracking-widest text-brand-sand/50 pt-1">
                        {group.category}
                      </p>
                      {group.items.map((item) => (
                        <label
                          key={item.id}
                          className={`flex items-start gap-3 cursor-pointer rounded-xl border px-3 py-2.5 transition-all duration-200 ${
                            selected.includes(item.id)
                              ? "border-brand-sand/60 bg-brand-sand/10"
                              : "border-brand-cream/10 hover:border-brand-sand/30"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected.includes(item.id)}
                            onChange={() => toggleService(item.id)}
                            className="mt-0.5 h-4 w-4 accent-[#FCE6CA] cursor-pointer flex-shrink-0"
                          />
                          <div>
                            <p className="font-sans text-sm text-brand-cream">{item.label}</p>
                            <p className="font-sans text-xs text-brand-cream/40">{item.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Message */}
                <textarea name="message" placeholder="Tell us about your project, style, and vision..."
                  rows={3} value={form.message} onChange={handleChange}
                  className="form-input resize-none" />

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-60 w-full sm:w-auto justify-center"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-brand-burgundy/40 border-t-brand-burgundy animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "Check Availability"
                  )}
                </button>

              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
