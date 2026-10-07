import { useIntl } from "react-intl";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

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
}: EducationExperienceDialogProps) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  return (
    <ExperienceDialog experience={experience} {...rest}>
      <EducationDialogContent experience={experience} headingRank="h3" />
      <DetailsSection
        title={experienceFormLabels.details}
        details={experience.details}
      />
    </ExperienceDialog>
  );
};

export default EducationExperienceDialog;
