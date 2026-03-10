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

const FeedbackDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [package_, setPackage] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      access_key: "8e3ce2bf-3bd5-4955-8ec4-9d832658c8f9",
      name,
      email,
      wedding_date: date,
      venue,
      package: package_,
      message,
      subject: `New inquiry from ${name} — Ginger Beer Weddings`,
    };

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Thank you! We'll be in touch soon 🎬");
        setName("");
        setEmail("");
        setDate("");
        setVenue("");
        setPackage("");
        setMessage("");
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
      <DialogContent className="sm:max-w-lg rounded-2xl border-border bg-background shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">
            Let's film your story
          </DialogTitle>
          <p className="text-sm text-muted-foreground pt-1">
            Tell us about your wedding and we'll get back to you within 24 hours.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground/80 text-xs uppercase tracking-widest">Your Names</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane & John"
                required
                className="rounded-xl border-border bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="text-foreground/80 text-xs uppercase tracking-widest">Wedding Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-xl border-border bg-background"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground/80 text-xs uppercase tracking-widest">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@example.com"
              required
              className="rounded-xl border-border bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue" className="text-foreground/80 text-xs uppercase tracking-widest">Venue / Location</Label>
            <Input
              id="venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="City and venue name"
              className="rounded-xl border-border bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="package" className="text-foreground/80 text-xs uppercase tracking-widest">What are you looking for?</Label>
            <select
              id="package"
              value={package_}
              onChange={(e) => setPackage(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a package...</option>
              <option value="Highlight Film (3–5 min)">Highlight Film (3–5 min)</option>
              <option value="Full Wedding Film">Full Wedding Film</option>
              <option value="Highlight + Full Film">Highlight + Full Film</option>
              <option value="Not sure yet">Not sure yet</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-foreground/80 text-xs uppercase tracking-widest">Tell us about your day</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Style, special moments, anything you'd like us to know..."
              rows={3}
              required
              className="rounded-xl border-border bg-background resize-none"
            />
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-1 h-4 w-4 rounded border-border accent-accent cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
              I agree to the{" "}
              <a href="/terms" target="_blank" className="underline text-foreground hover:text-accent transition-colors">Terms & Conditions</a>
              {" "}and consent to being contacted by Ginger Beer Weddings regarding my inquiry.
            </label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent py-5 font-semibold tracking-wide text-accent-foreground transition-all duration-300 hover:bg-accent/90 hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Message →"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            We typically respond within 24 hours
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
