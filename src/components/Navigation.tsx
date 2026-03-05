import { useState, useEffect } from "react";
import logoLight from "@/assets/logo-vector.svg";
import logoDark from "@/assets/logo-vector-dark.svg";

const navLinks = [
  { label: "Portfolio", href: "#portfolio" },
  { label: "Services", href: "#services" },
  { label: "Investment", href: "#investment" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 animate-fade-down ${scrolled ? "nav-scrolled" : "nav-top"
        }`}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center self-center shrink-0 leading-none">
          <img
            src={scrolled ? logoDark : logoLight}
            alt="Ginger Beer Films"
            className="h-10 md:h-11 w-auto block transition-all duration-500 -translate-y-[1px] md:-translate-y-[2px]"
          />
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center self-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label} className="flex items-center">
              <a
                href={link.href}
                className={`nav-link text-label uppercase tracking-widest font-sans text-[11px] font-medium transition-colors duration-300 ${scrolled ? "text-foreground" : "text-brand-cream"
                  }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#book"
          className={`hidden md:inline-flex items-center self-center gap-2 text-[11px] uppercase tracking-widest font-sans font-medium px-5 py-2.5 rounded-full border transition-all duration-300 ${scrolled
            ? "border-brand-burgundy text-brand-burgundy hover:bg-brand-burgundy hover:text-brand-cream"
            : "border-brand-cream text-brand-cream hover:bg-brand-cream/10 hover:border-brand-cream"
            }`}
        >
          Book a Call
        </a>

        {/* Mobile hamburger */}
        <button
          className={`md:hidden flex flex-col gap-1.5 ${scrolled ? "text-foreground" : "text-brand-cream"}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu — animated slide-down */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        style={{ background: "rgba(250, 238, 233, 0.97)", backdropFilter: "blur(16px)" }}
      >
        <div className="px-6 py-8 flex flex-col gap-5 border-t border-border">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="nav-link text-label uppercase tracking-widest font-sans text-[12px] font-medium text-foreground w-fit"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#book"
            onClick={() => setMenuOpen(false)}
            className="btn-outline-dark w-fit mt-2"
          >
            Book a Call
          </a>
        </div>
      </div>
    </header>
  );
}
