import { openDb } from "@/lib/db";

export async function GET(req, { params }) {
  const { year } = await params;
  const db = await openDb();

  const months = await db.all(
    "SELECT DISTINCT SUBSTR(date, 6, 2) AS month FROM logs WHERE date LIKE ? ORDER BY month ASC",
    [`${year}-%`]
  );

  return Response.json(months.map((row) => row.month));
}
