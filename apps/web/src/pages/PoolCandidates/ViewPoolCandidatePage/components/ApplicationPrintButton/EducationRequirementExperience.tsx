import { JSX } from "react";
import { useIntl } from "react-intl";

import {
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  PersonalExperience,
  WorkExperience,
} from "@gc-digital-talent/graphql";

import experienceMessages from "~/messages/experienceMessages";
import {
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
} from "~/utils/experienceUtils";

interface EducationRequirementExperienceProps {
  experience:
    | AwardExperience
    | CommunityExperience
    | EducationExperience
    | PersonalExperience
    | WorkExperience;
}

const EducationRequirementExperience = ({
  experience,
}: EducationRequirementExperienceProps): JSX.Element => {
  const intl = useIntl();

  if (isAwardExperience(experience)) {
    const { title, issuedBy } = experience;
    return (
      <li>
        {intl.formatMessage(experienceMessages.awardIssuedBy, {
          title,
          issuedBy,
        })}
      </li>
    );
  }
  if (isCommunityExperience(experience)) {
    const { title, organization } = experience;
    return (
      <li>
        {intl.formatMessage(experienceMessages.communityAt, {
          title,
          organization,
        })}
      </li>
    );
  }
  if (isEducationExperience(experience)) {
    const { areaOfStudy, institution } = experience;
    return (
      <li>
        {intl.formatMessage(experienceMessages.educationAt, {
          areaOfStudy,
          institution,
        })}
      </li>
    );
  }
  if (isPersonalExperience(experience)) {
    const { title } = experience;
    return <li>{title || ""}</li>;
  }

  // left with work experience
  const { role, organization } = experience;
  return (
    <li>
      {intl.formatMessage(experienceMessages.workAt, {
        role,
        organization,
      })}
    </li>
  );
};
export default EducationRequirementExperience;
