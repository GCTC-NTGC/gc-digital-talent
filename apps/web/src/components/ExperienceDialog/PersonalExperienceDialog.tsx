import type { PersonalDialogContentExperience } from "./PersonalDialogContent";
import PersonalDialogContent from "./PersonalDialogContent";
import type { ExperienceDialogBaseProps } from "./ExperienceDialog";
import ExperienceDialog from "./ExperienceDialog";
import type { DialogExperience } from "./types";

export type PersonalDialogExperience =
  DialogExperience<PersonalDialogContentExperience>;

interface PersonalExperienceDialogProps extends ExperienceDialogBaseProps {
  experience: PersonalDialogExperience;
}

// Personal experiences have no details field, matching ExperienceCard
const PersonalExperienceDialog = ({
  experience,
  ...rest
}: PersonalExperienceDialogProps) => (
  <ExperienceDialog experience={experience} {...rest}>
    <PersonalDialogContent experience={experience} headingRank="h3" />
  </ExperienceDialog>
);

export default PersonalExperienceDialog;
