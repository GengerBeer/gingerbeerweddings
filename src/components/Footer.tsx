import logoIcon from "@/assets/logo-icon.png";

const footerLinks = ["Portfolio", "Services", "Investment", "Process", "Contact"];

const socials = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Vimeo",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 7c-.1 2.3-1.7 5.4-4.7 9.3C14.2 20.4 11.5 22 9.3 22c-1.3 0-2.4-1.2-3.3-3.6L4.5 13C3.8 10.6 3 9.4 2.2 9.4c-.2 0-.8.4-1.9 1.1L0 9.3c1.2-1.1 2.4-2.1 3.5-3.2C5.2 4.6 6.4 3.8 7.2 3.7c1.9-.2 3.1 1.1 3.5 3.9.5 3 .8 4.9 1 5.6.5 2.4 1.1 3.6 1.8 3.6.5 0 1.3-.8 2.3-2.3 1.1-1.5 1.6-2.7 1.7-3.4.1-1.3-.4-1.9-1.7-1.9-.6 0-1.2.1-1.9.4 1.3-4.2 3.7-6.2 7.3-6.1C21.5 3.6 22.1 5 22 7z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="section-dark border-t border-white/5 relative overflow-hidden">
      {/* Watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-serif font-extrabold uppercase whitespace-nowrap"
          style={{
            fontSize: "clamp(5rem, 15vw, 14rem)",
            color: "hsl(188 41% 25% / 0.12)",
            letterSpacing: "0.08em",
          }}
        >
          Ginger Beer
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 mb-16">

          {/* Brand */}
          <div className="flex flex-col gap-5">
            <img
              src={logoIcon}
              alt="Ginger Beer Films"
              className="h-14 w-auto object-contain object-left"
              style={{ filter: "brightness(0) saturate(100%) invert(85%) sepia(15%) saturate(500%) hue-rotate(5deg)" }}
            />
            <p className="font-sans text-brand-cream/40 text-sm leading-relaxed max-w-xs">
              Wedding post-production studio crafting cinematic films for modern couples and filmmakers across the US.
            </p>
            {/* Socials */}
            <div className="flex gap-4 mt-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="text-brand-cream/40 hover:text-brand-sand transition-colors duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div className="flex flex-col gap-4 md:items-center">
            <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-brand-cream/25 mb-2">Pages</p>
            {footerLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="nav-link font-sans text-sm text-brand-cream/50 hover:text-brand-cream transition-colors duration-200 w-fit"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4 md:items-end">
            <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-brand-cream/25 mb-2">Get In Touch</p>
            <a
              href="mailto:hello@gingerbeerstudio.com"
              className="font-sans text-sm text-brand-cream/50 hover:text-brand-cream transition-colors"
            >
              hello@gingerbeerstudio.com
            </a>
            <a
              href="#contact"
              className="btn-primary mt-4"
            >
              Check Availability
            </a>
          </div>
        </div>

        <div className="divider-dark" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8">
          <p className="font-sans text-[11px] text-brand-cream/20 uppercase tracking-widest">
            © {new Date().getFullYear()} Ginger Beer Films. All rights reserved.
          </p>
          <p className="font-sans text-[11px] text-brand-cream/20 uppercase tracking-widest">
            United States · Remote Worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
