import { useState, useEffect, useRef } from "react";
import { CheckCircle } from "lucide-react";

// Replace with your deployed Apps Script URL
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbzWixYNgnseRYU1qmkqRhiyNYorOrQQW7X5mlqJe4MxVevvyl7iBbK7DmN2FLMZNMAs_Q/exec";

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

      if (!data.success) {
        throw new Error(data.error || "Something went wrong");
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send. Please try again or email us directly."
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
          style={{
            background: "radial-gradient(circle, hsl(188 41% 25% / 0.5) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 relative">

          {/* Left: copy */}
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
                <span className="font-sans text-[11px] uppercase tracking-widest text-brand-cream/40">
                  Email
                </span>
                <a
                  href="mailto:hello@gingerbeerweddings.com"
                  className="font-sans text-sm text-brand-cream hover:text-brand-sand transition-colors"
                >
                  hello@gingerbeerweddings.com
                </a>
              </div>
              <div className="divider-dark" />
              <div className="flex justify-between items-center py-4">
                <span className="font-sans text-[11px] uppercase tracking-widest text-brand-cream/40">
                  Based In
                </span>
                <span className="font-sans text-sm text-brand-cream">
                  United States · Remote Worldwide
                </span>
              </div>
              <div className="divider-dark" />
            </div>
          </div>

          {/* Right: form */}
          <div className="reveal reveal-delay-2">
            {submitted ? (
              <div className="h-full flex flex-col items-start justify-center gap-6 py-12">
                <CheckCircle size={40} className="text-brand-sand" />
                <h3 className="font-serif text-display-sm text-brand-cream font-extrabold">
                  We've received your inquiry.
                </h3>
                <p className="font-sans text-brand-cream/55 text-sm leading-relaxed max-w-sm">
                  Thank you for reaching out. We'll be in touch within 48 hours to discuss your project.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm(initialForm);
                  }}
                  className="font-sans text-[11px] uppercase tracking-widest text-brand-sand border-b border-brand-sand/40 pb-0.5 hover:border-brand-sand transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="form-input"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <select
                    name="role"
                    required
                    value={form.role}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="" disabled>I Am a...</option>
                    <option value="couple">Couple</option>
                    <option value="videographer">Videographer</option>
                  </select>
                  <input
                    type="text"
                    name="wedding_date"
                    placeholder="Wedding Date (if known)"
                    value={form.wedding_date}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <select
                  name="package"
                  required
                  value={form.package}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="" disabled>Project Type</option>
                  <option value="Teaser Film">Teaser Film</option>
                  <option value="Highlight Film">Highlight Film</option>
                  <option value="Full Wedding Film">Full Wedding Film</option>
                  <option value="Photo Retouching">Photo Retouching</option>
                  <option value="Other / Custom">Other / Custom</option>
                </select>

                <textarea
                  name="message"
                  placeholder="Tell us about your project, style, and vision..."
                  required
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  className="form-input resize-none"
                />

                {error && (
                  <p className="font-sans text-sm text-red-400">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-60 w-full sm:w-auto justify-center"
                >
                  {loading ? "Sending..." : "Check Availability"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
