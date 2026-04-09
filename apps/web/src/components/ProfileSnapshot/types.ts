import { type LocalizedString, type Maybe } from "@gc-digital-talent/graphql";

export interface SnapshotProps<TSnapshot extends object> {
  snapshot: { version?: number } & Partial<TSnapshot>;
}

export type RelatedSnapshotModel<TKey extends string> = Record<
  TKey,
  Maybe<LocalizedString>
>;
