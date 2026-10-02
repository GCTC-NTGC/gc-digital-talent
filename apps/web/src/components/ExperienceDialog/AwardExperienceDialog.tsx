import { useIntl } from "react-intl";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import type { AwardContentExperience } from "../ExperienceCard/AwardContent";
import AwardContent from "../ExperienceCard/AwardContent";
import type { ExperienceDialogBaseProps } from "./ExperienceDialog";
import ExperienceDialog from "./ExperienceDialog";
import DetailsSection from "./DetailsSection";
import type { DialogExperience, ExperienceDetails } from "./types";

export type AwardDialogExperience = DialogExperience<
  AwardContentExperience & ExperienceDetails
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
      <AwardContent experience={experience} headingRank="h3" />
      <DetailsSection
        title={experienceFormLabels.details}
        details={experience.details}
      />
    </ExperienceDialog>
  );
};

export default AwardExperienceDialog;
