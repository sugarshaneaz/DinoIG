import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { dinosaursTable } from "./dinosaurs";

export const dinosaurLikesTable = pgTable(
  "dinosaur_likes",
  {
    id: serial("id").primaryKey(),
    dinosaurId: integer("dinosaur_id")
      .notNull()
      .references(() => dinosaursTable.id, { onDelete: "cascade" }),
    deviceKey: text("device_key").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("dinosaur_likes_dinosaur_id_device_key_idx").on(
      t.dinosaurId,
      t.deviceKey,
    ),
  ],
);

export type DinosaurLike = typeof dinosaurLikesTable.$inferSelect;
