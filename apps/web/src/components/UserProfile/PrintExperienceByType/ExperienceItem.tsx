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
import { Skill, Experience, Maybe } from "@gc-digital-talent/graphql";

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
    startDate: Maybe<string> | undefined,
    endDate: Maybe<string> | undefined,
  ) => {
    return getDateRange({
      startDate,
      endDate,
      intl,
    });
  };

  const renderSkills = (skills: Maybe<Skill[]> | undefined) =>
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
        <p className="mb-6">
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
        <p className="mb-6">
          {experienceLabels.project}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.project}
        </p>
        <p className="mb-6">
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
        <p className="mb-6">
          {experienceLabels.thesisTitle}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.thesisTitle}
        </p>
        <p className="mb-6">
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
        <p className="mb-6">
          {intl.formatMessage({
            defaultMessage: "Learning description",
            id: "szVmh/",
            description:
              "Label displayed on Personal Experience form for learning description section",
          })}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.description}
        </p>
        <p className="mb-6">
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
        <p className="mb-6">
          {experienceLabels.team}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.division}
        </p>
        <p className="mb-6">
          {experienceLabels.details}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.details}
        </p>
        {renderSkills(experience.skills)}
      </>
    );
  }

  return (
    <div className="break-inside-avoid">
      <div className="mb-6">
        {title && (
          <Heading level="h5" className="font-bold">
            {title}
          </Heading>
        )}
        {dateRange && <p>{dateRange}</p>}
      </div>
      {content && content}
    </div>
  );
};

export default ExperienceItem;
