import logoLight from "@/assets/logo-vector.svg";

export default function Terms() {
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
            Terms &amp; Conditions
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

          <p>These Terms and Conditions ("Agreement") govern the relationship between Ginger Beer Weddings ("Company," "we," "us," or "our") and any individual or legal entity ("Client") purchasing post-production services. By placing an order or making a payment, the Client confirms full acceptance of this Agreement. All communications, approvals, and instructions must be in writing.</p>

          <h2>1. Services</h2>
          <p>We provide professional post-production services for wedding videographers and photographers, including:</p>
          <ul>
            <li>Highlight films and full wedding films</li>
            <li>Teasers, ceremony and reception edits</li>
            <li>Photo editing and retouching</li>
            <li>Same-day delivery recaps</li>
            <li>Object and background removal (billed separately — see Section 7)</li>
          </ul>
          <p>All services are subject to availability and must be confirmed with a written order and payment of the applicable deposit.</p>

          <h2>2. Payment</h2>
          <p>A non-refundable 50% deposit is required to confirm a project slot. The remaining balance (Invoice #2) is due upon written approval of the final deliverable. Final files are released only after Invoice #2 is confirmed paid.</p>
          <p>Rush, Next Day, and Same Day orders require 100% prepayment before production begins.</p>
          <p>All prices are in EUR. The Company reserves the right to adjust pricing with 30 days' written notice.</p>

          <h2>3. Delivery</h2>
          <p>Standard delivery: 14 calendar days. The countdown begins only when all three conditions are met simultaneously:</p>
          <ul>
            <li>All footage received in full</li>
            <li>Folder structure is correct</li>
            <li>Deposit payment confirmed</li>
          </ul>
          <p>Accelerated delivery:</p>
          <ul>
            <li>Rush: 7 calendar days (+30%)</li>
            <li>Next Day: 24 hours (+50%; teaser and highlight only)</li>
            <li>Same Day: delivered on the wedding day, no later than 23:59 local time</li>
          </ul>
          <p>Files are delivered digitally via a private link or secure file transfer. The Company is not liable for delays caused by incomplete or incorrectly structured footage.</p>

          <h2>4. Revisions</h2>
          <p>Each order includes 2 revision rounds at no charge. A revision round is one single, consolidated list of written comments submitted at one time.</p>
          <p>Additional charges:</p>
          <ul>
            <li>Additional revision rounds: $50 per round</li>
            <li>Music change after approval: $90</li>
            <li>Full re-edit (new concept or structure): billed as a new order</li>
          </ul>
          <p>The Client has 1 calendar month from receipt of the first draft to use both included revision rounds. If no feedback is received within 1 month, the project is deemed approved and closed. After final delivery, the Client has an additional 1 calendar month to request any remaining included revisions. Requests after this period are subject to additional fees.</p>

          <h3>4.1 Change of Creative Direction</h3>
          <p>The first draft is created based on the brief, references, and instructions provided by the Client. If the Client requests major changes that differ from the originally submitted references, structure, or creative direction after receiving the first draft, such requests are considered a change of scope and require an additional fee. This includes: changing the overall structure or storytelling approach; switching editing style or pacing; providing new references after first draft delivery; or revising the project concept after initial approval.</p>

          <h2>5. Refund Policy</h2>
          <p>All refund requests must be submitted in writing to <a href="mailto:hello@gingerbeerweddings.com">hello@gingerbeerweddings.com</a>.</p>

          <h3>5.1 Non-Refundable Deposit</h3>
          <p>The 50% deposit is strictly non-refundable under all circumstances, with the sole exception described in Section 5.2.</p>

          <h3>5.2 Full Refund — Alternative Edit Procedure</h3>
          <p>A full refund of all amounts paid (including the deposit) is available exclusively under this procedure — the only circumstance in which the deposit is refundable. This procedure is available only after both revision rounds have been used and the result still does not align with the agreed written brief. All of the following must be satisfied:</p>
          <ul>
            <li>The Client submits a written refund request within 14 calendar days of final delivery;</li>
            <li>The Client provides a self-edited version of the same source footage demonstrating that GBW's result materially deviates from the approved written brief; and</li>
            <li>The Company, upon review of both versions, confirms the material deviation.</li>
          </ul>
          <p>If confirmed: full refund processed within 14 business days. The Client's licence to GBW's file is immediately revoked; the Client may not use or publish it. The Client's own edited version remains their property. If not confirmed: no refund; Section 5.3 applies.</p>

          <h3>5.3 No Refund Circumstances</h3>
          <p>No refund is issued for:</p>
          <ul>
            <li>Subjective stylistic disagreement not documented in the original approved brief</li>
            <li>Cancellation after production has commenced</li>
            <li>Rush, Next Day, or Same Day orders — 100% prepayment is fully non-refundable</li>
            <li>Quality limitations caused by poor source footage</li>
            <li>Delays caused by unsorted or incorrectly structured footage</li>
            <li>Requests submitted more than 14 calendar days after delivery</li>
          </ul>

          <h3>5.4 EU Right of Withdrawal</h3>
          <p>Post-production services are digital and substantially performed upon delivery. Pursuant to Article 16(m) of Directive 2011/83/EU, the right of withdrawal does not apply. By confirming an order, the Client expressly consents to immediate commencement of performance and waives the statutory right of withdrawal.</p>

          <h3>5.5 Company-Initiated Cancellation</h3>
          <p>If the Company cancels a confirmed project before production begins, a full refund of all payments received will be issued within 14 business days.</p>

          <h2>6. Cancellations</h2>
          <p>Cancellations must be submitted in writing to <a href="mailto:hello@gingerbeerweddings.com">hello@gingerbeerweddings.com</a>.</p>
          <ul>
            <li>Before production: deposit is forfeited; final balance (if paid) refunded within 14 business days</li>
            <li>After production begins: no refund of any amount paid</li>
            <li>Rush, Next Day, Same Day: no refund once payment is confirmed</li>
          </ul>
          <p>The Company may terminate this Agreement and retain fees if the Client fails to provide materials, delivers unusable footage, or engages in abusive conduct.</p>

          <h2>7. Additional Fees</h2>
          <ul>
            <li>Footage exceeding 1 TB: +$50</li>
            <li>Unsorted footage requiring organisation: +$50</li>
            <li>Multi-day project — 2 days: +$100 / 3 days: +$200</li>
            <li>5–6 cameras: +$50 / 7+ cameras: +$100</li>
          </ul>
          <p>Object and cleanup removal (people, wires, logos, backgrounds) is billed at $100/hour after a written estimate. Work commences only upon written approval.</p>

          <h2>8. Intellectual Property</h2>
          <p>The Company retains all copyright and intellectual property rights in all edited films and associated creative materials. Upon receipt of full payment, the Client is granted a personal, non-exclusive, non-transferable, royalty-free licence to use delivered files for private, non-commercial enjoyment and social sharing. This licence does not permit commercial use, resale, modification, or transfer to third parties.</p>
          <p>By confirming an order, the Client grants the Company a non-exclusive, worldwide, royalty-free licence for portfolio and marketing use of footage and finished films, unless the Client provides written objection before production begins.</p>
          <p>In the event of an approved refund under Section 5.2, the Client's licence is immediately revoked.</p>

          <h2>9. Client Responsibilities</h2>
          <p>The Client is responsible for:</p>
          <ul>
            <li>Delivering all footage in the required folder structure and in full before the agreed start date</li>
            <li>Ensuring footage is correctly labelled, sorted, and in a viewable, uncorrupted format</li>
            <li>Providing proxy files for Same Day and Next Day services</li>
            <li>Submitting revision notes as a single consolidated list per round</li>
            <li>Holding all necessary rights to any music or third-party materials submitted</li>
          </ul>
          <p>The Company accepts no liability for quality deficiencies or delays resulting from the Client's failure to meet these obligations.</p>

          <h2>10. Liability &amp; Force Majeure</h2>
          <p>The Company's total liability for any claim shall not exceed the total fees paid by the Client for the specific project. The Company is not liable for indirect, incidental, or consequential damages, loss of data or profits, or delays caused by circumstances beyond its reasonable control (force majeure).</p>
          <p>In a force majeure event lasting more than 30 calendar days, either party may terminate in writing and the Company will issue a pro-rata refund for work not yet commenced.</p>

          <h2>11. VAT &amp; Invoicing</h2>
          <p>Invoices are issued by Alatyr Systems LLC (UIC 208718143, VAT No BG208718143), registered in Bulgaria.</p>
          <ul>
            <li>US Clients: no US sales tax collected. Clients determine their own tax obligations.</li>
            <li>EU B2B Clients: reverse charge applies (Art. 196, Directive 2006/112/EC).</li>
            <li>EU B2C Clients: VAT may apply at the Client's country rate under EU OSS rules.</li>
          </ul>

          <h2>12. Privacy &amp; Data Protection</h2>
          <p>Personal data is processed in accordance with GDPR (Regulation (EU) 2016/679). Full details are in our <a href="/privacy">Privacy Policy</a>, incorporated herein by reference.</p>

          <h2>13. Governing Law &amp; Dispute Resolution</h2>
          <p>This Agreement is governed by the laws of the Republic of Bulgaria. Disputes are first attempted through 30 days of good-faith written negotiation.</p>
          <p>US-based Clients: unresolved disputes are submitted to binding arbitration under AAA rules, conducted in English remotely or at a mutually agreed location.</p>
          <p>EU-based Clients: may bring proceedings before Bulgarian courts (Burgas Region) or courts of habitual residence. EU consumers may also use the EC ODR platform at <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener">ec.europa.eu/consumers/odr</a>.</p>

          <h2>14. Changes to These Terms</h2>
          <p>The Company may update these Terms at any time. The current version is at gingerbeerweddings.com/terms. Material changes will be communicated at least 14 days in advance. Continued use of services constitutes acceptance.</p>

          <h2>15. Acceptance</h2>
          <p>By submitting an order and making payment, the Client confirms they have read, understood, and agree to these Terms &amp; Conditions in full.</p>

          <h2>16. Contact</h2>
          <p>
            Ginger Beer Weddings · Alatyr Systems LLC (Алатир Системс ООД)<br/>
            <a href="mailto:hello@gingerbeerweddings.com">hello@gingerbeerweddings.com</a> · gingerbeerweddings.com
          </p>
        </div>

        <div className="divider-dark mt-16 mb-8" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-sans text-[11px] text-brand-cream/20 uppercase tracking-widest">
            © {new Date().getFullYear()} Ginger Beer Weddings. Alatyr Systems LLC.
          </p>
          <a href="/privacy" className="font-sans text-[11px] text-brand-cream/30 hover:text-brand-cream uppercase tracking-widest transition-colors">
            Privacy Policy →
          </a>
        </div>
      </div>
    </div>
  );
}
