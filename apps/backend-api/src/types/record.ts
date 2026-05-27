export type RecordData = Record<string, unknown>;

export interface StoredRecord {
  id: string;
  name: string;
  data: RecordData;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecordInput {
  name: string;
  data?: RecordData;
}

export interface UpdateRecordInput {
  name?: string;
  data?: RecordData;
}
