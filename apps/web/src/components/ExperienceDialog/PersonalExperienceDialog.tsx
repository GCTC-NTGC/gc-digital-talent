import type { PersonalContentExperience } from "../ExperienceCard/PersonalContent";
import PersonalContent from "../ExperienceCard/PersonalContent";
import type { ExperienceDialogBaseProps } from "./ExperienceDialog";
import ExperienceDialog from "./ExperienceDialog";
import type { DialogExperience } from "./types";

export type PersonalDialogExperience =
  DialogExperience<PersonalContentExperience>;

interface PersonalExperienceDialogProps extends ExperienceDialogBaseProps {
  experience: PersonalDialogExperience;
}

// Personal experiences have no details field, matching ExperienceCard
const PersonalExperienceDialog = ({
  experience,
  ...rest
}: PersonalExperienceDialogProps) => (
  <ExperienceDialog experience={experience} {...rest}>
    <PersonalContent experience={experience} headingRank="h3" />
  </ExperienceDialog>
);

export default PersonalExperienceDialog;
