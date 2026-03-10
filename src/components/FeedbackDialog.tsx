import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const FeedbackDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="overflow-hidden rounded-2xl bg-accent px-12 py-7 text-base font-semibold tracking-wider text-accent-foreground transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-accent/90"
        >
          Get in touch
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl rounded-2xl border-border bg-background shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="px-8 pt-8 pb-4">
          <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">
            Let's film your story
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Tell us about your wedding and we'll get back to you within 24 hours.
          </p>
        </DialogHeader>
        <div className="w-full px-2 pb-4">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdr1ojkhyEu0--f79J4tVOikzRUmS22cY74KigOhOE5PCW12Q/viewform?embedded=true"
            width="100%"
            height="600"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            className="rounded-xl"
          >
            Loading…
          </iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
