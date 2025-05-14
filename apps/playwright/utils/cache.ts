import {
  Classification,
  Community,
  Department,
  Role,
  Skill,
  WorkStream,
} from "@gc-digital-talent/graphql";

export class SimpleCache<Types extends Record<string, unknown>> {
  private cache = new Map<keyof Types, Types[keyof Types]>();

  set<K extends keyof Types>(key: K, value: Types[K]): void {
    this.cache.set(key, value);
  }

  get<K extends keyof Types>(key: K): Types[K] | undefined {
    return this.cache.get(key) as Types[K] | undefined;
  }

  delete<K extends keyof Types>(key: K): boolean {
    return this.cache.delete(key);
  }

  has<K extends keyof Types>(key: K): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

interface CacheTypes extends Record<string, unknown> {
  classifications: Classification[];
  communities: Community[];
  departments: Department[];
  roles: Role[];
  skills: Skill[];
  workStreams: WorkStream[];
}

export const apiCache = new SimpleCache<CacheTypes>();
