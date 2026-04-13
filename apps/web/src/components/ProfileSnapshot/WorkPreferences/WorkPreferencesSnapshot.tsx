import type { ReactElement } from "react";

import type { FragmentType } from "@gc-digital-talent/graphql";

import type { FlexibleWorkLocationOptions_Fragment } from "~/components/Profile/components/WorkPreferences/fragment";

import type {
  WorkPreferencesSnapshotV1,
} from "./WorkPreferencesV1";
import WorkPreferencesV1 from "./WorkPreferencesV1";
import { getSupportedVersionComponent } from "../utils";
import type { SnapshotProps } from "../types";

type WorkPreferencesSnapshotProps = SnapshotProps<WorkPreferencesSnapshotV1> & {
  optionsQuery:
    | FragmentType<typeof FlexibleWorkLocationOptions_Fragment>
    | undefined;
};

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

  return <Component {...props} />;
}
