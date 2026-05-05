import CTAButton from "./CTAButton";

export default function HeroA() {
  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <span className="inline-block rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 mb-6">
          Now in public beta
        </span>
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl leading-tight">
          Know exactly what&apos;s working —<br />
          <span className="text-indigo-600">and what isn&apos;t.</span>
        </h1>
        <p className="mt-6 text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
          Flowmetric gives your team real-time product analytics, feature flag management,
          and A/B testing in one unified platform.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <CTAButton variant="control" />
          <a href="#features" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
            See how it works →
          </a>
        </div>
        <p className="mt-5 text-xs text-zinc-400">No credit card required · Free for up to 1M events/month</p>
      </div>
    </section>
  );
}
