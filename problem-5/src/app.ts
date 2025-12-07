import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import logger from "pino-http";
import { errorHandler, notFoundHandler } from "./middleware";
import birdsRouter from "./routes/birds";
import { config } from "./config";
import { healthHandler } from "./controllers/health.controller";
import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "./docs/openapi";

const app = express();

app.use(logger({ transport: { target: "pino-http-print" } }));

// use a single JSON parser with size limit
app.use(express.urlencoded({ extended: true }));

const isProd = config.nodeEnv === "production";

if (isProd) app.set("trust proxy", 1);

app.disable("x-powered-by");
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));

if (!isProd) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
}

app.get("/health", healthHandler);

app.use("/birds", birdsRouter);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
