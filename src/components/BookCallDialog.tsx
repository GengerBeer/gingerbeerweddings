import { useEffect, useState } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const TIME_SLOTS = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"];
const today = new Date().toISOString().split("T")[0];

interface Props { open: boolean; onClose: () => void; }

export default function BookCallDialog({ open, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [callDate, setCallDate] = useState("");
  const [callTime, setCallTime] = useState("");
  const [message, setMessage]   = useState("");

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const reset = () => {
    setName(""); setEmail(""); setPhone(""); setCallDate("");
    setCallTime(""); setMessage(""); setSubmitted(false);
  };
  const handleClose = () => { onClose(); setTimeout(reset, 300); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callTime) { toast.error("Please select a time slot."); return; }
    setLoading(true);
    try {
      const res  = await fetch("/api/book-call", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, phone, call_date: callDate, call_time: callTime, message }) });
      const data = await res.json();
      if (data.success) { setSubmitted(true); } else { toast.error("Something went wrong. Please try again."); }
    } catch { toast.error("Something went wrong. Please try again."); } finally { setLoading(false); }
  };

  if (!open) return null;

  // Field style shared
  const field = "w-full bg-[#F8F2EE] border border-brand-dark/8 rounded-xl px-4 py-3 font-sans text-sm text-brand-dark placeholder:text-brand-dark/30 focus:outline-none focus:border-brand-teal/50 transition-colors";
  const label = "block font-sans text-[9px] uppercase tracking-[0.2em] text-brand-dark/45 mb-1.5";

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
      style={{ background: "rgba(11,44,49,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      {/* Card */}
      <div
        className="relative w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #fdf5f0 0%, #FAEEE9 60%, #f5e7df 100%)",
          border: "1px solid rgba(11,44,49,0.07)",
        }}
      >
        {/* Subtle top shimmer */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-dark/10 to-transparent" />

        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full flex items-center justify-center text-brand-dark/30 hover:text-brand-dark hover:bg-brand-dark/6 transition-all duration-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="px-8 md:px-10 pt-10 pb-10">

          {/* Header */}
          <div className="mb-8">
            <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-brand-dark/40 mb-2">Schedule</p>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-dark font-extrabold leading-tight">Book a Call</h2>
            <p className="font-sans text-sm text-brand-dark/45 mt-2 leading-relaxed">
              Pick a date and time — we'll reach out to confirm within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="flex flex-col items-start gap-5 py-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(37,82,89,0.1)", border: "1px solid rgba(11,44,49,0.1)" }}>
                <CheckCircle size={24} className="text-brand-teal" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-brand-dark font-extrabold mb-2">You're all set!</h3>
                <p className="font-sans text-sm text-brand-dark/50 leading-relaxed max-w-sm">
                  We received your request for <strong className="text-brand-dark/80">{callDate}</strong> at <strong className="text-brand-dark/80">{callTime}</strong>. We'll confirm within 24 hours.
                </p>
              </div>
              <button onClick={handleClose} className="font-sans text-[11px] uppercase tracking-widest text-brand-dark/50 hover:text-brand-dark border border-brand-dark/20 hover:border-brand-dark/40 px-6 py-3 rounded-full transition-all duration-200">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Row 1: Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={label}>Your Name *</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane & John" className={field} />
                </div>
                <div>
                  <label className={label}>Email *</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@example.com" className={field} />
                </div>
              </div>

              {/* Row 2: Phone + Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={label}>Phone *</label>
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className={field} />
                </div>
                <div>
                  <label className={label}>Preferred Date *</label>
                  <input type="date" required value={callDate} min={today} onChange={(e) => setCallDate(e.target.value)}
                    className={field}
                    style={{ colorScheme: "light", color: "#0B2C31" }}
                  />
                </div>
              </div>

              {/* Time slots */}
              <div>
                <label className={label}>Preferred Time *</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setCallTime(slot)}
                      className={`py-2 px-1 rounded-xl font-sans text-[11px] text-center transition-all duration-200 border ${
                        callTime === slot
                          ? "bg-brand-dark text-brand-cream border-transparent font-semibold"
                          : "bg-[#F8F2EE] text-brand-dark/55 border-brand-dark/12 hover:border-brand-dark/25 hover:text-brand-dark"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className={label}>Message (optional)</label>
                <textarea
                  value={message}
                  rows={2}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your wedding..."
                  className={`${field} resize-none`}
                />
              </div>

              {/* Submit */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-sans text-[11px] uppercase tracking-widest font-medium transition-all duration-300 disabled:opacity-60"
                  style={{
                    background: loading ? "rgba(11,44,49,0.7)" : "linear-gradient(135deg, #0B2C31 0%, #255259 100%)",
                    color: "#FAEEE9",
                    boxShadow: "0 4px 20px rgba(11,44,49,0.15)",
                  }}
                >
                  {loading
                    ? <><span className="w-3.5 h-3.5 rounded-full border-2 border-brand-cream/30 border-t-brand-cream animate-spin" />Sending...</>
                    : <>Confirm Booking <ArrowRight size={13} /></>
                  }
                </button>
              </div>

            </form>
          )}
        </div>

        {/* Bottom shimmer */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-dark/10 to-transparent" />
      </div>
    </div>
  );
}
