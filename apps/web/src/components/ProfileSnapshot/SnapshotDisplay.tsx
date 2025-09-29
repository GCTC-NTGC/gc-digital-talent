import {
  ProfileSnapshotProps,
  SnapshotComponent,
  VersionedSnapshot,
} from "./types";

export interface SnapshotDisplayProps<T>
  extends VersionedSnapshot,
    ProfileSnapshotProps<T> {
  components: Map<number, SnapshotComponent<T>>;
}

const SnapshotDisplay = <T,>({
  version,
  components,
  snapshot,
}: SnapshotDisplayProps<T>) => {
  const El = components.get(version ?? 1);
  if (!El) return null;
  return <El snapshot={snapshot} />;
};

export default SnapshotDisplay;
