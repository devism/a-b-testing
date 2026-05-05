"use client";

import { useFeatureFlagVariantKey, usePostHog } from "posthog-js/react";
import { useEffect } from "react";
import HeroA from "./HeroA";
import HeroB from "./HeroB";

export default function HeroWrapper() {
  const posthog = usePostHog();
  const variant = useFeatureFlagVariantKey("hero-variant");

  // Track that this user saw a variant (the "impression" — denominator for conversion rate)
  useEffect(() => {
    if (!variant) return;

    posthog.capture("hero_viewed", { variant });

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: "impression",
        variant: variant === "treatment" ? "treatment" : "control",
        distinct_id: posthog.get_distinct_id(),
      }),
    });
  }, [variant, posthog]);

  // null means PostHog hasn't loaded flags yet — show skeleton to avoid layout shift
  if (variant === null) {
    return (
      <section className="pt-24 pb-20">
        <div className="mx-auto max-w-5xl px-6 text-center space-y-6 animate-pulse">
          <div className="h-6 w-32 bg-zinc-100 rounded-full mx-auto" />
          <div className="h-14 w-3/4 bg-zinc-100 rounded-lg mx-auto" />
          <div className="h-14 w-1/2 bg-zinc-100 rounded-lg mx-auto" />
          <div className="h-6 w-2/3 bg-zinc-100 rounded mx-auto" />
          <div className="h-12 w-40 bg-zinc-100 rounded-full mx-auto" />
        </div>
      </section>
    );
  }

  return variant === "treatment" ? <HeroB /> : <HeroA />;
}
