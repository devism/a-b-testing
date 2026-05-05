import CTAButton from "./CTAButton";

export default function HeroB() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 pt-24 pb-20 text-white">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-indigo-200 mb-6 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Trusted by 2,400+ engineering teams
        </div>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl leading-tight">
          Ship features <span className="text-yellow-300">3× faster.</span>
          <br />
          Measure everything that matters.
        </h1>
        <p className="mt-6 text-xl text-indigo-200 max-w-2xl mx-auto leading-relaxed">
          Stop guessing. Flowmetric puts real-time analytics, feature flags, and A/B tests
          directly in your engineers&apos; workflow — from PR to production.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <CTAButton variant="treatment" />
          <a href="#features" className="text-sm font-medium text-indigo-300 hover:text-white transition-colors">
            Watch a 2-min demo →
          </a>
        </div>
        <p className="mt-5 text-xs text-indigo-400">No credit card required · Free for up to 1M events/month</p>
      </div>
    </section>
  );
}
