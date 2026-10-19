import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import PersonalDialogContent from "./PersonalDialogContent";
import type { ExperienceDialogBaseProps } from "./ExperienceDialog";
import ExperienceDialog from "./ExperienceDialog";

export const PersonalExperienceDialog_Fragment = graphql(/* GraphQL */ `
  fragment PersonalExperienceDialog on PersonalExperience {
    ...ExperienceDialog
    title
    organization
    learningDescription
    startDate
    endDate
  }
`);

interface PersonalExperienceDialogProps extends ExperienceDialogBaseProps {
  experienceQuery: FragmentType<typeof PersonalExperienceDialog_Fragment>;
}

// Personal experiences have no details field, matching ExperienceCard
const PersonalExperienceDialog = ({
  experienceQuery,
  ...rest
}: PersonalExperienceDialogProps) => {
  const experience = getFragment(
    PersonalExperienceDialog_Fragment,
    experienceQuery,
  );

  return (
    <ExperienceDialog experienceQuery={experience} {...rest}>
      <PersonalDialogContent experience={experience} headingRank="h3" />
    </ExperienceDialog>
  );
};

export default PersonalExperienceDialog;
