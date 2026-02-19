import { useState, useEffect } from "react";
import logoHorizontal from "@/assets/logo-horizontal.png";

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "nav-scrolled" : "nav-top"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center shrink-0">
          <img
            src={logoHorizontal}
            alt="Ginger Beer Films"
            className={`h-7 md:h-8 w-auto transition-all duration-500 ${
              scrolled ? "opacity-100" : "opacity-90"
            }`}
            style={{ filter: scrolled ? "none" : "brightness(0) invert(1)" }}
          />
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={`text-label uppercase tracking-widest font-sans text-[11px] font-medium transition-colors duration-300 hover:opacity-70 ${
                  scrolled ? "text-foreground" : "text-brand-cream"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#contact"
          className={`hidden md:inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-sans font-medium border px-5 py-2.5 transition-all duration-300 hover:opacity-80 ${
            scrolled
              ? "border-foreground text-foreground hover:bg-foreground hover:text-background"
              : "border-brand-cream text-brand-cream hover:bg-brand-cream hover:text-foreground"
          }`}
        >
          Check Availability
        </a>

        {/* Mobile hamburger */}
        <button
          className={`md:hidden flex flex-col gap-1.5 ${scrolled ? "text-foreground" : "text-brand-cream"}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-px bg-current transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-px bg-current transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-px bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden section-cream border-t border-border px-6 py-8 flex flex-col gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-label uppercase tracking-widest font-sans text-[12px] font-medium text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-sans font-medium border border-foreground text-foreground px-5 py-2.5 w-fit"
          >
            Check Availability
          </a>
        </div>
      )}
    </header>
  );
}
