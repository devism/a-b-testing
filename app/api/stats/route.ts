import pool from "@/lib/db";

export async function GET() {
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

  return Response.json(result.rows);
}
