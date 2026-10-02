import { useIntl } from "react-intl";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import type { ExperienceWorkContent } from "../ExperienceCard/WorkContent";
import WorkContent from "../ExperienceCard/WorkContent";
import type { ExperienceWorkStream } from "../ExperienceCard/WorkContent/WorkStreamsContent";
import WorkStreamContent from "../ExperienceCard/WorkContent/WorkStreamsContent";
import type { ExperienceDialogBaseProps } from "./ExperienceDialog";
import ExperienceDialog from "./ExperienceDialog";
import DetailsSection from "./DetailsSection";
import type { DialogExperience, ExperienceDetails } from "./types";

interface WorkStreamsExperience {
  workStreams?: ExperienceWorkStream[] | null;
}

export type WorkDialogExperience = DialogExperience<
  ExperienceWorkContent & ExperienceDetails & WorkStreamsExperience
>;

interface WorkExperienceDialogProps extends ExperienceDialogBaseProps {
  experience: WorkDialogExperience;
}

const WorkExperienceDialog = ({
  experience,
  ...rest
}: WorkExperienceDialogProps) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  return (
    <ExperienceDialog experience={experience} {...rest}>
      <WorkContent experience={experience} headingRank="h3" />
      <DetailsSection
        title={experienceFormLabels.keyTasksAndResponsibilities}
        details={experience.details}
      />
      <WorkStreamContent
        workStreams={experience.workStreams}
        headingRank="h3"
      />
    </ExperienceDialog>
  );
};

export default WorkExperienceDialog;
