import { drizzle } from 'drizzle-orm/netlify-db';
import * as schema from './schema.ts';

const connectionString =
  process.env.NETLIFY_DATABASE_URL ||
  process.env.DATABASE_URL ||
  'postgres://postgres:postgres@localhost:5432/scholarship_finder';

export const db = drizzle(connectionString);
export * from './schema.ts';
