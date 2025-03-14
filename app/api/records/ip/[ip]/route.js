import { openDb } from "@/lib/db";

export async function GET(req, { params }) {
  const { ip } = await params;
  const db = await openDb();

  const records = await db.all(
    "SELECT date, records FROM logs WHERE ip = ? ORDER BY date ASC",
    [ip]
  );

  return Response.json(records);
}
