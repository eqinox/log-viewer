import { openDb } from "@/lib/db";

export async function GET() {
  const db = await openDb();

  const years = await db.all(
    "SELECT DISTINCT SUBSTR(date, 1, 4) AS year FROM logs ORDER BY year ASC"
  );

  return Response.json(years.map((row) => row.year));
}
