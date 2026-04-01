import { useState, useEffect } from "react";
import logoLight from "@/assets/logo-vector.svg";
import logoDark from "@/assets/logo-vector-dark-green.svg";
import BookCallDialog from "@/components/BookCallDialog";

const navLinks = [
  { label: "Portfolio", href: "#portfolio" },
  { label: "Services", href: "#services" },
  { label: "Why GBW", href: "#why-outsource" },
  { label: "About", href: "#about" },
  { label: "Pricing", href: "#investment" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 animate-fade-down ${scrolled ? "nav-scrolled" : "nav-top"} ${menuOpen ? "bg-[#FAEEE9]" : ""}`}>
        <nav className="max-w-7xl mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between">
          <a href="#" className="flex items-center self-center shrink-0 leading-none relative z-50">
            <img src={scrolled || menuOpen ? logoDark : logoLight} alt="Ginger Beer Films" className="h-[34px] md:h-[38px] w-auto block transition-all duration-500 -translate-y-[1px] md:-translate-y-[2px]" />
          </a>
          <ul className="hidden lg:flex items-center self-center gap-8">
            {navLinks.map((link) => (<li key={link.label} className="flex items-center"><a href={link.href} className={`nav-link text-label uppercase tracking-widest font-sans text-[11px] font-medium transition-colors duration-300 ${scrolled ? "text-foreground" : "text-brand-cream"}`}>{link.label}</a></li>))}
          </ul>
          <button onClick={() => setBookOpen(true)} className={`hidden lg:inline-flex items-center self-center gap-2 text-[11px] uppercase tracking-widest font-sans font-medium px-5 py-2.5 rounded-full border transition-all duration-300 ${scrolled ? "border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-brand-cream" : "border-brand-cream text-brand-cream hover:bg-brand-cream/10 hover:border-brand-cream"}`}>Book a Call</button>
          <button className={`lg:hidden flex flex-col gap-1.5 relative z-50 ${(scrolled || menuOpen) ? "text-foreground" : "text-brand-cream"}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </nav>
      </header>
      <div className={`lg:hidden fixed top-0 left-0 right-0 bottom-0 z-[50] overflow-hidden transition-all duration-500 ease-in-out flex flex-col items-center justify-center bg-[#FAEEE9] ${menuOpen ? "opacity-100 pointer-events-auto shadow-2xl translate-y-0" : "opacity-0 pointer-events-none -translate-y-full"}`}>
        <div className="flex flex-col items-center gap-8 w-full px-6">
          {navLinks.map((link, i) => (<a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} className="text-foreground font-sans font-normal uppercase tracking-[0.1em] text-4xl sm:text-5xl transition-transform duration-500 ease-out hover:scale-105" style={{ transform: menuOpen ? "translateY(0)" : "translateY(20px)", opacity: menuOpen ? 1 : 0, transitionDelay: `${menuOpen ? 100 + i * 50 : 0}ms` }}>{link.label}</a>))}
          <button onClick={() => { setMenuOpen(false); setBookOpen(true); }} className="mt-8 btn-outline-dark font-sans font-normal !text-4xl sm:!text-5xl uppercase tracking-[0.1em] px-10 py-5 sm:px-12 sm:py-6 !border-[3px] transition-transform duration-500 ease-out" style={{ transform: menuOpen ? "translateY(0)" : "translateY(20px)", opacity: menuOpen ? 1 : 0, transitionDelay: `${menuOpen ? 100 + navLinks.length * 50 : 0}ms` }}>Book a Call</button>
        </div>
      </div>
      <BookCallDialog open={bookOpen} onClose={() => setBookOpen(false)} />
    </>
  );
}
