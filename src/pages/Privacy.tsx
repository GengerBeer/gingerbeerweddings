import logoLight from "@/assets/logo-vector.svg";

export default function Privacy() {
  return (
    <div className="min-h-screen" style={{ background: "#0B2C31" }}>
      {/* Nav */}
      <div className="border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <a href="/">
            <img
              src={logoLight}
              alt="Ginger Beer Weddings"
              className="h-8 w-auto"
              style={{ filter: "brightness(0) saturate(100%) invert(85%) sepia(15%) saturate(500%) hue-rotate(5deg)" }}
            />
          </a>
          <a href="/" className="font-sans text-[11px] uppercase tracking-[0.2em] text-brand-cream/40 hover:text-brand-cream transition-colors">
            ← Back
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-sand/60 mb-3">Legal</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-cream leading-tight">
            Privacy Policy
          </h1>
          <p className="font-sans text-sm text-brand-cream/40 mt-4">
            Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <p className="font-sans text-sm text-brand-cream/50 mt-6 max-w-2xl leading-relaxed">
            Trade name of Alatyr Systems LLC (Алатир Системс ООД) · UIC: 208718143 · VAT No: BG208718143<br/>
            ul. Kiparis, ZhK Poseydon, bl. Orion, et. 3, ap. D31, Nesebar 8240, Bulgaria
          </p>
        </div>

        <div className="divider-dark mb-12" />

        {/* Body */}
        <div className="prose-legal">

          <p>Ginger Beer Weddings ("we," "us," or "our") is committed to protecting your personal data. This Privacy Policy explains what data we collect, how we use it, and your rights. It applies to all interactions with gingerbeerweddings.com and related services. By using our services or submitting an order, you confirm you have read and understood this Policy.</p>

          <h2>1. Data Controller</h2>
          <p>Ginger Beer Weddings · <a href="mailto:hello@gingerbeerweddings.com">hello@gingerbeerweddings.com</a> · gingerbeerweddings.com</p>
          <p>For all privacy inquiries or to exercise your rights, contact <a href="mailto:hello@gingerbeerweddings.com">hello@gingerbeerweddings.com</a>. We respond within 30 days. The competent supervisory authority is the Commission for Personal Data Protection (CPDP, <a href="https://cpdp.bg" target="_blank" rel="noopener">cpdp.bg</a>).</p>

          <h2>2. Data We Collect</h2>
          <p>Data you provide directly:</p>
          <ul>
            <li>Identification — name, email, phone number</li>
            <li>Project data — wedding date, footage details, brief content, style preferences</li>
            <li>Payment data — processed by third-party payment processors; we do not store card or bank details</li>
            <li>Communications — emails and messages between you and us</li>
          </ul>
          <p>Data collected automatically when you visit our website: IP address, browser type, pages visited, session duration. Used only for security monitoring and website improvement.</p>

          <h2>3. Legal Basis for Processing</h2>
          <ul>
            <li>Art. 6(1)(b) GDPR — Performance of contract: to fulfil your order and deliver services</li>
            <li>Art. 6(1)(f) GDPR — Legitimate interests: website security, fraud prevention, service improvement</li>
            <li>Art. 6(1)(c) GDPR — Legal obligation: VAT record-keeping and applicable Bulgarian law</li>
            <li>Art. 6(1)(a) GDPR — Consent: portfolio and marketing use of your footage</li>
          </ul>
          <p>You may withdraw consent at any time by contacting <a href="mailto:hello@gingerbeerweddings.com">hello@gingerbeerweddings.com</a>. Withdrawal does not affect prior processing.</p>

          <h2>4. How We Use Your Data</h2>
          <ul>
            <li>To process and deliver your order</li>
            <li>To communicate about your project — status updates, revisions, delivery</li>
            <li>To issue VAT-compliant invoices</li>
            <li>To respond to inquiries and provide support</li>
            <li>To improve our services and website</li>
            <li>To comply with legal obligations</li>
            <li>For portfolio and marketing use, where consent has been given (see Section 9)</li>
          </ul>

          <h2>5. Data Sharing</h2>
          <p>We do not sell your data. We share it only with trusted service providers acting on our documented instructions, including:</p>
          <ul>
            <li>Dropbox, WeTransfer, Frame.io — secure footage and deliverable transfer</li>
            <li>Stripe, Wise — payment processing</li>
            <li>Google Workspace — email and document management</li>
            <li>Supabase (EU region, Frankfurt eu-central-1) — CRM and invoice data storage</li>
            <li>Vercel — hosting of our internal platform</li>
          </ul>
          <p>All processors are bound by Data Processing Agreements under Art. 28 GDPR. Data may also be disclosed where required by applicable law or court order.</p>

          <h2>6. Cookies &amp; Analytics</h2>
          <p>Our website uses cookies for security, personalisation, and analytics. Where required by law, we display a consent banner on your first visit. You may manage cookies via your browser settings at any time.</p>
          <p>We may use Google Analytics to compile anonymised usage reports. You can opt out at <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">tools.google.com/dlpage/gaoptout</a>.</p>

          <h2>7. Data Retention</h2>
          <ul>
            <li>Client identification and contact data: 5 years from project conclusion</li>
            <li>Invoices and payment records: 10 years (Bulgarian Accountancy Act)</li>
            <li>Source footage: deleted after 12 months from final delivery, or earlier if storage requires</li>
            <li>Edited masters and final deliverables: retained indefinitely unless otherwise agreed in writing</li>
            <li>Marketing footage (consent-based): until consent is withdrawn</li>
            <li>Website technical logs: 12 months</li>
          </ul>
          <p>Upon expiry, data is securely deleted or anonymised. You may request early deletion subject to applicable legal retention obligations.</p>

          <h2>8. Security</h2>
          <p>We implement appropriate technical and organisational measures under Art. 32 GDPR, including encrypted file transfer (TLS/SSL), access controls, and regular security reviews. In the event of a data breach posing risk to your rights, we will notify the CPDP within 72 hours and you directly without undue delay where required.</p>

          <h2>9. Portfolio &amp; Marketing Use</h2>
          <p>By confirming an order, you grant us a non-exclusive, royalty-free, worldwide licence to use excerpts of delivered footage and finished films for portfolio, marketing, and promotional purposes, including on our website and social media.</p>
          <p>If you do not wish your footage to be used for promotional purposes, notify us in writing before production begins. In the event of an approved refund, this consent is withdrawn and all associated marketing materials will be removed without undue delay.</p>

          <h2>10. Your Rights</h2>
          <p>Under GDPR Articles 15–22, you have the right to:</p>
          <ul>
            <li>Access — obtain a copy of your data and how it is processed</li>
            <li>Rectification — correct inaccurate or incomplete data</li>
            <li>Erasure — request deletion, subject to legal retention obligations</li>
            <li>Restriction — limit processing in certain circumstances</li>
            <li>Portability — receive your data in a machine-readable format</li>
            <li>Object — to processing based on legitimate interests</li>
            <li>Withdraw consent — at any time, without affecting prior processing</li>
            <li>Complain — to the CPDP (<a href="https://cpdp.bg" target="_blank" rel="noopener">cpdp.bg</a>) or the supervisory authority of your country of residence</li>
          </ul>
          <p>Submit requests to <a href="mailto:hello@gingerbeerweddings.com">hello@gingerbeerweddings.com</a>. We may verify your identity before processing. We respond within 30 days.</p>

          <h2>11. International Transfers</h2>
          <p>As a Bulgarian company (EU Member State), data transfers within the EEA are unrestricted. Where data is transferred to third countries (e.g., US-based service providers), we ensure appropriate safeguards are in place under Chapter V GDPR, including Standard Contractual Clauses and adequacy decisions where applicable.</p>

          <h2>12. Children's Privacy</h2>
          <p>Our services are not directed at individuals under 18. If you believe a minor has submitted personal data without appropriate consent, contact <a href="mailto:hello@gingerbeerweddings.com">hello@gingerbeerweddings.com</a> and we will delete it without undue delay.</p>

          <h2>13. Changes to This Policy</h2>
          <p>We may update this Policy from time to time. The current version is always at gingerbeerweddings.com/privacy. Material changes will be communicated at least 14 days before taking effect. Continued use of our services constitutes acceptance.</p>

          <h2>14. Contact</h2>
          <p>
            Ginger Beer Weddings · Alatyr Systems LLC (Алатир Системс ООД)<br/>
            <a href="mailto:hello@gingerbeerweddings.com">hello@gingerbeerweddings.com</a> · gingerbeerweddings.com/privacy
          </p>
        </div>

        <div className="divider-dark mt-16 mb-8" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-sans text-[11px] text-brand-cream/20 uppercase tracking-widest">
            © {new Date().getFullYear()} Ginger Beer Weddings. Alatyr Systems LLC.
          </p>
          <a href="/terms" className="font-sans text-[11px] text-brand-cream/30 hover:text-brand-cream uppercase tracking-widest transition-colors">
            Terms &amp; Conditions →
          </a>
        </div>
      </div>
    </div>
  );
}
