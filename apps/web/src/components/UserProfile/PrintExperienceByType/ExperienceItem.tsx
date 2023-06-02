import React from "react";
import { useIntl } from "react-intl";

import {
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
  useExperienceInfo,
} from "~/utils/experienceUtils";
import { Experience, Maybe } from "~/api/generated";
import { getDateRange } from "~/utils/dateUtils";

import AwardContent from "../../ExperienceCard/AwardContent";
import CommunityContent from "../../ExperienceCard/CommunityContent";
import EducationContent from "../../ExperienceCard/EducationContent";
import PersonalContent from "../../ExperienceCard/PersonalContent";
import WorkContent from "../../ExperienceCard/WorkContent";

interface ExperienceItemProps {
  experience: Experience;
}

const ExperienceItem = ({ experience }: ExperienceItemProps) => {
  const intl = useIntl();
  const { title } = useExperienceInfo(experience);

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
  if (isAwardExperience(experience)) {
    content = AwardContent({ experience });
    dateRange = normalizedDateRange(experience.awardedDate, undefined);
  }

  if (isCommunityExperience(experience)) {
    content = CommunityContent({ experience });
    dateRange = normalizedDateRange(experience.startDate, experience.endDate);
  }

  if (isEducationExperience(experience)) {
    content = EducationContent({ experience });
    dateRange = normalizedDateRange(experience.startDate, experience.endDate);
  }

  if (isPersonalExperience(experience)) {
    content = PersonalContent({ experience });
    dateRange = normalizedDateRange(experience.startDate, experience.endDate);
  }

  if (isWorkExperience(experience)) {
    content = WorkContent({ experience });
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
