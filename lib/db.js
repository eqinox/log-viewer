import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

export async function openDb() {
  return open({
    filename: path.join(process.cwd(), "public", "logs.db"), // ✅ Make sure the file exists in "public/"
    driver: sqlite3.Database,
  });
}
