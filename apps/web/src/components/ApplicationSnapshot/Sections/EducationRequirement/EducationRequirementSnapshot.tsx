import type { ReactElement } from "react";

import type {
  EducationRequirementSnapshotV1,
  EducationRequirementV1Props,
} from "./EducationRequirementV1";
import EducationRequirementV1 from "./EducationRequirementV1";
import { getSupportedVersionComponent } from "../utils";
import type { SnapshotProps } from "../types";

interface EducationRequirementSnapshotProps extends SnapshotProps<EducationRequirementSnapshotV1> {
  educationRequirementQuery?: EducationRequirementV1Props["educationRequirementQuery"];
}

const componentMap = {
  1: EducationRequirementV1,
  // 2: EducationRequirementV2, // add when V2 exists
};

export default function EducationRequirementSnapshot(
  props: EducationRequirementSnapshotProps,
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
