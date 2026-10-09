import { hasEmptyRequiredFields } from "~/validators/experience/award";

import type { AwardDialogContentExperience } from "./AwardDialogContent";
import AwardDialogContent from "./AwardDialogContent";
import type { ExperienceDialogBaseProps } from "./ExperienceDialog";
import ExperienceDialog from "./ExperienceDialog";
import DetailsSection from "./DetailsSection";
import type { DialogExperience, ExperienceDetails } from "./types";

export type AwardDialogExperience = DialogExperience<
  AwardDialogContentExperience & ExperienceDetails
>;

interface AwardExperienceDialogProps extends ExperienceDialogBaseProps {
  experience: AwardDialogExperience;
}

const AwardExperienceDialog = ({
  experience,
  ...rest
}: AwardExperienceDialogProps) => {
  const isMissingInfo = hasEmptyRequiredFields(experience);

  return (
    <ExperienceDialog
      experience={experience}
      isMissingInfo={isMissingInfo}
      {...rest}
    >
      <AwardDialogContent experience={experience} headingRank="h3" />
      <DetailsSection details={experience.details} />
    </ExperienceDialog>
  );
};

export default AwardExperienceDialog;
