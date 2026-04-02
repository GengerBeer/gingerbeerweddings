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

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const VimeoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 7c-.1 2.3-1.7 5.4-4.7 9.3C14.2 20.4 11.5 22 9.3 22c-1.3 0-2.4-1.2-3.3-3.6L4.5 13C3.8 10.6 3 9.4 2.2 9.4c-.2 0-.8.4-1.9 1.1L0 9.3c1.2-1.1 2.4-2.1 3.5-3.2C5.2 4.6 6.4 3.8 7.2 3.7c1.9-.2 3.1 1.1 3.5 3.9.5 3 .8 4.9 1 5.6.5 2.4 1.1 3.6 1.8 3.6.5 0 1.3-.8 2.3-2.3 1.1-1.5 1.6-2.7 1.7-3.4.1-1.3-.4-1.9-1.7-1.9-.6 0-1.2.1-1.9.4 1.3-4.2 3.7-6.2 7.3-6.1C21.5 3.6 22.1 5 22 7z" />
  </svg>
);

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 animate-fade-down ${scrolled ? "nav-scrolled" : "nav-top"} ${menuOpen ? "bg-[#FAEEE9]" : ""}`}>
        <nav className="max-w-7xl mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between">
          <a href="#" className="flex items-center self-center shrink-0 leading-none relative z-50">
            <img src={scrolled || menuOpen ? logoDark : logoLight} alt="Ginger Beer Films" className="h-[34px] md:h-[38px] w-auto block transition-all duration-500 -translate-y-[1px] md:-translate-y-[2px]" />
          </a>
          <ul className="hidden lg:flex items-center self-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label} className="flex items-center">
                <a href={link.href} className={`nav-link text-label uppercase tracking-widest font-sans text-[11px] font-medium transition-colors duration-300 ${scrolled ? "text-foreground" : "text-brand-cream"}`}>{link.label}</a>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setBookOpen(true)}
            className={`hidden lg:inline-flex items-center self-center gap-2 text-[11px] uppercase tracking-widest font-sans font-medium px-5 py-2.5 rounded-full border transition-all duration-300 ${scrolled ? "border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-brand-cream" : "border-brand-cream text-brand-cream hover:bg-brand-cream/10 hover:border-brand-cream"}`}
          >
            Book a Call
          </button>
          <button
            className={`lg:hidden flex flex-col gap-[5px] items-center justify-center relative z-50 ${(scrolled || menuOpen) ? "text-foreground" : "text-brand-cream"}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
            <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 bottom-0 z-[50] flex flex-col bg-[#FAEEE9] transition-all duration-500 ease-in-out ${menuOpen ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-full"}`}
      >
        {/* Nav Links — centered vertically */}
        <div className="flex-1 flex flex-col items-center justify-center gap-1 pt-16">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-sans font-semibold uppercase tracking-[0.2em] text-[15px] text-[#1a1a1a] py-3 px-6 transition-all duration-300 hover:text-[#b07d5c] relative group"
              style={{
                transform: menuOpen ? "translateY(0)" : "translateY(16px)",
                opacity: menuOpen ? 1 : 0,
                transitionDelay: `${menuOpen ? 80 + i * 45 : 0}ms`,
                transitionProperty: "transform, opacity, color",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {link.label}
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-px bg-[#b07d5c] group-hover:w-6 transition-all duration-300" />
            </a>
          ))}

          {/* Book a Call */}
          <div
            className="mt-6"
            style={{
              transform: menuOpen ? "translateY(0)" : "translateY(16px)",
              opacity: menuOpen ? 1 : 0,
              transitionDelay: `${menuOpen ? 80 + navLinks.length * 45 : 0}ms`,
              transitionProperty: "transform, opacity",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              transitionDuration: "300ms",
            }}
          >
            <button
              onClick={() => { setMenuOpen(false); setBookOpen(true); }}
              className="font-sans font-semibold uppercase tracking-[0.2em] text-[13px] px-8 py-3 rounded-full bg-brand-teal text-brand-cream hover:opacity-85 transition-all duration-300"
            >
              Book a Call
            </button>
          </div>
        </div>

        {/* Social Icons — bottom */}
        <div
          className="flex items-center justify-center gap-6 pb-12"
          style={{
            transform: menuOpen ? "translateY(0)" : "translateY(12px)",
            opacity: menuOpen ? 1 : 0,
            transitionDelay: `${menuOpen ? 80 + (navLinks.length + 1) * 45 : 0}ms`,
            transitionProperty: "transform, opacity",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDuration: "300ms",
          }}
        >
          <a href="#" aria-label="Instagram" className="text-[#1a1a1a]/40 hover:text-[#b07d5c] transition-colors duration-200">
            <InstagramIcon />
          </a>
          <a href="#" aria-label="Vimeo" className="text-[#1a1a1a]/40 hover:text-[#b07d5c] transition-colors duration-200">
            <VimeoIcon />
          </a>
        </div>
      </div>

      <BookCallDialog open={bookOpen} onClose={() => setBookOpen(false)} />
    </>
  );
}

