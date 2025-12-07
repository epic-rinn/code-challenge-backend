import { Request, Response } from "express";
import { HttpStatus } from "../utils";
import {
  getAllBirds,
  createBirdService,
  updateBirdService,
  deleteBirdService,
  getBirdById as getBirdByIdService,
} from "../services/birds.service";

export function getBirds(req: Request, res: Response) {
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

export function getBirdById(req: Request, res: Response) {
  const id = Number(req.params.id);
  const row = getBirdByIdService(id);
  if (!row)
    return res.status(HttpStatus.NOT_FOUND).json({ error: "Not Found" });
  res.status(HttpStatus.OK).json(row);
}

export function createBirdHandler(req: Request, res: Response) {
  const { name, species, habitat } = req.body || {};
  if (!name) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: "name is required" });
  }

  const created = createBirdService({ name, species, habitat });
  res.status(HttpStatus.CREATED).json(created);
}

export function updateBirdHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { name, species, habitat } = req.body || {};
  const updated = updateBirdService(id, { name, species, habitat });
  if (!updated)
    return res.status(HttpStatus.NOT_FOUND).json({ error: "Not Found" });

  res.status(HttpStatus.OK).json(updated);
}

export function deleteBirdHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  const ok = deleteBirdService(id);
  if (!ok) return res.status(HttpStatus.NOT_FOUND).json({ error: "Not Found" });
  res.status(HttpStatus.NO_CONTENT).send();
}
