import { relations } from "drizzle-orm";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";

export const guest = sqliteTable("guest", {
  id: text("id").primaryKey(),
  name: text("name"),
  inviteId: text("invite_id").references(() => invites.id),
});

export const invites = sqliteTable("invites", {
  id: text("id").primaryKey(),
  code: text("code"),
});

export const invitesRelations = relations(invites, ({ many }) => ({
  guests: many(guest),
}));
