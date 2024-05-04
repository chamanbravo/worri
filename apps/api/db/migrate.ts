import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import "dotenv/config";

if (!process.env.DB_URL) {
  throw new Error("DB_URL is not set");
}

const migrationClient = postgres(process.env.DB_URL, { max: 1 });

await migrate(drizzle(migrationClient), {
  migrationsFolder: "./db/migrations",
});
