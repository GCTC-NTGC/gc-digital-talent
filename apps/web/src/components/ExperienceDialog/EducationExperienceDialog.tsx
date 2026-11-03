import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import EducationDialogContent from "./EducationDialogContent";
import type { ExperienceDialogBaseProps } from "./ExperienceDialog";
import ExperienceDialog from "./ExperienceDialog";
import DetailsSection from "./DetailsSection";

export const EducationExperienceDialog_Fragment = graphql(/* GraphQL */ `
  fragment EducationExperienceDialog on EducationExperience {
    ...ExperienceDialog
    institution
    otherEducationType
    otherFellowshipType
    areaOfStudy
    licenseOrAccreditation
    certification
    courseName
    thesisTitle
    startDate
    endDate
    prospectiveEndDate
    details
    educationType {
      value
      label {
        localized
      }
    }
    degreeType {
      value
      label {
        localized
      }
    }
    fellowshipType {
      value
      label {
        localized
      }
    }
    status {
      value
      label {
        localized
      }
    }
  }
`);

interface EducationExperienceDialogProps extends ExperienceDialogBaseProps {
  experienceQuery: FragmentType<typeof EducationExperienceDialog_Fragment>;
}

const EducationExperienceDialog = ({
  experienceQuery,
  ...rest
}: EducationExperienceDialogProps) => {
  const experience = getFragment(
    EducationExperienceDialog_Fragment,
    experienceQuery,
  );

  return (
    <ExperienceDialog experienceQuery={experience} {...rest}>
      <EducationDialogContent experience={experience} headingRank="h3" />
      <DetailsSection details={experience.details} />
    </ExperienceDialog>
  );
};

export default EducationExperienceDialog;
