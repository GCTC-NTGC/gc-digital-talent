import { ReactElement } from "react";

import DiversityEquityInclusionV1, {
  DiversityEquityInclusionSnapshotV1,
} from "./DiversityEquityInclusionV1";
import { getSupportedVersionComponent } from "../utils";
import { SnapshotProps } from "../types";

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

  return <Component {...props} />;
}
