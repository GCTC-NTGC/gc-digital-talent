import { ReactElement } from "react";

import WorkPreferencesV1, {
  WorkPreferencesSnapshotV1,
} from "./WorkPreferencesV1";
import { getSupportedVersionComponent } from "../utils";
import { SnapshotProps } from "../types";

type WorkPreferencesSnapshotProps = SnapshotProps<WorkPreferencesSnapshotV1>;

const componentMap = {
  1: WorkPreferencesV1,
  // 2: WorkPreferencesV2, // add when V2 exists
};

export default function WorkPreferencesSnapshot(
  props: WorkPreferencesSnapshotProps,
): ReactElement | null {
  const Component = getSupportedVersionComponent(
    componentMap,
    props.snapshot.version ?? 1,
  );

  if (!Component) return null;

  return <Component {...props} />;
}
