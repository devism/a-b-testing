import { NextRequest } from "next/server";
import pool from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { event_type, variant, distinct_id } = body;

  if (!["impression", "conversion"].includes(event_type)) {
    return Response.json({ error: "Invalid event_type" }, { status: 400 });
  }
  if (!["control", "treatment"].includes(variant)) {
    return Response.json({ error: "Invalid variant" }, { status: 400 });
  }

  await pool.query(
    "INSERT INTO ab_events (event_type, variant, distinct_id) VALUES ($1, $2, $3)",
    [event_type, variant, distinct_id ?? "anonymous"]
  );

  return Response.json({ ok: true });
}
