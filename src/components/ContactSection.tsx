import { useState } from "react";
import { CheckCircle } from "lucide-react";

type FormData = {
  name: string;
  email: string;
  role: string;
  date: string;
  projectType: string;
  message: string;
};

const initialForm: FormData = {
  name: "",
  email: "",
  role: "",
  date: "",
  projectType: "",
  message: "",
};

export default function ContactSection() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const inputClass =
    "w-full bg-transparent border-0 border-b border-muted-foreground/30 py-4 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors duration-200";

  const selectClass =
    "w-full bg-transparent border-0 border-b border-muted-foreground/30 py-4 font-sans text-sm text-foreground focus:outline-none focus:border-foreground transition-colors duration-200 appearance-none cursor-pointer";

  return (
    <section id="contact" className="section-dark py-28 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* Left: copy */}
          <div className="reveal">
            <p className="text-label uppercase tracking-[0.2em] text-brand-sand/60 font-sans text-[10px] mb-4">
              Contact
            </p>
            <h2 className="font-serif text-display-md text-brand-cream font-light mb-8 leading-tight">
              Let's Create Something<br />
              <em className="italic">Timeless</em>
            </h2>
            <p className="font-sans text-brand-cream/55 text-sm leading-relaxed mb-12 max-w-sm">
              Whether you're a couple planning your wedding or a filmmaker looking for a dedicated
              post-production partner — we'd love to hear from you.
            </p>

            <div className="space-y-4">
              <div className="divider-dark" />
              <div className="flex justify-between items-center py-3">
                <span className="font-sans text-[11px] uppercase tracking-widest text-brand-cream/40">Email</span>
                <span className="font-sans text-sm text-brand-cream">hello@gingerbeerstudio.com</span>
              </div>
              <div className="divider-dark" />
              <div className="flex justify-between items-center py-3">
                <span className="font-sans text-[11px] uppercase tracking-widest text-brand-cream/40">Based In</span>
                <span className="font-sans text-sm text-brand-cream">United States · Remote Worldwide</span>
              </div>
              <div className="divider-dark" />
            </div>
          </div>

          {/* Right: form */}
          <div className="reveal reveal-delay-2">
            {submitted ? (
              <div className="h-full flex flex-col items-start justify-center gap-6 py-12">
                <CheckCircle size={40} className="text-brand-sand" />
                <h3 className="font-serif text-display-sm text-brand-cream font-light">
                  We've received your inquiry.
                </h3>
                <p className="font-sans text-brand-cream/55 text-sm leading-relaxed max-w-sm">
                  Thank you for reaching out. We'll be in touch within 48 hours to discuss your project.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm(initialForm); }}
                  className="font-sans text-[11px] uppercase tracking-widest text-brand-sand border-b border-brand-sand/40 pb-0.5 hover:border-brand-sand transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <select
                      name="role"
                      required
                      value={form.role}
                      onChange={handleChange}
                      className={selectClass}
                    >
                      <option value="" disabled>I Am a...</option>
                      <option value="couple">Couple</option>
                      <option value="videographer">Videographer</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="date"
                      placeholder="Wedding Date (if known)"
                      value={form.date}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <select
                    name="projectType"
                    required
                    value={form.projectType}
                    onChange={handleChange}
                    className={selectClass}
                  >
                    <option value="" disabled>Project Type</option>
                    <option value="teaser">Teaser Film</option>
                    <option value="highlight">Highlight Film</option>
                    <option value="full">Full Wedding Film</option>
                    <option value="photo">Photo Retouching</option>
                    <option value="other">Other / Custom</option>
                  </select>
                </div>

                <div>
                  <textarea
                    name="message"
                    placeholder="Tell us about your project, style, and vision..."
                    required
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-3 bg-brand-sand text-foreground font-sans text-[11px] uppercase tracking-widest px-8 py-4 hover:bg-brand-sand-dark transition-colors duration-300 font-medium disabled:opacity-60"
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
