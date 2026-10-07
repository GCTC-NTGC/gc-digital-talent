import type { CommunityDialogContentExperience } from "./CommunityDialogContent";
import CommunityDialogContent from "./CommunityDialogContent";
import type { ExperienceDialogBaseProps } from "./ExperienceDialog";
import ExperienceDialog from "./ExperienceDialog";
import type { DialogExperience } from "./types";

export type CommunityDialogExperience =
  DialogExperience<CommunityDialogContentExperience>;

interface CommunityExperienceDialogProps extends ExperienceDialogBaseProps {
  experience: CommunityDialogExperience;
}

const CommunityExperienceDialog = ({
  experience,
  ...rest
}: CommunityExperienceDialogProps) => (
  <ExperienceDialog experience={experience} {...rest}>
    <CommunityDialogContent experience={experience} headingRank="h3" />
  </ExperienceDialog>
);

export default CommunityExperienceDialog;
