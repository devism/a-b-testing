"use client";

import { usePostHog } from "posthog-js/react";

interface Props {
  variant: "control" | "treatment";
}

export default function CTAButton({ variant }: Props) {
  const posthog = usePostHog();

  const handleClick = async () => {
    // 1. Send to PostHog for experiment analysis
    posthog.capture("cta_clicked", { variant });

    // 2. Write to our own Postgres database via API route
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: "conversion",
        variant,
        distinct_id: posthog.get_distinct_id(),
      }),
    });
  };

  const isControl = variant === "control";

  return (
    <button
      onClick={handleClick}
      className={`rounded-full px-8 py-3.5 text-sm font-semibold shadow-sm transition-all ${
        isControl
          ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md"
          : "bg-yellow-400 text-zinc-900 hover:bg-yellow-300 hover:shadow-md"
      }`}
    >
      Start for free
    </button>
  );
}
