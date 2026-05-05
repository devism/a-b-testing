"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AutoRefresh({ intervalMs = 30_000 }: { intervalMs?: number }) {
  const router = useRouter();
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      router.refresh(); // re-runs the Server Component data fetch without a full page reload
      setLastRefreshed(new Date());
    }, intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);

  if (!lastRefreshed) return null;

  return (
    <p className="text-xs text-zinc-400">
      Last refreshed at {lastRefreshed.toLocaleTimeString()}
    </p>
  );
}
