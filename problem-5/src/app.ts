import express, { Request, Response } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorHandler, notFoundHandler } from "./middleware";
import birdsRouter from "./routes/birds";
import { config } from "./config";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const isProd = config.nodeEnv === "production";

if (isProd) app.set("trust proxy", 1);

app.disable("x-powered-by");
app.use(helmet());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json({ limit: "10kb" }));

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.use("/birds", birdsRouter);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
