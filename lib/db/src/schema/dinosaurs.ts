import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const dinosaursTable = pgTable("dinosaurs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default("Dinosaur info here."),
  period: text("period").notNull().default("Unknown"),
  diet: text("diet").notNull().default("Unknown"),
  imageUrl: text("image_url"),
  likesCount: integer("likes_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDinosaurSchema = createInsertSchema(dinosaursTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  likesCount: true,
});

export type InsertDinosaur = z.infer<typeof insertDinosaurSchema>;
export type Dinosaur = typeof dinosaursTable.$inferSelect;
