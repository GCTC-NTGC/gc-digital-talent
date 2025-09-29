import { ReactElement } from "react";

import PersonalInformationV1, {
  PersonalInformationSnapshotV1,
} from "./PersonalInformationV1";
import { getSupportedVersionComponent } from "../utils";
import { SnapshotProps } from "../types";

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
    props.snapshot.version ?? 1,
  );

  if (!Component) return null;

  return <Component {...props} />;
}
