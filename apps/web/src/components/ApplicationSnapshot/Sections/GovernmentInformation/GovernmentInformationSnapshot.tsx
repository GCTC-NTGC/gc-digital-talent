import type { ReactElement } from "react";

import type { GovernmentInformationSnapshotV1 } from "./GovernmentInformationV1";
import GovernmentInformationV1 from "./GovernmentInformationV1";
import { getSupportedVersionComponent } from "../utils";
import type { SnapshotProps } from "../types";

type GovernmentInformationSnapshotProps =
  SnapshotProps<GovernmentInformationSnapshotV1>;

const componentMap = {
  1: GovernmentInformationV1,
  // 2: GovernmentInformationV2, // add when V2 exists
};

export default function GovernmentInformationSnapshot(
  props: GovernmentInformationSnapshotProps,
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
