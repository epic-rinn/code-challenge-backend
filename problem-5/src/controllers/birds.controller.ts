import { Request, Response } from "express";
import { HttpStatus } from "../utils";
import { BirdCreateSchema, BirdUpdateSchema } from "../schemas/birds";
import { ensureNumericId, parseOr400, notFound } from "../utils";
import {
  getAllBirds,
  createBird,
  updateBird,
  deleteBird,
  getBirdById as getBirdByIdService,
} from "../services/birds.service";

export function getBirdsHandler(req: Request, res: Response) {
  const {
    species,
    name,
    habitat,
    page = "1",
    pageSize = "10",
  } = req.query as Record<string, string | undefined>;
  const birds = getAllBirds({ species, name, habitat, page, pageSize });

  res.status(HttpStatus.OK).json(birds);
}

export function getBirdByIdHandler(req: Request, res: Response) {
  const id = ensureNumericId(req.params.id, res);
  if (id === null) return;

  const row = getBirdByIdService(id);
  if (!row) return notFound(res);

  res.status(HttpStatus.OK).json(row);
}

export function createBirdHandler(req: Request, res: Response) {
  const data = parseOr400(BirdCreateSchema, req.body || {}, res);
  if (data === null) return;

  const { name, species, habitat } = data;
  const created = createBird({ name, species, habitat });

  res.status(HttpStatus.CREATED).json(created);
}

export function updateBirdHandler(req: Request, res: Response) {
  const id = ensureNumericId(req.params.id, res);
  if (id === null) return;

  const data = parseOr400(BirdUpdateSchema, req.body || {}, res);
  if (data === null) return;

  const { name, species, habitat } = data;
  const updated = updateBird(id, { name, species, habitat });

  if (!updated) return notFound(res);

  res.status(HttpStatus.OK).json(updated);
}

export function deleteBirdHandler(req: Request, res: Response) {
  const id = ensureNumericId(req.params.id, res);
  if (id === null) return;

  const ok = deleteBird(id);
  if (!ok) return notFound(res);

  res.status(HttpStatus.OK).json({ message: "Bird deleted" });
}
