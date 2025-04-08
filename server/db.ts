import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema";

const { Pool } = pg;

// Create a PostgreSQL pool with connection string from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create drizzle instance with our schema
export const db = drizzle(pool, { schema });