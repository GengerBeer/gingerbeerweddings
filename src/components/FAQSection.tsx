import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  { q: "Do you work with videographers?", a: "That's literally all we do. You shoot, we edit. Your brand, your clients — we're the team behind your team." },
  { q: "How does the free test edit work?", a: "Send us footage from any wedding. We'll cut a 60-second teaser — graded, music-synced, delivered within 7 days. If you like it, we talk next steps. If not, you keep the edit and we part as friends." },
  { q: "Do you work with couples?", a: "We can. But our sweet spot is filmmakers. If you're a couple with footage and no editor — get in touch." },
  { q: "How long does editing take?", a: "14 days from the moment we have your footage, folder structure, and deposit. Rush: 7 days. Next-day: teasers and highlights. Same-day recaps by midnight." },
  { q: "How many revisions?", a: "Two rounds, included. One consolidated list per round. Extra rounds: $50. Music changes after approval: $90." },
  { q: "Will you match my style?", a: "That's the whole point. You fill out a brief, we study your portfolio, and deliver an edit that looks and feels like yours." },
  { q: "What software do you use?", a: "DaVinci Resolve. Exclusively. XML export available if you need Premiere or Final Cut." },
  { q: "Why not just hire an in-house editor?", a: "You can. But an editor costs $3–5K/month whether you have 0 weddings or 10. They take vacations in August. They quit mid-season. We're a team that scales with your workload, keeps your style on file even if people change, and doesn't send you a payroll bill in January." },
  { q: "What’s always included?", a: "Color grading, licensed music, AI audio cleanup, and all export files. No surprise add-ons." },
  { q: "How do I send footage?", a: "Secure upload link after booking. Ideal: /Camera_A, /Camera_B, /Drone, /Audio. Not sorted? We’ll organize it for $50." },
  { q: "Payment?", a: "50% to book. Balance before final delivery. Rush and same-day: 100% upfront." },
  { q: "Can you remove stuff from footage?", a: "People, wires, logos, exit signs — $100/hour after assessment. We fix things clients call unfixable." },
  { q: "Multi-day weddings?", a: "2 days +$100, 3 days +$200. Multi-camera surcharges at 5+ cameras. Everything outlined upfront." },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const VISIBLE_COUNT = 6;
  const displayedFaqs = showAll ? faqs : faqs.slice(0, VISIBLE_COUNT);

  return (
    <section id="faq" className="section-cream py-28 md:py-40">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <div className="mb-12 md:mb-16">
          <p className="text-label uppercase tracking-[0.2em] text-muted-foreground font-sans text-[10px] mb-4">FAQ</p>
          <h2 className="font-serif text-display-lg text-foreground font-extrabold">Common Questions</h2>
        </div>
        <div className="space-y-0">
          {displayedFaqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="border-t border-border last:border-b">
                <button className="w-full flex items-center justify-between py-7 text-left group" onClick={() => setOpenIndex(isOpen ? null : i)} aria-expanded={isOpen}>
                  <span className="font-serif text-xl md:text-2xl text-foreground font-extrabold group-hover:text-brand-teal transition-colors duration-200 pr-8">{faq.q}</span>
                  <div className="shrink-0 w-8 h-8 rounded-full border border-border flex items-center justify-center transition-all duration-200 group-hover:border-foreground">
                    {isOpen ? <Minus size={14} className="text-foreground" /> : <Plus size={14} className="text-foreground" />}
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-60 pb-7" : "max-h-0"}`}>
                  <p className="font-sans text-muted-foreground text-sm leading-relaxed max-w-2xl">{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
        {faqs.length > VISIBLE_COUNT && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center justify-center font-sans text-[11px] uppercase tracking-widest rounded-full px-8 py-3.5 transition-all duration-300 font-medium border border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-brand-cream"
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
