import { useState, useEffect, useRef } from "react";
import { CheckCircle, ArrowRight, Mail, MapPin } from "lucide-react";

const APPS_SCRIPT_URL =
  import.meta.env.VITE_APPS_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbzWixYNgnseRYU1qmkqRhiyNYorOrQQW7X5mlqJe4MxVevvyl7iBbK7DmN2FLMZNMAs_Q/exec";

type FormData = {
  name: string;
  email: string;
  role: string;
  wedding_date: string;
  package: string;
  message: string;
};

const initialForm: FormData = {
  name: "",
  email: "",
  role: "",
  wedding_date: "",
  package: "",
  message: "",
};

export default function ContactSection() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Something went wrong");
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send. Please email us directly."
      );
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
      { threshold: 0.08 }
    );
    sectionRef.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section-dark py-28 md:py-40 overflow-hidden relative"
    >
      {/* Background orbs */}
      <div
        className="absolute -left-48 top-1/3 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(188 41% 25% / 0.45) 0%, transparent 70%)",
          filter: "blur(72px)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -right-32 bottom-1/4 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(34 89% 89% / 0.07) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">

        {/* Section header */}
        <div className="mb-16 md:mb-20 reveal">
          <p className="text-label uppercase tracking-[0.25em] text-brand-sand/50 font-sans text-[10px] mb-4">
            Get In Touch
          </p>
          <h2 className="font-serif text-display-lg text-brand-cream font-extrabold leading-tight max-w-2xl">
            Let's Create Something{" "}
            <em className="font-script text-brand-sand" style={{ fontSize: "1.15em" }}>
              Timeless
            </em>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">

          {/* ── Left col: info ── */}
          <div className="lg:col-span-2 flex flex-col justify-between gap-12 reveal">

            <p className="font-sans text-brand-cream/55 text-sm leading-relaxed max-w-sm">
              Whether you're a couple planning your wedding or a filmmaker looking for
              a dedicated post-production partner — we'd love to hear from you.
            </p>

            {/* Contact details */}
            <div className="space-y-0">
              <div className="divider-dark" />
              <div className="flex justify-between items-center py-5">
                <div className="flex items-center gap-3">
                  <Mail size={13} className="text-brand-sand/50" />
                  <span className="font-sans text-[11px] uppercase tracking-widest text-brand-cream/40">
                    Email
                  </span>
                </div>
                <a
                  href="mailto:hello@gingerbeerweddings.com"
                  className="font-sans text-sm text-brand-cream hover:text-brand-sand transition-colors duration-200"
                >
                  hello@gingerbeerweddings.com
                </a>
              </div>
              <div className="divider-dark" />
              <div className="flex justify-between items-center py-5">
                <div className="flex items-center gap-3">
                  <MapPin size={13} className="text-brand-sand/50" />
                  <span className="font-sans text-[11px] uppercase tracking-widest text-brand-cream/40">
                    Based In
                  </span>
                </div>
                <span className="font-sans text-sm text-brand-cream">
                  United States · Remote
                </span>
              </div>
              <div className="divider-dark" />
            </div>

            {/* Response time note */}
            <p className="font-sans text-[11px] uppercase tracking-widest text-brand-cream/25">
              We respond within 48 hours
            </p>
          </div>

          {/* ── Right col: form ── */}
          <div className="lg:col-span-3 reveal reveal-delay-2">

            {submitted ? (
              /* ── Success state ── */
              <div className="flex flex-col items-start gap-7 py-8 px-8 rounded-2xl"
                style={{ background: "hsl(188 55% 14%)", border: "1.5px solid hsl(188 35% 20%)" }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: "hsl(188 41% 20%)" }}
                >
                  <CheckCircle size={24} className="text-brand-sand" />
                </div>
                <div>
                  <h3 className="font-serif text-display-sm text-brand-cream font-extrabold mb-3">
                    We've received your inquiry.
                  </h3>
                  <p className="font-sans text-brand-cream/55 text-sm leading-relaxed max-w-sm">
                    Thank you for reaching out. We'll be in touch within 48 hours
                    to discuss your project.
                  </p>
                </div>
                <button
                  onClick={() => { setSubmitted(false); setForm(initialForm); }}
                  className="font-sans text-[11px] uppercase tracking-widest text-brand-sand/70 hover:text-brand-sand border-b border-brand-sand/30 hover:border-brand-sand/70 pb-0.5 transition-colors duration-200"
                >
                  Send Another Message
                </button>
              </div>

            ) : (
              /* ── Form ── */
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl p-8 md:p-10 space-y-5"
                style={{
                  background: "hsl(188 55% 13%)",
                  border: "1.5px solid hsl(188 35% 19%)",
                }}
              >
                {/* Row 1: Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="font-sans text-[10px] uppercase tracking-widest text-brand-cream/40">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Jane & John"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans text-[10px] uppercase tracking-widest text-brand-cream/40">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="hello@example.com"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Row 2: Role + Wedding Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="font-sans text-[10px] uppercase tracking-widest text-brand-cream/40">
                      I Am a... *
                    </label>
                    <select
                      name="role"
                      required
                      value={form.role}
                      onChange={handleChange}
                      className="form-input"
                    >
                      <option value="" disabled>Select...</option>
                      <option value="couple">Couple</option>
                      <option value="videographer">Videographer</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans text-[10px] uppercase tracking-widest text-brand-cream/40">
                      Wedding Date
                    </label>
                    <input
                      type="text"
                      name="wedding_date"
                      placeholder="e.g. June 2025"
                      value={form.wedding_date}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Row 3: Package */}
                <div className="space-y-2">
                  <label className="font-sans text-[10px] uppercase tracking-widest text-brand-cream/40">
                    Project Type *
                  </label>
                  <select
                    name="package"
                    required
                    value={form.package}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="" disabled>Select a package...</option>
                    <option value="Teaser Film">Teaser Film</option>
                    <option value="Highlight Film">Highlight Film</option>
                    <option value="Full Wedding Film">Full Wedding Film</option>
                    <option value="Photo Retouching">Photo Retouching</option>
                    <option value="Other / Custom">Other / Custom</option>
                  </select>
                </div>

                {/* Row 4: Message */}
                <div className="space-y-2">
                  <label className="font-sans text-[10px] uppercase tracking-widest text-brand-cream/40">
                    Tell Us About Your Vision *
                  </label>
                  <textarea
                    name="message"
                    placeholder="Share your story, style preferences, and anything that makes your day unique..."
                    required
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    className="form-input resize-none"
                  />
                </div>

                {/* Error */}
                {error && (
                  <p className="font-sans text-sm text-red-400 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
                    {error}
                  </p>
                )}

                {/* Divider */}
                <div className="divider-dark !my-6" />

                {/* Submit */}
                <div className="flex items-center justify-between gap-4">
                  <p className="font-sans text-[10px] uppercase tracking-widest text-brand-cream/25">
                    * Required fields
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                  >
                    {loading ? (
                      <>
                        <span
                          className="w-3.5 h-3.5 rounded-full border-2 border-brand-burgundy/40 border-t-brand-burgundy animate-spin"
                        />
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
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
