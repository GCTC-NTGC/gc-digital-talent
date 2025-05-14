import fs from "fs";
import os from "os";
import path from "path";

import {
  Classification,
  Community,
  Department,
  Role,
  Skill,
  WorkStream,
} from "@gc-digital-talent/graphql";

interface CacheTypes extends Record<string, unknown> {
  classifications: Classification[];
  communities: Community[];
  departments: Department[];
  roles: Role[];
  skills: Skill[];
  workStreams: WorkStream[];
}

const CACHE_FILE_PATH = path.join(os.tmpdir(), "playwright-api-cache.json");

export class SimpleCache<Types extends Record<string, unknown>> {
  private cache = new Map<keyof Types, Types[keyof Types]>();

  constructor() {
    this.loadFromFile();
  }

  private loadFromFile() {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      try {
        const data = fs.readFileSync(CACHE_FILE_PATH, "utf-8");
        const parsed: Partial<Types> = JSON.parse(data) as Partial<Types>;
        for (const key in parsed) {
          this.cache.set(key as keyof Types, parsed[key as keyof Types]!);
        }
      } catch (error) {
        console.warn("Failed to load cache file:", error);
      }
    }
  }

  private saveToFile() {
    const obj: Partial<Types> = {};
    this.cache.forEach((value, key) => {
      obj[key] = value;
    });
    try {
      fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(obj, null, 2));
    } catch (error) {
      console.warn("Failed to write cache file:", error);
    }
  }

  set<K extends keyof Types>(key: K, value: Types[K]): void {
    this.cache.set(key, value);
    this.saveToFile();
  }

  get<K extends keyof Types>(key: K): Types[K] | undefined {
    return this.cache.get(key) as Types[K] | undefined;
  }

  delete<K extends keyof Types>(key: K): boolean {
    const result = this.cache.delete(key);
    this.saveToFile();
    return result;
  }

  has<K extends keyof Types>(key: K): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
    this.saveToFile();
  }
}

export const apiCache = new SimpleCache<CacheTypes>();
