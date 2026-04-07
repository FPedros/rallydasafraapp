import { DatabaseSchema } from "../types/entities.js";
import { mockData } from "./mockData.js";

export class InMemoryDatabase {
  private data: DatabaseSchema = structuredClone(mockData);

  public getCollection<K extends keyof DatabaseSchema>(collection: K): DatabaseSchema[K] {
    return this.data[collection];
  }

  public setCollection<K extends keyof DatabaseSchema>(collection: K, value: DatabaseSchema[K]) {
    this.data[collection] = value;
  }

  public findById<K extends keyof DatabaseSchema>(
    collection: K,
    id: string
  ): DatabaseSchema[K][number] | undefined {
    return this.data[collection].find((item) => item.id === id);
  }
}

export const db = new InMemoryDatabase();
