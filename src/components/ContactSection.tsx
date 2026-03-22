import { useState, useEffect, useRef } from "react";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const STEPS = [
  {
    key: "individual",
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
    key: "bundles",
    category: "Bundles",
    items: [
      { id: "bundle_1", label: "Teaser + Highlight", desc: "Best value combo" },
      { id: "bundle_2", label: "Teaser + Highlight + Full Film", desc: "Complete wedding package" },
    ],
  },
  {
    key: "addons",
    category: "Add-ons",
    items: [
      { id: "artistic_cut", label: "Artistic Cut", desc: "Non-chronological edit in Highlight style" },
      { id: "ai_4k", label: "AI Upscale to 4K", desc: "Detail restoration, sharpening, artifact removal" },
      { id: "cleanup", label: "Object Cleanup", desc: "Remove people, wires, logos from video/photo" },
    ],
  },
  {
    key: "message",
    category: "Your Message",
    items: [],
  },
];

type FormData = {
  name: string;
  email: string;
  wedding_date: string;
  message: string;
};

const initialForm: FormData = { name: "", email: "", wedding_date: "", message: "" };

// Checkbox component styled to match brand
const ServiceCheckbox = ({
  item,
  checked,
  onChange,
}: {
  item: { id: string; label: string; desc: string };
  checked: boolean;
  onChange: () => void;
}) => (
  <label
    className={`flex items-center gap-4 cursor-pointer rounded-xl border px-4 py-3 transition-all duration-200 select-none ${
      checked
        ? "border-brand-sand/60 bg-brand-sand/10"
        : "border-brand-cream/10 hover:border-brand-sand/30"
    }`}
  >
    {/* Custom checkbox */}
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    <div
      className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 pointer-events-none ${
        checked
          ? "border-brand-sand bg-brand-sand/20"
          : "border-brand-cream/30 bg-transparent"
      }`}
    >
      {checked && (
        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
          <path
            d="M1 4L4 7.5L10 1"
            stroke="hsl(34 89% 89%)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-sans text-sm text-brand-cream leading-snug">{item.label}</p>
      <p className="font-sans text-xs text-brand-cream/40 mt-0.5">{item.desc}</p>
    </div>
  </label>
);

export default function ContactSection() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [selected, setSelected] = useState<string[]>([]);
  const [step, setStep] = useState(0); // 0 = static fields, 1-3 = service blocks, 4 = message
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Total steps: 0 (base fields) + 3 service blocks + 1 message = steps 0..4
  // step 0: name/email/date → next
  // step 1: Individual Services → next
  // step 2: Bundles → next
  // step 3: Add-ons → next
  // step 4: Message + submit

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleService = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step === 0 && (!form.name || !form.email)) {
      toast.error("Please fill in your name and email.");
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const allItems = STEPS.flatMap((g) => g.items);
    const packageLabel = allItems
      .filter((item) => selected.includes(item.id))
      .map((item) => item.label)
      .join(", ") || "Not specified";

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

  // Progress dots (steps 1–4)
  const totalServiceSteps = 4;
  const progressStep = Math.max(0, step - 1);

  return (
    <section id="contact" ref={sectionRef} className="section-dark py-28 md:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">

        {/* Decorative orb */}
        <div
          className="absolute -left-40 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(188 41% 25% / 0.5) 0%, transparent 70%)", filter: "blur(60px)" }}
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 relative items-start">

          {/* ── Left: copy ── */}
          <div className="reveal">
            <p className="text-label uppercase tracking-[0.25em] text-brand-sand/60 font-sans text-[10px] mb-4">
              Contact
            </p>
            <h2 className="font-serif text-display-md text-brand-cream font-extrabold mb-12 md:mb-16 leading-tight">
              Let's Make Something<br />
              <em className="italic">Sparkling.</em>
            </h2>
            <p className="font-sans text-brand-cream/55 text-sm leading-relaxed mb-12 max-w-sm">
              Got footage? Got a deadline? Want to see what we can do with your material before committing? Tell us. We’ll be back within 24 hours.
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
          <div className="reveal reveal-delay-2" style={{ paddingTop: '3.5rem' }}>
            {submitted ? (
              /* ── Success ── */
              <div className="h-full flex flex-col items-start justify-center gap-6 py-12">
                <CheckCircle size={40} className="text-brand-sand" />
                <h3 className="font-serif text-display-sm text-brand-cream font-extrabold">
                  We've received your inquiry.
                </h3>
                <p className="font-sans text-brand-cream/55 text-sm leading-relaxed max-w-sm">
                  Thank you for reaching out. We'll be in touch within 24 hours to discuss your project.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm(initialForm); setSelected([]); setStep(0); }}
                  className="font-sans text-[11px] uppercase tracking-widest text-brand-sand border-b border-brand-sand/40 pb-0.5 hover:border-brand-sand transition-colors"
                >
                  Send Another Message
                </button>
              </div>

            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* ── STEP 0: Static fields ── */}
                {step === 0 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <input type="text" name="name" placeholder="Your Names *" required
                        value={form.name} onChange={handleChange} className="form-input" />
                      <input type="email" name="email" placeholder="Email Address *" required
                        value={form.email} onChange={handleChange} className="form-input" />
                    </div>
                    <input type="text" name="wedding_date" placeholder="Wedding Date (if known)"
                      value={form.wedding_date} onChange={handleChange} className="form-input" />
                    <button type="button" onClick={handleNext}
                      className="btn-primary w-full sm:w-auto justify-center flex items-center gap-2">
                      Next — Choose Services
                      <ArrowRight size={13} />
                    </button>
                  </div>
                )}

                {/* ── STEPS 1–3: Service blocks ── */}
                {step >= 1 && step <= 3 && (
                  <div className="space-y-5">
                    {/* Progress dots */}
                    <div className="flex items-center gap-2 mb-2">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className={`h-1 rounded-full transition-all duration-300 ${
                          i < progressStep ? "w-6 bg-brand-sand" :
                          i === progressStep ? "w-6 bg-brand-sand" : "w-3 bg-brand-cream/20"
                        }`} />
                      ))}
                      <span className="font-sans text-[10px] uppercase tracking-widest text-brand-cream/30 ml-2">
                        Step {step} of 3
                      </span>
                    </div>

                    <p className="font-sans text-[10px] uppercase tracking-widest text-brand-cream/50">
                      {STEPS[step - 1].category}
                    </p>

                    <div className="space-y-2">
                      {STEPS[step - 1].items.map((item) => (
                        <ServiceCheckbox
                          key={item.id}
                          item={item}
                          checked={selected.includes(item.id)}
                          onChange={() => toggleService(item.id)}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button type="button" onClick={handleBack}
                        className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-widest text-brand-cream/40 hover:text-brand-cream transition-colors">
                        <ArrowLeft size={12} />
                        Back
                      </button>
                      <button type="button" onClick={handleNext}
                        className="btn-primary flex items-center gap-2">
                        {step === 3 ? "Next — Your Message" : `Next — ${STEPS[step].category}`}
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── STEP 4: Message + submit ── */}
                {step === 4 && (
                  <div className="space-y-5">
                    <p className="font-sans text-[10px] uppercase tracking-widest text-brand-cream/50">
                      Tell Us About Your Project
                    </p>
                    <textarea name="message"
                      placeholder="Style, special moments, anything you'd like us to know..."
                      rows={5} value={form.message} onChange={handleChange}
                      className="form-input resize-none" />

                    {/* Summary of selected */}
                    {selected.length > 0 && (
                      <div className="rounded-xl border border-brand-cream/10 px-4 py-3 space-y-1">
                        <p className="font-sans text-[9px] uppercase tracking-widest text-brand-cream/30">
                          Selected services
                        </p>
                        <p className="font-sans text-xs text-brand-cream/60 leading-relaxed">
                          {STEPS.flatMap((g) => g.items)
                            .filter((item) => selected.includes(item.id))
                            .map((item) => item.label)
                            .join(" · ")}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-1">
                      <button type="button" onClick={handleBack}
                        className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-widest text-brand-cream/40 hover:text-brand-cream transition-colors">
                        <ArrowLeft size={12} />
                        Back
                      </button>
                      <button type="submit" disabled={loading}
                        className="btn-primary disabled:opacity-60 flex items-center gap-2">
                        {loading ? (
                          <>
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-brand-burgundy/40 border-t-brand-burgundy animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Check Availability
                            <ArrowRight size={13} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
