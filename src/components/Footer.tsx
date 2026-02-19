import logoIcon from "@/assets/logo-icon.png";

const footerLinks = ["Portfolio", "Services", "Investment", "Process", "Contact"];

export default function Footer() {
  return (
    <footer className="section-dark border-t border-brand-dark">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <img src={logoIcon} alt="Ginger Beer Films" className="h-14 w-auto object-contain object-left" style={{ filter: "brightness(0) saturate(100%) invert(85%) sepia(15%) saturate(500%) hue-rotate(5deg)" }} />
            <p className="font-sans text-brand-cream/45 text-sm leading-relaxed max-w-xs">
              Wedding post-production studio crafting cinematic films for modern couples and filmmakers across the US.
            </p>
          </div>

          {/* Nav */}
          <div className="flex flex-col gap-4 md:items-center">
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-cream/30 mb-2">Pages</p>
            {footerLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="font-sans text-sm text-brand-cream/55 hover:text-brand-cream transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4 md:items-end">
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-cream/30 mb-2">Get In Touch</p>
            <a
              href="mailto:hello@gingerbeerstudio.com"
              className="font-sans text-sm text-brand-cream/55 hover:text-brand-cream transition-colors"
            >
              hello@gingerbeerstudio.com
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border border-brand-sand/50 text-brand-sand font-sans text-[11px] uppercase tracking-widest px-5 py-2.5 hover:bg-brand-sand hover:text-foreground transition-all duration-300 mt-4"
            >
              Check Availability
            </a>
          </div>
        </div>

        <div className="divider-dark" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8">
          <p className="font-sans text-[11px] text-brand-cream/25 uppercase tracking-widest">
            © {new Date().getFullYear()} Ginger Beer Films. All rights reserved.
          </p>
          <p className="font-sans text-[11px] text-brand-cream/25 uppercase tracking-widest">
            United States · Remote Worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
