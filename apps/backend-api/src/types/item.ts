export type ItemData = Record<string, unknown>;

export interface Item {
  id: string;
  name: string;
  data: ItemData;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemInput {
  name: string;
  data?: ItemData;
}

export interface UpdateItemInput {
  name?: string;
  data?: ItemData;
}
