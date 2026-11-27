import type { ReactElement } from "react";

import type { SnapshotProps } from "../types";
import { getSupportedVersionComponent } from "../utils";
import type { CitizenVeteranPrioritySnapshotV1 } from "./CitizenVeteranPriorityV1";
import CitizenVeteranPriorityV1 from "./CitizenVeteranPriorityV1";

type CitizenVeteranPrioritySnapshotProps =
  SnapshotProps<CitizenVeteranPrioritySnapshotV1>;

const componentMap = {
  1: CitizenVeteranPriorityV1,
  // 2: CitizenVeteranPriorityV2, // add when V2 exists
};

export default function CitizenVeteranPrioritySnapshot(
  props: CitizenVeteranPrioritySnapshotProps,
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
