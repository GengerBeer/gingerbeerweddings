import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
      { id: "artistic_cut", label: "Artistic Cut", desc: "Non-chronological edit of Full Film in Highlight style" },
      { id: "ai_4k", label: "AI Upscale to 4K", desc: "Detail restoration, sharpening, artifact removal" },
      { id: "cleanup", label: "Object Cleanup", desc: "Remove people, wires, logos from video/photo" },
    ],
  },
];

const FeedbackDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [terms, setTerms] = useState(false);

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
        body: JSON.stringify({ name, email, wedding_date: date, package: packageLabel, message }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Thank you! We'll be in touch soon 🎬");
        setName("");
        setEmail("");
        setDate("");
        setSelected([]);
        setMessage("");
        setTerms(false);
        setOpen(false);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="overflow-hidden rounded-2xl bg-accent px-12 py-7 text-base font-semibold tracking-wider text-accent-foreground transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-accent/90"
        >
          Get in touch
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg rounded-2xl border-border bg-background shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">
            Ginger Beer Weddings — Inquiry
          </DialogTitle>
          <p className="text-sm text-muted-foreground pt-1">
            Tell us about your wedding day and we'll get back to you within 24 hours.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">

          {/* Names */}
          <div className="space-y-1">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Your Names <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane & John Smith"
              required
              className="rounded-xl border-border bg-background"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="We'll reply to this address"
              required
              className="rounded-xl border-border bg-background"
            />
          </div>

          {/* Wedding Date */}
          <div className="space-y-1">
            <Label htmlFor="date" className="text-sm font-medium text-foreground">
              Wedding Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl border-border bg-background"
            />
          </div>

          {/* Services multi-select */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              What are you looking for? <span className="text-destructive">*</span>
            </Label>
            {SERVICES.map((group) => (
              <div key={group.category} className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold pt-1">
                  {group.category}
                </p>
                {group.items.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3 cursor-pointer rounded-xl border px-3 py-2 transition-all ${
                      selected.includes(item.id)
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(item.id)}
                      onChange={() => toggleService(item.id)}
                      className="mt-1 h-4 w-4 accent-accent cursor-pointer"
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            ))}
          </div>

          {/* Message */}
          <div className="space-y-1">
            <Label htmlFor="message" className="text-sm font-medium text-foreground">
              Tell us about your day
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Style, special moments, anything you'd like us to know"
              rows={3}
              className="rounded-xl border-border bg-background resize-none"
            />
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              required
              className="mt-1 h-4 w-4 rounded border-border accent-accent cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
              I agree to the{" "}
              <a href="/terms" className="underline text-foreground hover:text-accent transition-colors">
                Terms & Conditions
              </a>{" "}
              and consent to being contacted by Ginger Beer Weddings.
            </label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent py-5 font-semibold tracking-wide text-accent-foreground transition-all duration-300 hover:bg-accent/90 hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Message →"}
          </Button>

          <p className="text-center text-xs text-muted-foreground pb-2">
            We typically respond within 24 hours
          </p>

        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
