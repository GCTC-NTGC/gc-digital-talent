import { ReactElement } from "react";

import LanguageProfileV1, {
  LanguageProfileSnapshotV1,
} from "./LanguageProfileV1";
import { getSupportedVersionComponent } from "../utils";
import { SnapshotProps } from "../types";

type LanguageProfileSnapshotProps = SnapshotProps<LanguageProfileSnapshotV1>;

const componentMap = {
  1: LanguageProfileV1,
  // 2: LanguageProfileV2, // add when V2 exists
};

export default function LanguageProfileSnapshot(
  props: LanguageProfileSnapshotProps,
): ReactElement | null {
  const Component = getSupportedVersionComponent(
    componentMap,
    props.snapshot.version,
  );

  if (!Component) return null;

  return <Component {...props} />;
}
