import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import { createItemsRouter } from "./routes/items.js";

export function createApp(): express.Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.use("/api/items", createItemsRouter());
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

const notFoundHandler: express.RequestHandler = (_request, response) => {
  response.status(404).json({ error: "Route not found." });
};

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: "Internal server error." });
};
