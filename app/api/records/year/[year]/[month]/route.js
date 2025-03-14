import { openDb } from "@/lib/db";

export async function GET(req, { params }) {
  const { year, month } = await params;
  const db = await openDb();

  const dates = await db.all(
    "SELECT DISTINCT SUBSTR(date, 9, 2) AS day FROM logs WHERE date LIKE ? ORDER BY day ASC",
    [`${year}-${month}-%`]
  );

  return Response.json(dates.map((row) => row.day));
}
