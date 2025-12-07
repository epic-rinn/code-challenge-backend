import { Request, Response } from "express";
import { HttpStatus } from "../utils";

export function notFoundHandler(_req: Request, res: Response) {
  res.status(HttpStatus.NOT_FOUND).json({ error: "Route Not Found" });
}
