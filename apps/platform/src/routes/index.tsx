import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  BellRingIcon,
  BrandLogo,
  ShieldCheckIcon,
  SparklesIcon,
  TargetIcon,
} from "../components/brand";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

const benefits = [
  {
    title: "See Your True Cost",
    description:
      "Aggregate all monthly and yearly plans in one place. Instantly see your total monthly burn rate in IDR.",
    icon: TargetIcon,
    tone: "blue",
  },
  {
    title: "Never Miss a Renewal",
    description:
      "Get alerted before a free trial ends or a yearly subscription auto-renews. Stay in control.",
    icon: BellRingIcon,
    tone: "orange",
  },
  {
    title: "AI-Powered Insights",
    description:
      "Our AI analyzes your usage and subscription types to recommend potential savings and cancellations.",
    icon: SparklesIcon,
    tone: "purple",
  },
] as const;

function LandingPage() {
  return (
    <div className="reference-landing">
      <section className="reference-hero">
        <div className="reference-grid" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="reference-location-badge">
            <span aria-hidden="true" />
            Designed for Indonesian users
          </div>

          <h1>
            Stop Bleeding Money on <br className="hidden sm:block" />
            <span>Forgotten Subscriptions</span>
          </h1>
          <p className="reference-hero-copy">
            Track all your subscriptions, see your true monthly cost, get reminded before billing,
            and let AI highlight what&apos;s worth cancelling.
          </p>

          <div className="reference-hero-actions">
            <Button asChild size="lg" className="group h-14 px-8 text-base font-semibold">
              <Link to="/register">
                Start Tracking Free
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base font-semibold"
            >
              <Link to="/login">Login to Account</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="reference-benefits" aria-labelledby="benefits-heading">
        <div className="mx-auto max-w-7xl px-4">
          <header>
            <h2 id="benefits-heading">A vigilant financial companion</h2>
            <p>
              Like having a sharp-eyed accountant in your pocket who helps you optimize your
              recurring expenses.
            </p>
          </header>

          <div className="reference-benefit-grid">
            {benefits.map(({ title, description, icon: Icon, tone }) => (
              <Card key={title} className="reference-benefit-card">
                <div className={`reference-benefit-icon reference-benefit-icon-${tone}`}>
                  <Icon className="size-6" />
                </div>
                <h3>{title}</h3>
                <p className="reference-benefit-copy">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="reference-cta" aria-labelledby="cta-heading">
        <div className="reference-dots" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <ShieldCheckIcon className="mx-auto mb-8 size-16 opacity-80" />
          <h2 id="cta-heading">Ready to stop wasting money?</h2>
          <p className="reference-cta-copy">
            Join users who are saving hundreds of thousands of Rupiah every month by tracking their
            subscriptions.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="h-14 px-10 text-lg font-bold text-primary hover:bg-white hover:text-primary"
          >
            <Link to="/register">Create Free Account</Link>
          </Button>
        </div>
      </section>

      <footer className="reference-footer">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 md:flex-row">
          <BrandLogo compact />
          <p className="reference-footer-copy">
            © {new Date().getFullYear()} SubGuardAI. Designed for tracking.
          </p>
        </div>
      </footer>
    </div>
  );
}
