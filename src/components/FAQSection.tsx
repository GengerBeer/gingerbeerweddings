import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Do you work with videographers?",
    a: "Yes — a significant portion of our work is with professional videographers and production companies. We offer streamlined file transfer workflows, style matching, and custom volume pricing for ongoing collaborations.",
  },
  {
    q: "Do you work directly with couples?",
    a: "Absolutely. We work with couples who have their own raw footage and want a cinematic edit crafted from it. We guide you through the entire process, step by step.",
  },
  {
    q: "How long does editing take?",
    a: "Teasers: 7–14 days. Highlight films: 3–4 weeks. Full wedding films: 4–6 weeks. Rush options are available — see below.",
  },
  {
    q: "How many revisions are included?",
    a: "Teaser: 1 revision. Highlight Film: 2 revisions. Full Film: discussed per project. Additional revisions can be added at a flat rate.",
  },
  {
    q: "Do you match my style?",
    a: "Yes. We ask for 2–3 reference films during onboarding and study your preferred aesthetic — color grade, pacing, music feel — before cutting a single frame.",
  },
  {
    q: "Do you offer rush delivery?",
    a: "Rush delivery (50% faster than standard) is available for an additional fee. Availability depends on our current schedule. Contact us to check.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="section-cream py-28 md:py-40">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-16">
          <p className="text-label uppercase tracking-[0.2em] text-muted-foreground font-sans text-[10px] mb-4">
            FAQ
          </p>
          <h2 className="font-serif text-display-lg text-foreground font-light">
            Common Questions
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-0">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="border-t border-border last:border-b">
                <button
                  className="w-full flex items-center justify-between py-7 text-left group"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-xl md:text-2xl text-foreground font-light group-hover:text-brand-teal transition-colors duration-200 pr-8">
                    {faq.q}
                  </span>
                  <div className="shrink-0 w-8 h-8 rounded-full border border-border flex items-center justify-center transition-all duration-200 group-hover:border-foreground">
                    {isOpen ? (
                      <Minus size={14} className="text-foreground" />
                    ) : (
                      <Plus size={14} className="text-foreground" />
                    )}
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? "max-h-60 pb-7" : "max-h-0"
                  }`}
                >
                  <p className="font-sans text-muted-foreground text-sm leading-relaxed max-w-2xl">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
