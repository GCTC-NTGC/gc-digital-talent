import { ReactElement } from "react";

import GovernmentInformationV1, {
  GovernmentInformationSnapshotV1,
} from "./GovernmentInformationV1";
import { getSupportedVersionComponent } from "../utils";
import { SnapshotProps } from "../types";

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

  return <Component {...props} />;
}
