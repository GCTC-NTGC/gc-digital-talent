import { JSX } from "react";

export interface VersionedSnapshot {
  version?: number;
}

export interface ProfileSnapshotProps<T> {
  snapshot: Partial<T>;
}

export type SnapshotComponent<T> = (
  props: ProfileSnapshotProps<T>,
) => JSX.Element;
