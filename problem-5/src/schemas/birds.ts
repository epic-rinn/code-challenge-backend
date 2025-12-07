import { z } from "zod";

export const BirdCreateSchema = z.object({
  name: z.string().min(1),
  species: z.union([z.string().min(1), z.null()]).optional(),
  habitat: z.union([z.string().min(1), z.null()]).optional(),
});

export const BirdUpdateSchema = z.object({
  name: z.union([z.string().min(1), z.null()]).optional(),
  species: z.union([z.string().min(1), z.null()]).optional(),
  habitat: z.union([z.string().min(1), z.null()]).optional(),
});

