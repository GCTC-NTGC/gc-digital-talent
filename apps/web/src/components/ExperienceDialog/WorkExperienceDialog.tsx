import type { WorkDialogContentExperience } from "./WorkDialogContent";
import WorkDialogContent from "./WorkDialogContent";
import type { ExperienceDialogBaseProps } from "./ExperienceDialog";
import ExperienceDialog from "./ExperienceDialog";
import type { DialogExperience } from "./types";

export type WorkDialogExperience =
  DialogExperience<WorkDialogContentExperience>;

interface WorkExperienceDialogProps extends ExperienceDialogBaseProps {
  experience: WorkDialogExperience;
}

const WorkExperienceDialog = ({
  experience,
  ...rest
}: WorkExperienceDialogProps) => (
  <ExperienceDialog experience={experience} {...rest}>
    <WorkDialogContent experience={experience} headingRank="h3" />
  </ExperienceDialog>
);

export default WorkExperienceDialog;
