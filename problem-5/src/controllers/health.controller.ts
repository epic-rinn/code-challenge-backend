import { Request, Response } from "express";
import { getHealth } from "../services/health.service";

export function healthHandler(_req: Request, res: Response) {
  const { statusCode, body } = getHealth();
  res.status(statusCode).json(body);
}
