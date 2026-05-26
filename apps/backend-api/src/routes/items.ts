import { Router } from "express";
import type { CreateItemInput, UpdateItemInput } from "../types/item.js";
import { ItemStore } from "../services/itemStore.js";

export function createItemsRouter(itemStore = new ItemStore()): Router {
  const router = Router();

  router.get("/", async (_request, response, next) => {
    try {
      response.json(await itemStore.list());
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (request, response, next) => {
    try {
      const input = request.body as CreateItemInput;

      if (!isValidCreateInput(input)) {
        response.status(400).json({ error: "A non-empty string 'name' is required." });
        return;
      }

      const item = await itemStore.create(input);
      response.status(201).json(item);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (request, response, next) => {
    try {
      const item = await itemStore.get(request.params.id);

      if (!item) {
        response.status(404).json({ error: "Item not found." });
        return;
      }

      response.json(item);
    } catch (error) {
      next(error);
    }
  });

  router.put("/:id", async (request, response, next) => {
    try {
      const input = request.body as UpdateItemInput;

      if (!isValidUpdateInput(input)) {
        response.status(400).json({ error: "Provide 'name' as a string and/or 'data' as an object." });
        return;
      }

      const item = await itemStore.update(request.params.id, input);

      if (!item) {
        response.status(404).json({ error: "Item not found." });
        return;
      }

      response.json(item);
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:id", async (request, response, next) => {
    try {
      const deleted = await itemStore.delete(request.params.id);

      if (!deleted) {
        response.status(404).json({ error: "Item not found." });
        return;
      }

      response.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  return router;
}

function isValidCreateInput(input: CreateItemInput): boolean {
  return Boolean(input?.name && typeof input.name === "string" && isValidData(input.data));
}

function isValidUpdateInput(input: UpdateItemInput): boolean {
  return Boolean(input && (input.name === undefined || typeof input.name === "string") && isValidData(input.data));
}

function isValidData(data: unknown): boolean {
  return data === undefined || (typeof data === "object" && data !== null && !Array.isArray(data));
}
