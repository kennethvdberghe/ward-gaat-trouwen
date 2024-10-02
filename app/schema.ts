import { relations } from "drizzle-orm";
import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";

export const guest = sqliteTable("guest", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  inviteId: text("invite_id")
    .references(() => invites.id)
    .notNull(),
  isAttending: integer("is_attending", { mode: "boolean" }),
  attendingCeremony: integer("attending_ceremony", { mode: "boolean" }),
  attendingReception: integer("attending_reception", { mode: "boolean" }),
  attendingDinner: integer("attending_dinner", { mode: "boolean" }),
  attendingParty: integer("attending_party", { mode: "boolean" }),
});

export const invites = sqliteTable("invites", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
});

export const invitesRelations = relations(invites, ({ many }) => ({
  guests: many(guest),
}));

export const guestRelations = relations(guest, ({ one }) => ({
  invite: one(invites, {
    fields: [guest.inviteId],
    references: [invites.id],
  }),
}));
