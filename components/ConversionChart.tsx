"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Stat {
  variant: string;
  impressions: number;
  conversions: number;
  conversion_rate: number;
}

const COLORS: Record<string, string> = {
  control: "#6366f1",
  treatment: "#f59e0b",
};

export default function ConversionChart({ stats }: { stats: Stat[] }) {
  if (stats.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-2xl bg-zinc-50 text-zinc-400 text-sm">
        No data yet — visit the landing page to generate events.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={stats} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
        <XAxis
          dataKey="variant"
          tickFormatter={(v) => (v === "control" ? "A — Control" : "B — Treatment")}
          tick={{ fontSize: 13, fill: "#71717a" }}
        />
        <YAxis
          tickFormatter={(v) => `${v}%`}
          domain={[0, "dataMax + 5"]}
          tick={{ fontSize: 13, fill: "#71717a" }}
        />
        <Tooltip
          formatter={(value) => [`${value}%`, "Conversion rate"]}
          labelFormatter={(label) => (label === "control" ? "Variant A — Control" : "Variant B — Treatment")}
        />
        <Bar dataKey="conversion_rate" radius={[6, 6, 0, 0]}>
          {stats.map((entry) => (
            <Cell key={entry.variant} fill={COLORS[entry.variant] ?? "#94a3b8"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
