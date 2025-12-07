import { sql } from "drizzle-orm";
import { sqliteTable, integer, text, index } from "drizzle-orm/sqlite-core";

export const birds = sqliteTable(
  "birds",
  {
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
    species: text("species"),
    habitat: text("habitat"),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_birds_species").on(table.species),
    index("idx_birds_habitat").on(table.habitat),
  ]
);
