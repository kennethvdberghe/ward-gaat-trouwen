import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  driver: "d1-http",
  schema: "./app/schema.ts",
  dbCredentials: {
    accountId: "bla",
    databaseId: "5451c01e-e20f-4c06-8191-3958034ff98a",
    token: "token",
  },
  out: "./migrations",
});
