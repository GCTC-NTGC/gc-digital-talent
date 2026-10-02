import { useIntl } from "react-intl";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import type { CommunityContentExperience } from "../ExperienceCard/CommunityContent";
import CommunityContent from "../ExperienceCard/CommunityContent";
import type { ExperienceDialogBaseProps } from "./ExperienceDialog";
import ExperienceDialog from "./ExperienceDialog";
import DetailsSection from "./DetailsSection";
import type { DialogExperience, ExperienceDetails } from "./types";

export type CommunityDialogExperience = DialogExperience<
  CommunityContentExperience & ExperienceDetails
>;

interface CommunityExperienceDialogProps extends ExperienceDialogBaseProps {
  experience: CommunityDialogExperience;
}

const CommunityExperienceDialog = ({
  experience,
  ...rest
}: CommunityExperienceDialogProps) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  return (
    <ExperienceDialog experience={experience} {...rest}>
      <CommunityContent experience={experience} headingRank="h3" />
      <DetailsSection
        title={experienceFormLabels.keyTasksAndResponsibilities}
        details={experience.details}
      />
    </ExperienceDialog>
  );
};

export default CommunityExperienceDialog;
