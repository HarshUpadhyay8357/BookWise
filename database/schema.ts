import {
  integer,
  pgTable,
  text,
  uuid,
  varchar,
  date,
  pgEnum,
  timestamp,
} from "drizzle-orm/pg-core";

export const STATUS_ENUM = pgEnum("status", [
  "Pending",
  "Approved",
  "Rejected",
]);

export const ROLE_ENUM = pgEnum("role", ["User", "Admin"]);

export const BORROW_STATUS_ENUM = pgEnum("borrow_status", [
  "Borrowed",
  "Returned",
]);

export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().unique().defaultRandom(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  universityId: integer("university_id").notNull().unique(),
  password: text("password").notNull(),
  universityCard: text("university_card").notNull(),
  status: STATUS_ENUM("status").default("Pending"),
  role: ROLE_ENUM("role").default("User"),
  lastActivityDate: timestamp("last_activity_date", {
    withTimezone: true,
  }).defaultNow(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),

  lastReminderSent: timestamp("last_reminder_sent", {
    withTimezone: true,
  }),
});
