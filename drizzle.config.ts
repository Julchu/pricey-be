import { defineConfig } from "drizzle-kit";

/*
// Attempting Supabase SSLCert query param
const caString = process.env.SUPABASE_CRT!;
const caStringEncoded = encodeURIComponent(caString);
const supabaseURL = `${process.env.DATABASE_URL!}?sslmode=require&sslrootcert=${caStringEncoded}`;
*/
export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schemas/*.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});