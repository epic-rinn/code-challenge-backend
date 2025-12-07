import { ZodType } from "zod";
import { Response } from "express";
import { HttpStatus } from "./httpStatusCodes";

export function parseWithZod<T>(
  schema: ZodType<T>,
  data: unknown
):
  | { ok: true; data: T }
  | { ok: false; issues: { path: string; message: string }[] } {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
    return { ok: false, issues };
  }
  return { ok: true, data: parsed.data };
}

export function ensureNumericId(idStr: string, res: Response): number | null {
  const id = Number(idStr);
  if (Number.isNaN(id)) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: "Invalid id", details: "id must be a number" });
    return null;
  }
  return id;
}

export function parseOr400<T>(
  schema: ZodType<T>,
  data: unknown,
  res: Response
): T | null {
  const r = parseWithZod(schema, data);
  if (!r.ok) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: "Invalid request payload", issues: r.issues });
    return null;
  }
  return r.data;
}

export function notFound(res: Response, message = "Not Found") {
  res.status(HttpStatus.NOT_FOUND).json({ error: message });
}
