import { Router } from "express";
import type { CreateRecordInput, UpdateRecordInput } from "../types/record.js";
import { RecordStore } from "../services/recordStore.js";

export function createRecordsRouter(recordStore = new RecordStore()): Router {
  const router = Router();

  router.get("/", async (_request, response, next) => {
    try {
      response.json(await recordStore.list());
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (request, response, next) => {
    try {
      const input = request.body as CreateRecordInput;

      if (!isValidCreateInput(input)) {
        response.status(400).json({ error: "A non-empty string 'name' is required." });
        return;
      }

      const record = await recordStore.create(input);
      response.status(201).json(record);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (request, response, next) => {
    try {
      const record = await recordStore.get(request.params.id);

      if (!record) {
        response.status(404).json({ error: "Record not found." });
        return;
      }

      response.json(record);
    } catch (error) {
      next(error);
    }
  });

  router.put("/:id", async (request, response, next) => {
    try {
      const input = request.body as UpdateRecordInput;

      if (!isValidUpdateInput(input)) {
        response.status(400).json({ error: "Provide 'name' as a string and/or 'data' as an object." });
        return;
      }

      const record = await recordStore.update(request.params.id, input);

      if (!record) {
        response.status(404).json({ error: "Record not found." });
        return;
      }

      response.json(record);
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:id", async (request, response, next) => {
    try {
      const deleted = await recordStore.delete(request.params.id);

      if (!deleted) {
        response.status(404).json({ error: "Record not found." });
        return;
      }

      response.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  return router;
}

function isValidCreateInput(input: CreateRecordInput): boolean {
  return Boolean(input?.name && typeof input.name === "string" && isValidData(input.data));
}

function isValidUpdateInput(input: UpdateRecordInput): boolean {
  return Boolean(input && (input.name === undefined || typeof input.name === "string") && isValidData(input.data));
}

function isValidData(data: unknown): boolean {
  return data === undefined || (typeof data === "object" && data !== null && !Array.isArray(data));
}
