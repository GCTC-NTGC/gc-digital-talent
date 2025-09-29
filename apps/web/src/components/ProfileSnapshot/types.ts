import { ComponentType } from "react";

export interface SnapshotProps<TSnapshot extends object> {
  snapshot: { version?: number } & Partial<TSnapshot>;
}

export type ComponentMap = Record<number, ComponentType<unknown>>;
