import {
  timestamp,
  text,
  pgTable,
  serial,
  varchar,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const LinksTable = pgTable(
  "links",
  {
    id: serial("id").primaryKey().notNull(),
    url: text("url").notNull(),
    short: varchar("short", { length: 50 }),
    createAt: timestamp("create_at").defaultNow(),
  },
  (links) => {
    return {
      urlIndex: uniqueIndex("url_idx").on(links.url),
    };
  },
);
