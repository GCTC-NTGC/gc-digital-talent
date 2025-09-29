import PersonalInformationV1, {
  PersonalInformationSnapshotV1,
} from "./PersonalInformationV1";
import { SnapshotComponent } from "../types";
import SnapshotDisplay, { SnapshotDisplayProps } from "../SnapshotDisplay";

// Union to contain possible versions of props
type VersionedProps = PersonalInformationSnapshotV1;

const componentMap = new Map<number, SnapshotComponent<VersionedProps>>([
  [1, PersonalInformationV1],
]);

const PersonalInformationSnapshot = (
  props: Omit<SnapshotDisplayProps<VersionedProps>, "components">,
) => <SnapshotDisplay {...props} components={componentMap} />;

export default PersonalInformationSnapshot;
