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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your message!");
    setName("");
    setEmail("");
    setMessage("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="overflow-hidden rounded-2xl bg-accent px-12 py-7 text-base font-semibold tracking-wider text-accent-foreground transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-accent/90"
        >
          Contact
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl border-border bg-background shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            Get in touch
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground/80">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="rounded-2xl border-border bg-background transition-colors"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground/80">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              className="rounded-2xl border-border bg-background transition-colors"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-foreground/80">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message..."
              rows={4}
              required
              className="rounded-2xl border-border bg-background transition-colors"
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-2xl bg-accent py-5 font-semibold tracking-wide text-accent-foreground transition-all duration-300 hover:bg-accent/90 hover:scale-[1.02]"
          >
            Send
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
