import type { ReactElement } from "react";

import type { SnapshotProps } from "../types";
import { getSupportedVersionComponent } from "../utils";
import type { WorkPreferencesSnapshotV1 } from "./WorkPreferencesV1";
import WorkPreferencesV1 from "./WorkPreferencesV1";

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
    props.snapshot.version,
  );

  if (!Component) return null;

  // componentMap is constant, so this is always the same component, not a new one.
  // oxlint-disable-next-line react/static-components
  return <Component {...props} />;
}
