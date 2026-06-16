import type { LocalizedString } from "@gc-digital-talent/graphql";

export interface SnapshotProps<TSnapshot extends object> {
  snapshot: { version?: number } & Partial<TSnapshot>;
}

export type RelatedSnapshotModel<TKey extends string> = Record<
  TKey,
  LocalizedString | null
>;
