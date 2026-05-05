import AutoRefresh from "@/components/AutoRefresh";
import ConversionChart from "@/components/ConversionChart";
import SignificanceBanner from "@/components/SignificanceBanner";
import pool from "@/lib/db";
import { calcSignificance } from "@/lib/stats";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Stat {
  variant: string;
  impressions: number;
  conversions: number;
  conversion_rate: number;
}

async function getStats(): Promise<Stat[]> {
  try {
    const result = await pool.query<{
      variant: string;
      impressions: string;
      conversions: string;
      conversion_rate: string;
    }>(`
      SELECT
        variant,
        COUNT(*) FILTER (WHERE event_type = 'impression') AS impressions,
        COUNT(*) FILTER (WHERE event_type = 'conversion') AS conversions,
        ROUND(
          COUNT(*) FILTER (WHERE event_type = 'conversion')::numeric /
          NULLIF(COUNT(*) FILTER (WHERE event_type = 'impression'), 0) * 100,
          1
        ) AS conversion_rate
      FROM ab_events
      GROUP BY variant
      ORDER BY variant
    `);

    return result.rows.map((row) => ({
      variant: row.variant,
      impressions: parseInt(row.impressions, 10) || 0,
      conversions: parseInt(row.conversions, 10) || 0,
      conversion_rate: parseFloat(row.conversion_rate) || 0,
    }));
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const stats = await getStats();

  const control = stats.find((s) => s.variant === "control");
  const treatment = stats.find((s) => s.variant === "treatment");

  const significance =
    control && treatment
      ? calcSignificance(
          control.conversions,
          control.impressions,
          treatment.conversions,
          treatment.impressions,
        )
      : null;

  const totalImpressions = stats.reduce((s, r) => s + r.impressions, 0);
  const totalConversions = stats.reduce((s, r) => s + r.conversions, 0);

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-4xl px-6 py-16">

        {/* Header */}
        <div className="mb-2">
          <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors">
            ← Back to landing page
          </Link>
        </div>
        <div className="flex items-start justify-between mt-4 mb-2">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">A/B Test Dashboard</h1>
            <p className="text-zinc-500 mt-1">
              Hero section experiment ·{" "}
              <code className="text-xs bg-zinc-100 px-1.5 py-0.5 rounded">hero-variant</code>
            </p>
          </div>
          <AutoRefresh intervalMs={30_000} />
        </div>

        {/* Significance banner */}
        <div className="mt-8">
          <SignificanceBanner
            result={significance}
            controlImpressions={control?.impressions ?? 0}
            treatmentImpressions={treatment?.impressions ?? 0}
          />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-10">
          <StatCard label="Total impressions" value={totalImpressions.toLocaleString()} />
          <StatCard label="Total conversions" value={totalConversions.toLocaleString()} />
          <StatCard
            label="Overall conv. rate"
            value={
              totalImpressions > 0
                ? `${((totalConversions / totalImpressions) * 100).toFixed(1)}%`
                : "—"
            }
          />
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-zinc-100 p-8 mb-8">
          <h2 className="text-base font-semibold text-zinc-900 mb-1">Conversion rate by variant</h2>
          <p className="text-sm text-zinc-400 mb-6">CTA clicks ÷ hero impressions per variant</p>
          <ConversionChart stats={stats} />
        </div>

        {/* Variant breakdown table */}
        {stats.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-zinc-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 text-left text-xs text-zinc-400 uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Variant</th>
                  <th className="px-6 py-4 font-medium text-right">Impressions</th>
                  <th className="px-6 py-4 font-medium text-right">Conversions</th>
                  <th className="px-6 py-4 font-medium text-right">Conv. Rate</th>
                  <th className="px-6 py-4 font-medium text-right">vs Control</th>
                  <th className="px-6 py-4 font-medium text-right">Significance</th>
                </tr>
              </thead>
              <tbody>
                {/* Control row always first */}
                {[
                  stats.find((s) => s.variant === "control"),
                  stats.find((s) => s.variant === "treatment"),
                ]
                  .filter(Boolean)
                  .map((row) => {
                    const r = row!;
                    const uplift =
                      r.variant === "treatment" && control
                        ? ((r.conversion_rate - control.conversion_rate) /
                            (control.conversion_rate || 1)) *
                          100
                        : null;

                    return (
                      <tr key={r.variant} className="border-b border-zinc-50 last:border-0">
                        <td className="px-6 py-4 font-medium text-zinc-900">
                          {r.variant === "control" ? "A — Control" : "B — Treatment"}
                        </td>
                        <td className="px-6 py-4 text-right text-zinc-600">
                          {r.impressions.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right text-zinc-600">
                          {r.conversions.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-zinc-900">
                          {r.conversion_rate}%
                        </td>
                        <td className="px-6 py-4 text-right">
                          {uplift !== null ? (
                            <span className={`font-semibold ${uplift >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                              {uplift >= 0 ? "+" : ""}{uplift.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-zinc-300">baseline</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {r.variant === "control" ? (
                            <span className="text-zinc-300">—</span>
                          ) : significance && !significance.insufficientData ? (
                            <ConfidencePill pValue={significance.pValue} confidenceLevel={significance.confidenceLevel} />
                          ) : (
                            <span className="text-xs text-zinc-400">need more data</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-zinc-400 mt-6 text-center">
          Data from Postgres · Auto-refreshes every 30s · Two-proportion z-test
        </p>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100 p-6">
      <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-3xl font-bold text-zinc-900">{value}</p>
    </div>
  );
}

function ConfidencePill({ pValue, confidenceLevel }: { pValue: number; confidenceLevel: 99 | 95 | 90 | null }) {
  if (confidenceLevel === 99 || confidenceLevel === 95) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
        ✓ {confidenceLevel}% conf.
      </span>
    );
  }
  if (confidenceLevel === 90) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-700">
        ~ 90% conf.
      </span>
    );
  }
  return (
    <span className="text-xs text-zinc-400">p = {pValue.toFixed(2)}</span>
  );
}
