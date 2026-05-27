import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { nanoid } from "nanoid";
import type { CreateRecordInput, StoredRecord, UpdateRecordInput } from "../types/record.js";

const currentFile = fileURLToPath(import.meta.url);
const defaultDataFile = resolve(dirname(currentFile), "../../data/records.json");

export class RecordStore {
  constructor(private readonly dataFile = process.env.DATA_FILE ?? defaultDataFile) {}

  async list(): Promise<StoredRecord[]> {
    return this.readRecords();
  }

  async get(id: string): Promise<StoredRecord | undefined> {
    const records = await this.readRecords();
    return records.find((record) => record.id === id);
  }

  async create(input: CreateRecordInput): Promise<StoredRecord> {
    const records = await this.readRecords();
    const now = new Date().toISOString();
    const record: StoredRecord = {
      id: nanoid(),
      name: input.name,
      data: input.data ?? {},
      createdAt: now,
      updatedAt: now
    };

    await this.writeRecords([...records, record]);
    return record;
  }

  async update(id: string, input: UpdateRecordInput): Promise<StoredRecord | undefined> {
    const records = await this.readRecords();
    const index = records.findIndex((record) => record.id === id);

    if (index === -1) {
      return undefined;
    }

    const updated: StoredRecord = {
      ...records[index],
      ...input,
      data: input.data ?? records[index].data,
      updatedAt: new Date().toISOString()
    };

    records[index] = updated;
    await this.writeRecords(records);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const records = await this.readRecords();
    const nextRecords = records.filter((record) => record.id !== id);

    if (nextRecords.length === records.length) {
      return false;
    }

    await this.writeRecords(nextRecords);
    return true;
  }

  private async readRecords(): Promise<StoredRecord[]> {
    try {
      const contents = await readFile(this.dataFile, "utf8");
      return JSON.parse(contents) as StoredRecord[];
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "ENOENT") {
        return [];
      }

      throw error;
    }
  }

  private async writeRecords(records: StoredRecord[]): Promise<void> {
    await mkdir(dirname(this.dataFile), { recursive: true });
    await writeFile(this.dataFile, `${JSON.stringify(records, null, 2)}\n`);
  }
}
