import React from "react";
import { useIntl } from "react-intl";

import {
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/types/experience";
import { Experience, Maybe } from "~/api/generated";
import { getDateRange } from "../accordionUtils";
import { AwardContent } from "../ExperienceAccordion/individualExperienceAccordions/AwardAccordion";
import { CommunityContent } from "../ExperienceAccordion/individualExperienceAccordions/CommunityAccordion";
import { EducationContent } from "../ExperienceAccordion/individualExperienceAccordions/EducationAccordion";
import { PersonalContent } from "../ExperienceAccordion/individualExperienceAccordions/PersonalAccordion";
import { WorkContent } from "../ExperienceAccordion/individualExperienceAccordions/WorkAccordion";

interface ExperienceItemProps {
  experience: Experience;
}

const ExperienceItem = ({ experience }: ExperienceItemProps) => {
  const intl = useIntl();

  const normalizedDateRange = (
    startDate: Maybe<string>,
    endDate: Maybe<string>,
  ) => {
    return getDateRange({
      startDate,
      endDate,
      intl,
    });
  };

  let content = null;
  let dateRange = null;
  let title = null; // Not all experiences have titles
  if (isAwardExperience(experience)) {
    title = experience.title;
    content = AwardContent({ ...experience });
    dateRange = normalizedDateRange(experience.awardedDate, undefined);
  }

  if (isCommunityExperience(experience)) {
    title = experience.title;
    content = CommunityContent({ ...experience });
    dateRange = normalizedDateRange(experience.startDate, experience.endDate);
  }

  if (isEducationExperience(experience)) {
    title = intl.formatMessage(
      {
        defaultMessage: "{areaOfStudy} at {institution}",
        id: "UrsGGK",
        description: "Study at institution",
      },
      {
        areaOfStudy: experience.areaOfStudy,
        institution: experience.institution,
      },
    );
    content = EducationContent({ ...experience });
    dateRange = normalizedDateRange(experience.startDate, experience.endDate);
  }

  if (isPersonalExperience(experience)) {
    title = experience.title;
    content = PersonalContent({ ...experience });
    dateRange = normalizedDateRange(experience.startDate, experience.endDate);
  }

  if (isWorkExperience(experience)) {
    title = intl.formatMessage(
      {
        defaultMessage: "{role} at {organization}",
        id: "wTAdQe",
        description: "Role at organization",
      },
      { role: experience.role, organization: experience.organization },
    );
    content = WorkContent({ ...experience });
    dateRange = normalizedDateRange(experience.startDate, experience.endDate);
  }

  return (
    <>
      {title && <h3>{title}</h3>}
      {dateRange && <p>{dateRange}</p>}
      {content}
    </>
  );
};

export default ExperienceItem;
