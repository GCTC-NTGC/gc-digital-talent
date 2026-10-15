import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import { hasEmptyRequiredFields } from "~/validators/experience/community";

import CommunityDialogContent from "./CommunityDialogContent";
import type { ExperienceDialogBaseProps } from "./ExperienceDialog";
import ExperienceDialog from "./ExperienceDialog";

export const CommunityExperienceDialog_Fragment = graphql(/* GraphQL */ `
  fragment CommunityExperienceDialog on CommunityExperience {
    ...ExperienceDialog
    title
    organization
    project
    startDate
    endDate
    details
  }
`);

interface CommunityExperienceDialogProps extends ExperienceDialogBaseProps {
  experienceQuery: FragmentType<typeof CommunityExperienceDialog_Fragment>;
}

const CommunityExperienceDialog = ({
  experienceQuery,
  ...rest
}: CommunityExperienceDialogProps) => {
  const experience = getFragment(
    CommunityExperienceDialog_Fragment,
    experienceQuery,
  );
  const isMissingInfo = hasEmptyRequiredFields(experience);

  return (
    <ExperienceDialog
      experienceQuery={experience}
      isMissingInfo={isMissingInfo}
      {...rest}
    >
      <CommunityDialogContent experience={experience} headingRank="h3" />
    </ExperienceDialog>
  );
};

export default CommunityExperienceDialog;
