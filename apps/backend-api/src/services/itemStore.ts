import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { nanoid } from "nanoid";
import type { CreateItemInput, Item, UpdateItemInput } from "../types/item.js";

const currentFile = fileURLToPath(import.meta.url);
const defaultDataFile = resolve(dirname(currentFile), "../../data/items.json");

export class ItemStore {
  constructor(private readonly dataFile = process.env.DATA_FILE ?? defaultDataFile) {}

  async list(): Promise<Item[]> {
    return this.readItems();
  }

  async get(id: string): Promise<Item | undefined> {
    const items = await this.readItems();
    return items.find((item) => item.id === id);
  }

  async create(input: CreateItemInput): Promise<Item> {
    const items = await this.readItems();
    const now = new Date().toISOString();
    const item: Item = {
      id: nanoid(),
      name: input.name,
      data: input.data ?? {},
      createdAt: now,
      updatedAt: now
    };

    await this.writeItems([...items, item]);
    return item;
  }

  async update(id: string, input: UpdateItemInput): Promise<Item | undefined> {
    const items = await this.readItems();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      return undefined;
    }

    const updated: Item = {
      ...items[index],
      ...input,
      data: input.data ?? items[index].data,
      updatedAt: new Date().toISOString()
    };

    items[index] = updated;
    await this.writeItems(items);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const items = await this.readItems();
    const nextItems = items.filter((item) => item.id !== id);

    if (nextItems.length === items.length) {
      return false;
    }

    await this.writeItems(nextItems);
    return true;
  }

  private async readItems(): Promise<Item[]> {
    try {
      const contents = await readFile(this.dataFile, "utf8");
      return JSON.parse(contents) as Item[];
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "ENOENT") {
        return [];
      }

      throw error;
    }
  }

  private async writeItems(items: Item[]): Promise<void> {
    await mkdir(dirname(this.dataFile), { recursive: true });
    await writeFile(this.dataFile, `${JSON.stringify(items, null, 2)}\n`);
  }
}
