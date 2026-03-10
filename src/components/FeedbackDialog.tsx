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
  const [package_, setPackage] = useState("");
  const [message, setMessage] = useState("");
  const [terms, setTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      access_key: "8e3ce2bf-3bd5-4955-8ec4-9d832658c8f9",
      name,
      email,
      wedding_date: date,
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
        setPackage("");
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

          {/* Your Names */}
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

          {/* Package */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              What are you looking for? <span className="text-destructive">*</span>
            </Label>
            <div className="space-y-2">
              {[
                "Highlight Film (3–5 min)",
                "Full Wedding Film",
                "Highlight + Full Film",
                "Not sure yet",
              ].map((option) => (
                <label key={option} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="package"
                    value={option}
                    checked={package_ === option}
                    onChange={() => setPackage(option)}
                    required
                    className="h-4 w-4 accent-accent"
                  />
                  <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                    {option}
                  </span>
                </label>
              ))}
            </div>
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
              rows={4}
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
              <a href="/terms" target="_blank" className="underline text-foreground hover:text-accent transition-colors">
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
