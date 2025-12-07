import { birds, db } from "../db";
import { eq, like, and, desc, count } from "drizzle-orm";

export type Bird = {
  id: number;
  name: string;
  species?: string | null;
  habitat?: string | null;
  created_at: string;
};

export type BirdCreateInput = {
  name: string;
  species?: string | null;
  habitat?: string | null;
};

export type BirdUpdateInput = {
  name?: string | null;
  species?: string | null;
  habitat?: string | null;
};

export type BirdFilter = {
  species?: string;
  name?: string;
  habitat?: string;
};

export function listBirds(
  filter: BirdFilter = {},
  page = 1,
  pageSize = 10
): { items: Bird[]; page: number; pageSize: number; total: number } {
  const conditions = [] as any[];
  if (filter.species) conditions.push(eq(birds.species, filter.species));
  if (filter.name) conditions.push(like(birds.name, `%${filter.name}%`));
  if (filter.habitat) conditions.push(eq(birds.habitat, filter.habitat));
  const whereExpr = conditions.length ? and(...conditions) : undefined;

  const totalRow = db
    .select({ total: count() })
    .from(birds)
    .where(whereExpr as any)
    .get();
  const total = (totalRow?.total as number) ?? 0;

  const items = db
    .select({
      id: birds.id,
      name: birds.name,
      species: birds.species,
      habitat: birds.habitat,
      created_at: birds.created_at,
    })
    .from(birds)
    .where(whereExpr as any)
    .orderBy(desc(birds.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .all() as unknown as Bird[];

  return { items, page, pageSize, total };
}

export function getBird(id: number): Bird | undefined {
  const row = db
    .select({
      id: birds.id,
      name: birds.name,
      species: birds.species,
      habitat: birds.habitat,
      created_at: birds.created_at,
    })
    .from(birds)
    .where(eq(birds.id, id))
    .get();
  return row as Bird | undefined;
}

export function createBird(data: BirdCreateInput): Bird {
  const res = db
    .insert(birds)
    .values({
      name: data.name,
      species: data.species ?? null,
      habitat: data.habitat ?? null,
    })
    .run();
  const idNum = Number(res.lastInsertRowid);
  const created = db
    .select({
      id: birds.id,
      name: birds.name,
      species: birds.species,
      habitat: birds.habitat,
      created_at: birds.created_at,
    })
    .from(birds)
    .where(eq(birds.id, idNum))
    .get();
  return created as Bird;
}

export function updateBird(
  id: number,
  data: BirdUpdateInput
): Bird | undefined {
  const exists = db
    .select({ id: birds.id })
    .from(birds)
    .where(eq(birds.id, id))
    .get();
  if (!exists) return undefined;
  const updates: Record<string, any> = {};
  if (data.name !== undefined) updates.name = data.name;
  if (data.species !== undefined) updates.species = data.species;
  if (data.habitat !== undefined) updates.habitat = data.habitat;
  if (Object.keys(updates).length) {
    db.update(birds).set(updates).where(eq(birds.id, id)).run();
  }
  const updated = db
    .select({
      id: birds.id,
      name: birds.name,
      species: birds.species,
      habitat: birds.habitat,
      created_at: birds.created_at,
    })
    .from(birds)
    .where(eq(birds.id, id))
    .get();
  return updated as Bird | undefined;
}

export function deleteBird(id: number): boolean {
  const info = db.delete(birds).where(eq(birds.id, id)).run();
  return info.changes > 0;
}
