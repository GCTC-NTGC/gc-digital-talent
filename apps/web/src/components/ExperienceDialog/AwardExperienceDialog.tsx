import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import AwardDialogContent from "./AwardDialogContent";
import type { ExperienceDialogBaseProps } from "./ExperienceDialog";
import ExperienceDialog from "./ExperienceDialog";
import DetailsSection from "./DetailsSection";

export const AwardExperienceDialog_Fragment = graphql(/* GraphQL */ `
  fragment AwardExperienceDialog on AwardExperience {
    ...ExperienceDialog
    title
    awardedDate
    issuedBy
    details
    projectName
    awardedTo {
      value
      label {
        localized
      }
    }
    awardedScope {
      value
      label {
        localized
      }
    }
    relatedExperience {
      ... on CommunityExperience {
        __typename
        id
        title
        organization
      }
      ... on EducationExperience {
        __typename
        id
        educationType {
          value
          label {
            en
            fr
          }
        }
        degreeType {
          value
          label {
            en
            fr
          }
        }
        fellowshipType {
          value
          label {
            en
            fr
          }
        }
        otherEducationType
        otherFellowshipType
        areaOfStudy
        institution
        licenseOrAccreditation
        certification
      }
      ... on PersonalExperience {
        __typename
        id
        title
      }
      ... on WorkExperience {
        __typename
        id
        role
        organization
        employmentCategory {
          value
          label {
            en
            fr
          }
        }
        department {
          id
          name {
            en
            fr
          }
        }
        cafForce {
          value
          label {
            en
            fr
          }
        }
      }
    }
  }
`);

interface AwardExperienceDialogProps extends ExperienceDialogBaseProps {
  experienceQuery: FragmentType<typeof AwardExperienceDialog_Fragment>;
}

const AwardExperienceDialog = ({
  experienceQuery,
  ...rest
}: AwardExperienceDialogProps) => {
  const experience = getFragment(
    AwardExperienceDialog_Fragment,
    experienceQuery,
  );

  return (
    <ExperienceDialog experienceQuery={experience} {...rest}>
      <AwardDialogContent experience={experience} headingRank="h3" />
      <DetailsSection details={experience.details} />
    </ExperienceDialog>
  );
};

export default AwardExperienceDialog;
