import React from "react";
import { useIntl } from "react-intl";

import {
  commonMessages,
  getAwardedTo,
  getEducationStatus,
  getLocalizedName,
} from "@gc-digital-talent/i18n";

import {
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  Experience,
  PersonalExperience,
  Skill,
  WorkExperience,
} from "~/api/generated";
import { getExperienceSkills } from "~/utils/skillUtils";
import experienceMessages from "~/messages/experienceMessages";
import { formattedDate, getDateRange } from "~/utils/dateUtils";
import {
  getExperienceFormLabels,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
} from "~/utils/experienceUtils";

const PageSection = ({ children }: { children: React.ReactNode }) => (
  <div
    data-h2-margin-bottom="base(2rem)"
    data-h2-display="base(block)"
    data-h2-break-inside="base(avoid) base:print(avoid)"
    data-h2-break-after="base(avoid) base:print(avoid)"
  >
    {children}
  </div>
);

const getRelevantSkillRecordDetails = (
  experience: Experience,
  sectionSkill: Skill,
): string | null => {
  const experienceSkills = experience.skills ?? [];
  const applicableSkill = experienceSkills.find(
    (skill) => skill.id === sectionSkill.id,
  );

  return applicableSkill?.experienceSkillRecord?.details ?? null;
};

export interface SkillWithExperiencesProps {
  skill: Skill;
  experiences: Experience[];
}

const SkillWithExperiences = ({
  skill,
  experiences,
}: SkillWithExperiencesProps): JSX.Element => {
  const intl = useIntl();
  const skillExperiences = getExperienceSkills(experiences, skill);
  const experienceFormLabels = getExperienceFormLabels(intl);

  const experienceListForSkill = (
    experience:
      | AwardExperience
      | CommunityExperience
      | EducationExperience
      | PersonalExperience
      | WorkExperience,
    sectionSkill: Skill,
  ): JSX.Element => {
    if (isAwardExperience(experience)) {
      const { title, issuedBy, awardedDate, awardedTo, details } = experience;
      return (
        <>
          <p>
            {intl.formatMessage(experienceMessages.awardIssuedBy, {
              title,
              issuedBy,
            })}
          </p>
          <p>
            {awardedDate
              ? formattedDate(awardedDate, intl)
              : intl.formatMessage(commonMessages.notProvided)}
          </p>
          <p>
            {experienceFormLabels.awardedTo}
            {intl.formatMessage(commonMessages.dividingColon)}
            {awardedTo
              ? intl.formatMessage(getAwardedTo(awardedTo))
              : intl.formatMessage(commonMessages.notAvailable)}
          </p>
          <p>
            {experienceFormLabels.howIUsed}
            {intl.formatMessage(commonMessages.dividingColon)}
            {getRelevantSkillRecordDetails(experience, sectionSkill) ??
              intl.formatMessage(commonMessages.notAvailable)}
          </p>
          <p>{details}</p>
          <p>
            {experienceFormLabels.details}
            {intl.formatMessage(commonMessages.dividingColon)}
            {details ?? intl.formatMessage(commonMessages.notAvailable)}
          </p>
        </>
      );
    }
    if (isCommunityExperience(experience)) {
      const { title, organization, endDate, startDate, project, details } =
        experience;
      return (
        <>
          <p>
            {intl.formatMessage(experienceMessages.communityAt, {
              title,
              organization,
            })}
          </p>
          <p>{getDateRange({ endDate, startDate, intl })}</p>
          <p>
            {experienceFormLabels.project}
            {intl.formatMessage(commonMessages.dividingColon)}
            {project ?? intl.formatMessage(commonMessages.notAvailable)}
          </p>
          <p>
            {experienceFormLabels.howIUsed}
            {intl.formatMessage(commonMessages.dividingColon)}
            {getRelevantSkillRecordDetails(experience, sectionSkill) ??
              intl.formatMessage(commonMessages.notAvailable)}
          </p>
          <p>
            {experienceFormLabels.details}
            {intl.formatMessage(commonMessages.dividingColon)}
            {details ?? intl.formatMessage(commonMessages.notAvailable)}
          </p>
        </>
      );
    }
    if (isEducationExperience(experience)) {
      const { areaOfStudy, institution, startDate, endDate, status, details } =
        experience;
      return (
        <>
          <p>
            {intl.formatMessage(experienceMessages.educationAt, {
              areaOfStudy,
              institution,
            })}
          </p>
          <p>{getDateRange({ endDate, startDate, intl })}</p>
          <p>
            {experienceFormLabels.educationStatus}
            {intl.formatMessage(commonMessages.dividingColon)}
            {status
              ? intl.formatMessage(getEducationStatus(status))
              : intl.formatMessage(commonMessages.notAvailable)}
          </p>
          <p>
            {experienceFormLabels.howIUsed}
            {intl.formatMessage(commonMessages.dividingColon)}
            {getRelevantSkillRecordDetails(experience, sectionSkill) ??
              intl.formatMessage(commonMessages.notAvailable)}
          </p>
          <p>
            {experienceFormLabels.details}
            {intl.formatMessage(commonMessages.dividingColon)}
            {details ?? intl.formatMessage(commonMessages.notAvailable)}
          </p>
        </>
      );
    }
    if (isPersonalExperience(experience)) {
      const { details, title, startDate, endDate, description } = experience;
      return (
        <>
          <p>{title || ""}</p>
          <p>{getDateRange({ endDate, startDate, intl })}</p>
          <p>{description}</p>
          <p>
            {experienceFormLabels.howIUsed}
            {intl.formatMessage(commonMessages.dividingColon)}
            {getRelevantSkillRecordDetails(experience, sectionSkill) ??
              intl.formatMessage(commonMessages.notAvailable)}
          </p>
          <p>
            {experienceFormLabels.details}
            {intl.formatMessage(commonMessages.dividingColon)}
            {details ?? intl.formatMessage(commonMessages.notAvailable)}
          </p>
        </>
      );
    }
    const { role, organization, startDate, endDate, division, details } =
      experience; // left with work experience
    return (
      <>
        <p>
          {intl.formatMessage(experienceMessages.workAt, {
            role,
            organization,
          })}
        </p>
        <p>{getDateRange({ endDate, startDate, intl })}</p>
        <p>
          {experienceFormLabels.team}
          {intl.formatMessage(commonMessages.dividingColon)}
          {division ?? intl.formatMessage(commonMessages.notAvailable)}
        </p>
        <p>
          {experienceFormLabels.howIUsed}
          {intl.formatMessage(commonMessages.dividingColon)}
          {getRelevantSkillRecordDetails(experience, sectionSkill) ??
            intl.formatMessage(commonMessages.notAvailable)}
        </p>
        <p>
          {experienceFormLabels.details}
          {intl.formatMessage(commonMessages.dividingColon)}
          {details ?? intl.formatMessage(commonMessages.notAvailable)}
        </p>
      </>
    );
  };

  const description = getLocalizedName(skill.description, intl, true);

  return (
    <PageSection>
      <p data-h2-font-weight="base(700)">
        {getLocalizedName(skill.name, intl)}
      </p>
      {description && <p>{description}</p>}
      <ul>
        {skillExperiences.map((experience) => {
          return (
            <li key={experience.id}>
              {experienceListForSkill(experience, skill)}
            </li>
          );
        })}
      </ul>
    </PageSection>
  );
};

export default SkillWithExperiences;
