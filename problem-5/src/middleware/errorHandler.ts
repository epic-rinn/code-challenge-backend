import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../utils";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const isJsonParseError =
    err?.type === "entity.parse.failed" ||
    (err instanceof SyntaxError && (err as any)?.status === 400);

  if (isJsonParseError) {
    const details = String(err?.message || "").replace(/^SyntaxError:\s*/, "");
    console.error(details);
    return res.status(HttpStatus.BAD_REQUEST).json({
      error: "Invalid JSON payload",
      details,
    });
  }

  const code = err?.status || HttpStatus.INTERNAL_SERVER_ERROR;
  const message =
    code === HttpStatus.INTERNAL_SERVER_ERROR
      ? "Internal Server Error"
      : String(err?.message || "");
  console.error(message);
  res.status(code).json({ error: message });
}
