import { useIntl } from "react-intl";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

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
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  return (
    <ExperienceDialog experience={experience} {...rest}>
      <AwardDialogContent experience={experience} headingRank="h3" />
      <DetailsSection
        title={experienceFormLabels.details}
        details={experience.details}
      />
    </ExperienceDialog>
  );
};

export default AwardExperienceDialog;
