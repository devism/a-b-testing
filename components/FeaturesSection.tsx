const features = [
  {
    icon: "📊",
    title: "Real-time analytics",
    description:
      "See events the moment they happen. No batching delays, no 24-hour lag. Your dashboard updates as users interact.",
  },
  {
    icon: "🚩",
    title: "Feature flags",
    description:
      "Roll out features to 1% of users, specific cohorts, or everyone at once. Kill switches included — ship fearlessly.",
  },
  {
    icon: "🧪",
    title: "A/B testing",
    description:
      "Run statistically rigorous experiments without a data science team. Flowmetric handles the math.",
  },
  {
    icon: "⚡",
    title: "Edge-fast SDKs",
    description:
      "Our SDKs evaluate flags at the edge — zero latency, zero flicker. Works with Next.js, Remix, and plain React.",
  },
  {
    icon: "🔍",
    title: "Session replay",
    description:
      "Watch exactly what users did before they converted — or before they churned. Privacy-first, GDPR compliant.",
  },
  {
    icon: "🔔",
    title: "Alerts & anomalies",
    description:
      "Get paged when a metric drops. Flowmetric watches your funnels 24/7 so you don't have to.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-zinc-50 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Everything your growth team needs
          </h2>
          <p className="mt-4 text-lg text-zinc-500 max-w-2xl mx-auto">
            One SDK, one dashboard, one source of truth — for every team from seed to Series C.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-zinc-100 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-base font-semibold text-zinc-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
