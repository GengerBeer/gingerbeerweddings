import { useState } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const TIME_SLOTS = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "1:00 PM",  "1:30 PM",  "2:00 PM",  "2:30 PM",
  "3:00 PM",  "3:30 PM",  "4:00 PM",  "4:30 PM",
  "5:00 PM",
];

const today = new Date().toISOString().split("T")[0];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function BookCallDialog({ open, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [callDate, setCallDate] = useState("");
  const [callTime, setCallTime] = useState("");
  const [message, setMessage] = useState("");

  const reset = () => {
    setName(""); setEmail(""); setPhone("");
    setCallDate(""); setCallTime(""); setMessage("");
    setSubmitted(false);
  };

  const handleClose = () => { onClose(); setTimeout(reset, 300); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callTime) { toast.error("Please select a time slot."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/book-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, call_date: callDate, call_time: callTime, message }),
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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(11, 44, 49, 0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: "hsl(17 62% 95%)", maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-5 border-b border-brand-dark/10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-brand-dark/40 mb-2">
                Schedule
              </p>
              <h2 className="font-serif text-display-sm text-brand-dark font-extrabold leading-tight">
                Book a Call
              </h2>
              <p className="font-sans text-sm text-brand-dark/50 mt-1.5 leading-relaxed">
                Pick a date and time — we'll reach out to confirm.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-brand-dark/35 hover:text-brand-dark hover:bg-brand-dark/8 transition-all mt-1"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          {submitted ? (
            <div className="flex flex-col items-start gap-5 py-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center bg-brand-teal/15">
                <CheckCircle size={22} className="text-brand-teal" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-brand-dark font-extrabold mb-2">
                  You're all set!
                </h3>
                <p className="font-sans text-sm text-brand-dark/55 leading-relaxed max-w-sm">
                  We received your request for <strong>{callDate}</strong> at <strong>{callTime}</strong>.
                  We'll confirm within 24 hours.
                </p>
              </div>
              <button onClick={handleClose} className="btn-outline-dark text-[11px] py-2.5 px-5">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-sans text-[10px] uppercase tracking-widest text-brand-dark/40">
                    Your Name *
                  </label>
                  <input
                    type="text" required value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane & John"
                    className="w-full bg-white border border-brand-dark/12 rounded-xl px-4 py-3 font-sans text-sm text-brand-dark placeholder:text-brand-dark/30 focus:outline-none focus:border-brand-teal transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-sans text-[10px] uppercase tracking-widest text-brand-dark/40">
                    Email *
                  </label>
                  <input
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hello@example.com"
                    className="w-full bg-white border border-brand-dark/12 rounded-xl px-4 py-3 font-sans text-sm text-brand-dark placeholder:text-brand-dark/30 focus:outline-none focus:border-brand-teal transition-colors"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="font-sans text-[10px] uppercase tracking-widest text-brand-dark/40">
                  Phone Number *
                </label>
                <input
                  type="tel" required value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-white border border-brand-dark/12 rounded-xl px-4 py-3 font-sans text-sm text-brand-dark placeholder:text-brand-dark/30 focus:outline-none focus:border-brand-teal transition-colors"
                />
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="font-sans text-[10px] uppercase tracking-widest text-brand-dark/40">
                  Preferred Date *
                </label>
                <input
                  type="date" required value={callDate} min={today}
                  onChange={(e) => setCallDate(e.target.value)}
                  className="w-full bg-white border border-brand-dark/12 rounded-xl px-4 py-3 font-sans text-sm text-brand-dark focus:outline-none focus:border-brand-teal transition-colors"
                />
              </div>

              {/* Time slots */}
              <div className="space-y-2">
                <label className="font-sans text-[10px] uppercase tracking-widest text-brand-dark/40">
                  Preferred Time *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setCallTime(slot)}
                      className={`py-2 px-1 rounded-lg font-sans text-xs text-center transition-all duration-200 border ${
                        callTime === slot
                          ? "bg-brand-dark text-brand-cream border-brand-dark"
                          : "bg-white text-brand-dark/60 border-brand-dark/12 hover:border-brand-dark/40 hover:text-brand-dark"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="font-sans text-[10px] uppercase tracking-widest text-brand-dark/40">
                  Message (optional)
                </label>
                <textarea
                  value={message} rows={3}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us a bit about your wedding or project..."
                  className="w-full bg-white border border-brand-dark/12 rounded-xl px-4 py-3 font-sans text-sm text-brand-dark placeholder:text-brand-dark/30 focus:outline-none focus:border-brand-teal transition-colors resize-none"
                />
              </div>

              {/* Submit */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center disabled:opacity-60 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-brand-burgundy/40 border-t-brand-burgundy animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Confirm Booking
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
  );
}
