import React from "react";
import { useIntl } from "react-intl";

import { Heading } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getAwardedScope,
  getAwardedTo,
  getEducationStatus,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { Skill } from "@gc-digital-talent/graphql";

import { Experience, Maybe } from "~/api/generated";
import {
  getExperienceFormLabels,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
  useExperienceInfo,
} from "~/utils/experienceUtils";
import { getDateRange } from "~/utils/dateUtils";

interface ExperienceItemProps {
  experience: Experience;
}

const ExperienceItem = ({ experience }: ExperienceItemProps) => {
  const intl = useIntl();
  const { title } = useExperienceInfo(experience);
  const experienceLabels = getExperienceFormLabels(intl);

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

  const renderSkills = (skills: Maybe<Skill[]>) =>
    skills ? (
      <ul>
        {skills?.map((skill) => (
          <li key={skill.id}>
            {getLocalizedName(skill.name, intl)}
            {skill.experienceSkillRecord?.details
              ? ` - ${skill.experienceSkillRecord?.details}`
              : ""}
          </li>
        ))}
      </ul>
    ) : (
      ""
    );

  let content = null;
  let dateRange = null;

  if (isAwardExperience(experience)) {
    dateRange = normalizedDateRange(experience.awardedDate, undefined);
    content = (
      <>
        <p>
          {experienceLabels.awardedTo}
          {intl.formatMessage(commonMessages.dividingColon)}
          {intl.formatMessage(
            experience.awardedTo
              ? getAwardedTo(experience.awardedTo)
              : commonMessages.notAvailable,
          )}
        </p>
        <p>
          {experienceLabels.issuedBy}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.issuedBy}
        </p>
        <p>
          {experienceLabels.awardedScope}
          {intl.formatMessage(commonMessages.dividingColon)}
          {intl.formatMessage(
            experience.awardedScope
              ? getAwardedScope(experience.awardedScope)
              : commonMessages.notAvailable,
          )}
        </p>
        <p>
          {experienceLabels.details}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.details}
        </p>
        {renderSkills(experience.skills)}
      </>
    );
  }

  if (isCommunityExperience(experience)) {
    dateRange = normalizedDateRange(experience.startDate, experience.endDate);
    content = (
      <>
        <p>
          {experienceLabels.project}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.project}
        </p>
        <p>
          {experienceLabels.details}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.details}
        </p>
        {renderSkills(experience.skills)}
      </>
    );
  }

  if (isEducationExperience(experience)) {
    dateRange = normalizedDateRange(experience.startDate, experience.endDate);
    content = (
      <>
        <p>
          {experienceLabels.areaOfStudy}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.areaOfStudy}
        </p>
        <p>
          {experienceLabels.educationStatus}
          {intl.formatMessage(commonMessages.dividingColon)}
          {intl.formatMessage(
            experience.status
              ? getEducationStatus(experience.status)
              : commonMessages.notAvailable,
          )}
        </p>
        <p>
          {experienceLabels.thesisTitle}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.thesisTitle}
        </p>
        <p>
          {experienceLabels.details}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.details}
        </p>
        {renderSkills(experience.skills)}
      </>
    );
  }

  if (isPersonalExperience(experience)) {
    dateRange = normalizedDateRange(experience.startDate, experience.endDate);
    content = (
      <>
        <p>
          {intl.formatMessage({
            defaultMessage: "Learning description",
            id: "szVmh/",
            description:
              "Label displayed on Personal Experience form for learning description section",
          })}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.description}
        </p>
        <p>
          {experienceLabels.details}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.details}
        </p>
        {renderSkills(experience.skills)}
      </>
    );
  }

  if (isWorkExperience(experience)) {
    dateRange = normalizedDateRange(experience.startDate, experience.endDate);
    content = (
      <>
        <p>
          {experienceLabels.team}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.division}
        </p>
        <p>
          {experienceLabels.details}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.details}
        </p>
        {renderSkills(experience.skills)}
      </>
    );
  }

  return (
    <div data-h2-break-inside="base(avoid) base:print(avoid)">
      {title && <Heading level="h5">{title}</Heading>}
      {dateRange && <p>{dateRange}</p>}
      {content && content}
    </div>
  );
};

export default ExperienceItem;
