import { openDb } from "@/lib/db";

export async function GET(req, { params }) {
  const { year, month, date } = await params;
  const fullDate = `${year}-${month}-${date}`;
  const db = await openDb();

  const ips = await db.all(
    "SELECT DISTINCT ip FROM logs WHERE date = ? ORDER BY ip ASC",
    [fullDate]
  );

  return Response.json(ips);
}
