import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Consultation / quote / representation requests submitted through the
// contact experience. This is the only persisted, user-facing data model
// the site needs — every other page renders verified factual content.
export const contactRequests = pgTable("contact_requests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  email: varchar("email", { length: 160 }),
  city: varchar("city", { length: 80 }),
  topic: varchar("topic", { length: 40 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ContactRequest = typeof contactRequests.$inferSelect;
export type NewContactRequest = typeof contactRequests.$inferInsert;
