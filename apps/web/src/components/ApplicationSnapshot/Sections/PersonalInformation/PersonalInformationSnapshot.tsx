import type { ReactElement } from "react";

import type { SnapshotProps } from "../types";
import { getSupportedVersionComponent } from "../utils";
import type { PersonalInformationSnapshotV1 } from "./PersonalInformationV1";
import PersonalInformationV1 from "./PersonalInformationV1";

type PersonalInformationSnapshotProps =
  SnapshotProps<PersonalInformationSnapshotV1>;

const componentMap = {
  1: PersonalInformationV1,
  // 2: PersonalInformationV2, // add when V2 exists
};

export default function PersonalInformationSnapshot(
  props: PersonalInformationSnapshotProps,
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
