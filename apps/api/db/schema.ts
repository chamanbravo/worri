import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 30 }).notNull().unique(),
  firstname: varchar("firstname", { length: 30 }),
  lastname: varchar("lastname", { length: 30 }),
  email: varchar("email", { length: 256 }).notNull().unique(),
  password: varchar("password", { length: 256 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const workspaces = pgTable("workspaces", {
  name: varchar("name", { length: 30 }).notNull().primaryKey(),
  access_code: varchar("access_code", { length: 30 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const workspacesUsers = pgTable("workspaces_users", {
  id: serial("id").primaryKey(),
  workspace_name: varchar("workspace_name")
    .notNull()
    .references(() => workspaces.name, { onDelete: "cascade" }),
  username: varchar("username")
    .notNull()
    .references(() => users.username, { onDelete: "cascade" }),
  role: varchar("role", { length: 30 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const websites = pgTable("website", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 30 }).notNull(),
  domain: varchar("url", { length: 256 }).notNull(),
  workspace_name: varchar("workspace_name")
    .references(() => workspaces.name, { onDelete: "cascade" })
    .notNull(),
  created_by: varchar("created_by")
    .references(() => users.username, { onDelete: "cascade" })
    .notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
