const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">

        <div className="mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary/70">Legal</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Terms & Conditions</h1>
          <div className="mt-4 h-1 w-16 rounded-full bg-primary/40" />
          <p className="mt-4 text-sm text-muted-foreground">Last updated: March 2025</p>
        </div>

        <div className="space-y-10 text-foreground/80 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Services</h2>
            <p>Ginger Beer Weddings provides professional wedding videography services including highlight films, full wedding films, and teasers. All services are subject to availability and must be confirmed with a signed agreement and deposit.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Booking & Payment</h2>
            <p>A non-refundable deposit of 50% is required to secure your wedding date. The remaining balance is due no later than 14 days before the wedding date. Failure to pay the final balance may result in cancellation of services.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Delivery</h2>
            <p>Edited films are typically delivered within 8–12 weeks of the wedding date. Delivery timelines may vary depending on the package and season. All films are delivered digitally via a private Vimeo link or download.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Revisions</h2>
            <p>Each package includes up to 2 rounds of revisions. Additional revisions may be requested at an additional fee. Revisions do not include re-editing of the entire film or changes to the musical score.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Cancellations</h2>
            <p>In the event of cancellation by the client, the deposit is non-refundable. If cancellation occurs within 30 days of the wedding, the full contract amount is due. In the unlikely event that Ginger Beer Weddings must cancel, a full refund will be issued.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Copyright & Usage Rights</h2>
            <p>Ginger Beer Weddings retains the copyright to all footage and edited films. Clients are granted a personal, non-commercial license to use the delivered films. By signing the agreement, clients grant Ginger Beer Weddings permission to use footage and films for portfolio, marketing, and promotional purposes unless otherwise agreed in writing.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Privacy</h2>
            <p>Personal information submitted through our contact form is used solely to respond to your inquiry and coordinate services. We do not sell or share your data with third parties. By submitting our contact form, you consent to being contacted by Ginger Beer Weddings regarding your inquiry.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Liability</h2>
            <p>Ginger Beer Weddings will make every effort to capture your wedding day as planned. In the unlikely event of equipment failure or unforeseen circumstances, our liability is limited to a refund of payments received. We are not liable for any indirect or consequential damages.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Contact</h2>
            <p>For any questions regarding these Terms & Conditions, please contact us at <a href="mailto:hello@gingerbeerweddings.com" className="underline hover:text-accent transition-colors">hello@gingerbeerweddings.com</a></p>
          </section>

        </div>

        <div className="mt-16">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-accent transition-colors underline"
          >
            ← Back to portfolio
          </a>
        </div>

      </div>
    </div>
  );
};

export default Terms;
