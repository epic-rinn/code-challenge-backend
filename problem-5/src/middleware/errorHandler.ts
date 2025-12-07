import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../utils";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const code = err?.status || HttpStatus.INTERNAL_SERVER_ERROR;
  console.error(err);
  res.status(code).json({
    error:
      code === HttpStatus.INTERNAL_SERVER_ERROR
        ? "Internal Server Error"
        : err.message,
  });
}
