import { useEffect, useRef } from "react";
import { Users, Calendar, CreditCard, Paintbrush, Zap, PhoneCall } from "lucide-react";

const reasons = [
  {
    icon: Users,
    title: "Bigger than a freelancer.\nCloser than an agency.",
    desc: "You get the capacity of a full editing team with the communication style of a trusted partner. If one editor is at capacity, another picks up seamlessly. You don't notice. You just get your files on time. Every time.",
  },
  {
    icon: Calendar,
    title: "We don't take vacations\nin wedding season.",
    desc: "June through October, we're here. No time-off requests, no “I'll get to it Monday.” Your busiest months are our busiest months — and we built the team to handle it.",
  },
  {
    icon: CreditCard,
    title: "Pay per project.\nNot per month.",
    desc: "January: zero weddings, zero cost. August: eight weddings, you pay for eight. No salary, no benefits, no overhead when the calendar is empty. Your editing budget scales with your revenue, not against it.",
  },
  {
    icon: Paintbrush,
    title: "Your style stays.\nEven if people change.",
    desc: "In-house editor leaves — your style walks out the door with them. Three months retraining a new hire. At GBW, your brief, references, and style guide live in our system. Editor changes happen inside our team — you never feel it.",
  },
  {
    icon: Zap,
    title: "Next-day teasers.\nNo in-house editor can.",
    desc: "One person can't edit a teaser in 24 hours while juggling three other projects. We can — because we have dedicated rush capacity. Your couple posts Sunday morning. Your inbox fills up Monday.",
  },
  {
    icon: PhoneCall,
    title: "Always reachable.\nDirect line to your editor.",
    desc: "No tickets, no account managers, no “we'll get back to you in 2-3 business days.” You talk directly to the people who touch your footage. Got a question at 11pm before a Saturday wedding? We're here.",
  },
];

export default function WhyOutsourceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );
    sectionRef.current?.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="why-outsource" ref={sectionRef} className="section-cream py-28 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16 md:mb-24 reveal text-center md:text-left">
          <p className="text-label uppercase tracking-[0.25em] text-brand-teal/70 font-sans text-[10px] mb-4">
            WHY GBW
          </p>
          <h2 className="font-serif text-display-lg text-brand-dark font-extrabold">
            Why Outsource to Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 mt-12 md:mt-16">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <div 
                key={i} 
                className={`reveal reveal-delay-${(i % 3) + 1} flex flex-col`}
              >
                <div className="w-14 h-14 rounded-full bg-brand-sand/50 flex items-center justify-center mb-8 text-brand-teal">
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl md:text-2xl text-brand-dark font-bold mb-4 whitespace-pre-line leading-snug">
                  {reason.title}
                </h3>
                <p className="font-sans text-brand-dark/80 text-sm md:text-base leading-relaxed">
                  {reason.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
