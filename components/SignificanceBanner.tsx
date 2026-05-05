import type { SignificanceResult } from "@/lib/stats";

interface Props {
  result: SignificanceResult | null;
  controlImpressions: number;
  treatmentImpressions: number;
}

const MIN_SAMPLE = 30;

export default function SignificanceBanner({ result, controlImpressions, treatmentImpressions }: Props) {
  // No data at all
  if (!result && (controlImpressions === 0 || treatmentImpressions === 0)) {
    return (
      <Banner color="zinc">
        <span className="font-medium">Waiting for data</span> — visit the landing page to generate impressions for both variants.
      </Banner>
    );
  }

  // Not enough data for reliable math
  if (result?.insufficientData) {
    const needed = MIN_SAMPLE;
    const minSeen = Math.min(controlImpressions, treatmentImpressions);
    return (
      <Banner color="zinc">
        <span className="font-medium">Collecting data</span> — need at least {needed} impressions per variant for a valid test.{" "}
        <span className="opacity-60">({minSeen}/{needed} on the smaller variant)</span>
      </Banner>
    );
  }

  if (!result) return null;

  // Significant result
  if (result.isSignificant) {
    const winner = (result.relativeUplift ?? 0) >= 0 ? "B — Treatment" : "A — Control";
    const uplift = Math.abs(result.relativeUplift ?? 0).toFixed(1);
    return (
      <Banner color="emerald">
        <span className="font-medium">Significant at {result.confidenceLevel}% confidence</span> — {winner} wins by{" "}
        <span className="font-semibold">{uplift}% relative uplift</span>{" "}
        <span className="opacity-60">(p = {result.pValue.toFixed(3)}, z = {result.zScore.toFixed(2)})</span>
      </Banner>
    );
  }

  // Trending (90% confidence) but not yet significant
  if (result.confidenceLevel === 90) {
    return (
      <Banner color="yellow">
        <span className="font-medium">Trending but not yet significant</span> — 90% confidence.{" "}
        Keep collecting data.{" "}
        <span className="opacity-60">(p = {result.pValue.toFixed(3)})</span>
      </Banner>
    );
  }

  // Running, no signal yet
  return (
    <Banner color="blue">
      <span className="font-medium">Experiment running</span> — no significant difference yet.{" "}
      <span className="opacity-60">(p = {result.pValue.toFixed(3)} · need p {"<"} 0.05)</span>
    </Banner>
  );
}

const colorMap = {
  zinc:    "bg-zinc-100 text-zinc-600 border-zinc-200",
  emerald: "bg-emerald-50 text-emerald-800 border-emerald-200",
  yellow:  "bg-yellow-50 text-yellow-800 border-yellow-200",
  blue:    "bg-blue-50 text-blue-800 border-blue-200",
};

function Banner({ color, children }: { color: keyof typeof colorMap; children: React.ReactNode }) {
  return (
    <div className={`rounded-xl border px-5 py-4 text-sm mb-8 ${colorMap[color]}`}>
      {children}
    </div>
  );
}
