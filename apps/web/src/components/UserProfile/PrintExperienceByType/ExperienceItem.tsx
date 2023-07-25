import React from "react";
import { useIntl } from "react-intl";

import {
  getExperienceFormLabels,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
  useExperienceInfo,
} from "~/utils/experienceUtils";
import { Experience, Maybe } from "~/api/generated";
import { Heading } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getAwardedScope,
  getAwardedTo,
  getEducationStatus,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { Skill } from "@gc-digital-talent/graphql";
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
          {intl.formatMessage({
            defaultMessage: "Awarded to",
            id: "YJS2CB",
            description: "The award was given to",
          })}
          {intl.formatMessage(commonMessages.dividingColon)}
          {intl.formatMessage(
            experience.awardedTo
              ? getAwardedTo(experience.awardedTo)
              : commonMessages.notAvailable,
          )}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage: "Issuing organization",
            id: "NGEgVN",
            description:
              "Label displayed on award form for organization section",
          })}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.issuedBy}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage: "Award scope",
            id: "jhhCKX",
            description: "Label displayed on award form for scope section",
          })}
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
          {intl.formatMessage({
            defaultMessage: "Project / product",
            id: "gEBoM0",
            description:
              "Label displayed on Community Experience form for Project / product section",
          })}
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
          {intl.formatMessage({
            defaultMessage: "Area of study",
            id: "nzw1ry",
            description:
              "Label displayed on education form for area of study input",
          })}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.areaOfStudy}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage: "Status",
            id: "OQhL7A",
            description: "Label displayed on Education form for status input",
          })}
          {intl.formatMessage(commonMessages.dividingColon)}
          {intl.formatMessage(
            experience.status
              ? getEducationStatus(experience.status)
              : commonMessages.notAvailable,
          )}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage: "Thesis title",
            id: "E9I34y",
            description:
              "Label displayed on education form for thesis title input",
          })}
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
          {intl.formatMessage({
            defaultMessage: "Team, group, or division",
            id: "qn77WI",
            description:
              "Label displayed on Work Experience form for team/group/division input",
          })}
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
    <div>
      {title && <Heading level="h5">{title}</Heading>}
      {dateRange && <p>{dateRange}</p>}
      {content && content}
    </div>
  );
};

export default ExperienceItem;
