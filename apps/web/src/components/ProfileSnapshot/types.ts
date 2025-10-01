import { ComponentType } from "react";

import { LocalizedString, Maybe } from "@gc-digital-talent/graphql";

export interface SnapshotProps<TSnapshot extends object> {
  snapshot: { version?: number } & Partial<TSnapshot>;
}

export type ComponentMap = Record<number, ComponentType<unknown>>;

export type RelatedSnapshotModel<TKey extends string> = Record<
  TKey,
  Maybe<LocalizedString>
>;
