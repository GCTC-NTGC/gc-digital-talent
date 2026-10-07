import type { EducationDialogContentExperience } from "./EducationDialogContent";
import EducationDialogContent from "./EducationDialogContent";
import type { ExperienceDialogBaseProps } from "./ExperienceDialog";
import ExperienceDialog from "./ExperienceDialog";
import DetailsSection from "./DetailsSection";
import type { DialogExperience, ExperienceDetails } from "./types";

export type EducationDialogExperience = DialogExperience<
  EducationDialogContentExperience & ExperienceDetails
>;

interface EducationExperienceDialogProps extends ExperienceDialogBaseProps {
  experience: EducationDialogExperience;
}

const EducationExperienceDialog = ({
  experience,
  ...rest
}: EducationExperienceDialogProps) => (
  <ExperienceDialog experience={experience} {...rest}>
    <EducationDialogContent experience={experience} headingRank="h3" />
    <DetailsSection details={experience.details} />
  </ExperienceDialog>
);

export default EducationExperienceDialog;
