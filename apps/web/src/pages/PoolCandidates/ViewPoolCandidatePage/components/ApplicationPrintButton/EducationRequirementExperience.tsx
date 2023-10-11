import React from "react";
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

export interface EducationRequirementExperienceProps {
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
    const { title, issuedBy, id } = experience;
    return (
      <li key={id}>
        {intl.formatMessage(experienceMessages.awardIssuedBy, {
          title,
          issuedBy,
        })}
      </li>
    );
  }
  if (isCommunityExperience(experience)) {
    const { title, organization, id } = experience;
    return (
      <li key={id}>
        {intl.formatMessage(experienceMessages.communityAt, {
          title,
          organization,
        })}
      </li>
    );
  }
  if (isEducationExperience(experience)) {
    const { areaOfStudy, institution, id } = experience;
    return (
      <li key={id}>
        {intl.formatMessage(experienceMessages.educationAt, {
          areaOfStudy,
          institution,
        })}
      </li>
    );
  }
  if (isPersonalExperience(experience)) {
    const { title, id } = experience;
    return <li key={id}>{title || ""}</li>;
  }

  // left with work experience
  const { role, organization, id } = experience;
  return (
    <li key={id}>
      {intl.formatMessage(experienceMessages.workAt, {
        role,
        organization,
      })}
    </li>
  );
};
export default EducationRequirementExperience;
