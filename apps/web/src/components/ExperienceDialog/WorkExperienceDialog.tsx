import { hasEmptyRequiredFields } from "~/validators/experience/work";

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
}: WorkExperienceDialogProps) => {
  const isMissingInfo = hasEmptyRequiredFields(experience);

  return (
    <ExperienceDialog
      experience={experience}
      isMissingInfo={isMissingInfo}
      {...rest}
    >
      <WorkDialogContent experience={experience} headingRank="h3" />
    </ExperienceDialog>
  );
};

export default WorkExperienceDialog;
