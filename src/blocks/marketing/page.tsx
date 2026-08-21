import { MarketingHero } from "./hero"
import { MarketingLogoCloud } from "./logo-cloud"
import { MarketingFeatureGrid } from "./feature-grid"
import { MarketingStats } from "./stats"
import { MarketingTestimonial } from "./testimonial"
import { MarketingPricing } from "./pricing"
import { MarketingFaq } from "./faq"
import { MarketingCtaBanner } from "./cta-banner"
import { MarketingFooter } from "./footer"

// marketing/page — a complete landing page composed from the marketing sections,
// the way dashboard-plain/page composes its parts. Drop it in and edit the copy.
export function MarketingPage() {
  return (
    <div className="flex w-full min-w-0 flex-col bg-background text-foreground">
      <MarketingHero />
      <MarketingLogoCloud />
      <MarketingFeatureGrid />
      <MarketingStats />
      <MarketingTestimonial />
      <MarketingPricing />
      <MarketingFaq />
      <MarketingCtaBanner />
      <MarketingFooter />
    </div>
  )
}
