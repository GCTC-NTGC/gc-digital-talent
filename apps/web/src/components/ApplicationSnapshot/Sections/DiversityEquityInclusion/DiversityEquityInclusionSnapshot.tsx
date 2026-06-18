import type { ReactElement } from "react";

import type { DiversityEquityInclusionSnapshotV1 } from "./DiversityEquityInclusionV1";
import DiversityEquityInclusionV1 from "./DiversityEquityInclusionV1";
import { getSupportedVersionComponent } from "../utils";
import type { SnapshotProps } from "../types";

type DiversityEquityInclusionSnapshotProps =
  SnapshotProps<DiversityEquityInclusionSnapshotV1>;

const componentMap = {
  1: DiversityEquityInclusionV1,
  // 2: DiversityEquityInclusionV2, // add when V2 exists
};

export default function DiversityEquityInclusionSnapshot(
  props: DiversityEquityInclusionSnapshotProps,
): ReactElement | null {
  const Component = getSupportedVersionComponent(
    componentMap,
    props.snapshot.version,
  );

  if (!Component) return null;

  // componentMap is constant, so this is always the same component, not a new one.
  // eslint-disable-next-line react-hooks/static-components
  return <Component {...props} />;
}
